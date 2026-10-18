# GPU compatibility and live clip test

2026-10-15, Apple M5 Max, Codex in-app browser. These are desktop measurements.

The working candidate is R18 Objects365 FP32, **82.5 MB**, with the original
weights and thresholds. ONNX Runtime Web 1.30.0 alone still rejected ceil pooling.
A reproducible export specializes input to `[1,3,640,640]` and changes three
AveragePool `ceil_mode` attributes to zero. Their inputs are 160×160, 80×80,
and 40×40, with 2×2 kernels, stride 2, no padding. Every window fits exactly.
The fixed input contract prevents using this equivalence for arbitrary shapes.

Preparation checks the source checksum and graph invariants, then verifies CPU
outputs against the fixed-shape original graph on a zero input and two seeded
random inputs. Graph optimization is disabled for that isolated comparison.
Floating-point differences are small, not bitwise zero: maximum logit error
0.0001541, maximum normalized-box error 0.0000206. The report and tolerances are
in `gpu-export-parity.json`.

The INT8 version failed that same numerical check (large output differences),
so its GPU export is rejected explicitly. It remains available only on CPU.
This work does not establish that quantized GPU inference is safe or equivalent.

## Browser validation

`gpu-browser-parity.json` compares the original FP32 model on WebAssembly with
the prepared FP32 model on WebGPU using identical decoded frames:

- Nine samples across the entire clip: strongest phone boxes exactly match
  after integer pixel rounding (IoU 1.0 on all nine).
- Maximum confidence-score difference: 0.00000325.
- All acquisition-threshold decisions agree.
- Gray negative control: neither model reports a phone.

This is a targeted regression check, not general precision/recall. Some frames
also contain low-confidence secondary detections; the existing tracker still
requires 0.40 for acquisition and spatial association for >=0.18 continuation.

## Speed and tracking

The clip is 45 frames at **10 fps**. Final tests use video-frame callbacks so
each decoded source frame is analyzed at most once. Runs last at least 15 seconds
and 20 measured inferences, excluding one warmup frame. Processing time includes
frame transfer, preprocessing, inference, and postprocessing, but excludes waiting
for the next decoded frame and model loading. Inference capacity is not video fps.

First distinct-frame WebGPU run: median **38 ms**, P95 **48 ms**, **150/150**
accepted tracks across multiple clip loops. Same-runtime WebAssembly comparison:
median **1135 ms**, P95 **1137 ms**, **8/20** accepted tracks. The GPU is about
30× faster for this test and keeps up with every new frame in the clip.

The raw browser session table is in `gpu-browser-runs.txt`. Its first two rows
predate distinct-frame sampling and include repeated source frames; they are
retained for audit only, not used for the final coverage claim. Row two was
stopped manually. The 150-frame GPU row and 20-frame CPU row use the final sampler.

The model lab defaults to this GPU candidate and exposes the identical-frame
validation button. No camera model replacement was made. Actual iPhone/Safari
speed, loading, memory, battery, thermals, and broader accuracy remain untested.
See `SETUP.md` for preparing the ignored model assets on a fresh checkout.

Repeated distinct-frame GPU run: **151/151** tracks, median **38 ms**, P95
**48 ms**. Together the two completed runs tracked **301/301** sampled frames
across more than six clip loops. This includes continuation from lower-confidence
model predictions; it is not 301 independent high-confidence acquisitions.

Production static build at `http://localhost:3107/model-lab/` also completed:
**150/151** accepted tracks, median **38 ms**, P95 **48 ms**. This final run had
one missed frame; coverage is not guaranteed to be perfect for arbitrary start
phases. Three distinct-frame runs together accepted 451/452 frames. The final
browser screenshot placed the box on the phone in the subject's hands. Raw
production results are in `gpu-production-run.txt`.

Verification: production build and TypeScript checks passed; 83 tests passed.
The generated 82,542,104-byte model was served successfully by the static host.

## Camera integration — October 16, 2026

Production build, same computer/browser, R18 FP32 / WebGPU / full frame, now using `createLivePhoneDetector` (the actual camera adapter) in the model lab: 149/150 distinct frames tracked, 59/150 above acquisition threshold, 37 ms median and 43 ms P95. The final analyzed-frame screenshot shows the box on the phone; one frame was missed. This is clip coverage, not a general accuracy claim or physical iPhone result.

Evidence: `integrated-camera-run.txt`, `integrated-camera-clip.png`. Unit tests verify unsupported saved GPU choice recovery, model retry, and discarding inference that completes after a reset. Fresh source download/conversion passes parity and reproduces the pinned export checksum. Temporarily removing weights makes the build guard exit 1; weights restored afterward. 89 unit tests, lint, type checking and production build pass. Native iOS implementation and physical-device validation remain deferred.
