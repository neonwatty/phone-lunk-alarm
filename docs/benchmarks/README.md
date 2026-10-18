# Smaller phone detectors — initial local evaluation

**Follow-up:** GPU compatibility is now fixed for FP32. See [GPU results](gpu-results.md) for the verified export and live measurements. The results below describe the earlier baseline.

Measured 2026-10-15 on Apple M5 Max. These are local desktop measurements,
not evidence of iPhone speed, battery use, thermal behavior, or camera accuracy.

Seven RT-DETR variants were screened on the same nine decoded clip frames.
`small-models.json` contains raw boxes, confidence scores, timings, and blank
negative controls. The lab table uses its full-frame results. The original R50
preview uses full frame plus crop, so its timing is separately identified.

The strongest compact candidate is `onnx-community/rtdetr_r18vd_coco_o365`,
INT8 (21.7 MB of model weights). On 45 samples at 10 Hz it acquires on frame 2
and tracks 44/45. FP32 (82.6 MB) tracks 45/45. Both return no phone predictions
on a uniform gray image. The acquisition threshold remains 0.40; continuation
requires a nearby model prediction >=0.18. No boxes are invented for misses.

This is **track coverage on one clip**, not an annotated accuracy benchmark.
Only 11/45 INT8 frames and 19/45 FP32 frames independently reach the acquisition
threshold. The rest rely on association with an existing track. This distinction
matters when live processing is too slow to maintain continuity.

`r18-phone-boxes.jpg` shows the highest-scoring full-precision predictions on nine
evenly spaced frames. Visual inspection places them on the phone at the user's
hands, including during leg movement. Full predictions are saved in the dense
JSON files; images were decoded with FFmpeg from the checked-in MP4.

Browser tests use a background worker, one WebAssembly thread, continuous video,
one warmup frame, and 20 measured frames. Timing includes worker round trips,
preprocessing, inference, and postprocessing, but excludes loading. The canvas
shows the exact captured frame, preventing stale boxes appearing on newer frames.
Do not equate the native Node CPU timings with the browser measurements.

Both R18 Objects365 variants failed the WebGPU check with:
`using ceil() in shape computation is not yet supported for AveragePool`.
No silent fallback is used. YOLOv10n also failed compatibility with the installed
Transformers.js object-detection pipeline; this is not an accuracy result.

Conclusion: a substantially smaller model can recognize this clip, but a reliable
live mobile replacement has **not** been established. WebAssembly runs too slowly
in the tested browser; WebGPU currently needs compatible export/runtime work.
The lab leaves the production landing preview and camera detector unchanged.
Next validation requires a compatible accelerated runtime followed by actual
phone tests and more positive and negative clips.

Reproduction commands are in `SETUP.md`; `/model-lab/` allows repeating the browser
checks and comparing both outputs locally.

Recorded desktop WebAssembly medians / P95 (20 frames each): R50 FP32 two-pass
4946 / 4982 ms; R18 Objects365 FP32 1136 / 1181 ms; R18 Objects365 INT8
1162 / 1187 ms. At this latency the R18 runs accepted only 10/20 and 4/20 live
frames respectively. The baseline's initial tracking count is deliberately not
reported: clip time aliased across loops. The lab now ages tracks using monotonic
capture timestamps, and resets association on a detected source-time rewind.
Frame-processing timings are unaffected by that correction.

Production-export verification at `http://localhost:3107/model-lab/` repeated
INT8 after the monotonic-clock correction: 1155 ms median, 1169 ms P95, 2/20
acquisition-eligible and accepted frames. Different playback start phases produce
different hit counts; the second run confirms the live tracking limitation.
The production worker loaded and completed all 20 frames. Build and type checking
passed; all 79 existing tests passed (with existing jsdom/React warnings).
