# Detector choice across platforms

The web detector offers a persisted model selector before camera start. GPU phone detection uses RT-DETR R18 Objects365 FP32, fixed 640×640, single full-frame pass, with the verified 82.5 MB WebGPU export. Standard detection uses COCO-SSD. A saved choice is never silently replaced when its runtime is unavailable: the UI reports the problem and lets the user choose another model. Stop the camera before switching. Without a saved choice, WebGPU browsers start with R18 and other browsers start with Standard.

The landing clip now runs live inference through the same camera adapter and PhoneOverlay smoother. It honors the saved camera model choice; without one, it chooses R18 on WebGPU browsers and Standard otherwise. It never replays precomputed boxes. Pausing, seeking, hiding the page, and playback loops clear tracking; navigation disposes the detector. The preview is silent and uses recorded footage only. The model lab's R18 FP32 / WebGPU / full-frame option runs the actual camera adapter continuously against the clip. It displays the analyzed frame and fresh detections, not interpolated boxes. Tracking accepts a new phone at 0.40, or a nearby continuation at 0.18; the inference adapter returns no prediction when a frame has no accepted detection. The camera display separately smooths box movement and holds the last observed box for at most 250 ms through brief misses. That held display never triggers an alarm. Association is retained for up to 250 ms to reacquire a nearby weaker phone. The lab still displays only fresh predictions.

## Future native iOS app

There is no native iOS project yet. Preserve model selection as a product requirement:

- Separate model identity from runtime (WebGPU on web; native runtime to be investigated). The current `r18-gpu` web preference must be explicitly mapped if imported into a native app.
- Offer only validated model/runtime combinations; persist the user's selection in native settings and show download size, availability, loading errors, and retry/change-model controls.
- Keep a common detect/reset/dispose lifecycle. Reset tracking on camera changes and discard late results after stopping. Avoid overlapping inference.
- Revalidate every converted or quantized export against reference outputs and labeled real footage before offering it. The experimental INT8 WebGPU export is rejected and must remain unavailable.

Physical iPhone research is deferred. Before claiming live iPhone support, measure cold download/load, sustained capture-to-result latency, tracking coverage and false positives, memory, heat and battery on named devices and OS/browser versions. Include the example clip, blank negatives, and varied real gym lighting, distances, orientations and occlusions. Desktop timing is not an iPhone performance claim. Validate a native conversion independently; this web export does not establish Core ML compatibility.

## Reviewing smoothing locally

Open `/model-lab/#live-check`. The left panel overlays the shared `PhoneOverlay` smoother on live playback; the right panel retains fresh predictions on the exact analyzed frame. R18 FP32 / WebGPU / full frame uses the camera adapter. Choose a 15-second benchmark or continuous preview. Pause detections to test expiry, then resume or stop. Coverage and timing count actual inference only, never held display boxes. The live overlay clears on stop and playback loops.
