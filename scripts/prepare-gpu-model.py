"""Prepare a fixed 640x640 R18 export; prove redundant ceil pooling is removable.
Usage: python scripts/prepare-gpu-model.py /path/to/rtdetr_r18vd_coco_o365/cache
Requires: onnx, onnxruntime, numpy. Generated weights are not committed.
"""
import argparse, hashlib, json, pathlib, shutil, tempfile, urllib.request
import numpy as np
import onnx
import onnxruntime as ort

parser = argparse.ArgumentParser()
parser.add_argument('source', type=pathlib.Path, nargs='?', help='Optional existing Hugging Face model directory')
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parents[1]
# Downloads are temporary; the weight checksum below pins the accepted source.
cache = tempfile.TemporaryDirectory(prefix='phone-lunk-model-') if args.source is None else None
if cache:
    args.source = pathlib.Path(cache.name)
    (args.source / 'onnx').mkdir()
    for name in ['config.json', 'preprocessor_config.json', 'onnx/model.onnx']:
        urllib.request.urlretrieve('https://huggingface.co/onnx-community/rtdetr_r18vd_coco_o365/resolve/main/' + name, args.source / name)
dest = root / 'public/models/r18-o365-gpu'
(dest / 'onnx').mkdir(parents=True, exist_ok=True)
for name in ['config.json', 'preprocessor_config.json']:
    shutil.copyfile(args.source / name, dest / name)
reports = []
for filename in ['model.onnx']:
    print('Checking', filename, flush=True)
    source = args.source / 'onnx' / filename
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    assert source_hash == '6c74a62251534f427294342508a162a7cd142418b4dd6222d0d0198851724bfa', 'Unexpected source weights; revalidate before converting'
    model = onnx.load(source)
    assert len(model.graph.input) == 1 and model.graph.input[0].name == 'pixel_values'
    for dim, value in zip(model.graph.input[0].type.tensor_type.shape.dim, [1, 3, 640, 640], strict=True):
        dim.dim_value = value
    # Re-infer actual dimensions after specializing the graph's input contract.
    del model.graph.value_info[:]
    model = onnx.shape_inference.infer_shapes(model)
    shapes = {v.name: [d.dim_value for d in v.type.tensor_type.shape.dim] for v in model.graph.value_info}
    reference = model.SerializeToString()
    patched = []
    for node in model.graph.node:
        attrs = {a.name: onnx.helper.get_attribute_value(a) for a in node.attribute}
        if node.op_type != 'AveragePool' or attrs.get('ceil_mode') != 1:
            continue
        spatial = shapes[node.input[0]][-2:]
        assert attrs['kernel_shape'] == [2, 2] and attrs['strides'] == [2, 2]
        assert attrs['pads'] == [0, 0, 0, 0] and all(d > 0 and d % 2 == 0 for d in spatial)
        # Every window fits exactly: ceil and floor have identical shape and values.
        for attr in node.attribute:
            if attr.name == 'ceil_mode': attr.i = 0
        patched.append({'node': node.name, 'inputSpatialShape': spatial})
    assert len(patched) == 3, 'Unexpected export structure; do not guess a conversion'
    onnx.checker.check_model(model)
    target = dest / 'onnx' / filename
    # Verify before publishing the generated export.
    candidate = model.SerializeToString()
    verification = ort.SessionOptions()
    verification.graph_optimization_level = ort.GraphOptimizationLevel.ORT_DISABLE_ALL
    before = ort.InferenceSession(reference, sess_options=verification, providers=['CPUExecutionProvider'])
    after = ort.InferenceSession(candidate, sess_options=verification, providers=['CPUExecutionProvider'])
    rng = np.random.default_rng(42)
    errors = []
    for pixels in [np.zeros((1,3,640,640), dtype=np.float32), rng.random((1,3,640,640), dtype=np.float32), rng.random((1,3,640,640), dtype=np.float32)]:
        a, b = before.run(None, {'pixel_values': pixels}), after.run(None, {'pixel_values': pixels})
        differences = [float(np.max(np.abs(x-y))) for x,y in zip(a,b,strict=True)]
        for x,y in zip(a,b,strict=True): np.testing.assert_allclose(x,y,rtol=1e-4,atol=1e-3)
        errors.append(differences)
    target.write_bytes(candidate)
    reports.append({'file': filename, 'sourceSha256': source_hash, 'reference': 'fixed-shape original ceil pooling, CPU graph optimizations disabled', 'tolerance': {'rtol': 1e-4, 'atol': 1e-3}, 'outputSha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'bytes': target.stat().st_size, 'patched': patched, 'maxAbsoluteOutputErrors': errors})
(root / 'docs/benchmarks/gpu-export-parity.json').write_text(json.dumps(reports, indent=2)+'\n')
print(json.dumps(reports, indent=2))
