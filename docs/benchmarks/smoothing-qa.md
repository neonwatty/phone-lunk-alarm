# Clip smoothing QA — October 16, 2026

Local production export at localhost:3107, this machine's in-app browser, R18 Objects365 FP32 / WebGPU / full frame. The live left overlay uses the exact PhoneOverlay class used by PhoneDetector; the right panel shows the analyzed frame with its accepted fresh prediction.

- Continuous run with a manual pause/resume: 320/320 measured frames with fresh accepted detections, median 36 ms, P95 60 ms. Paused intervals do not count as measurements.
- During pause the left box expired and the clip continued playing. The right panel retained the last analyzed frame, explicitly labeled as such. The count remained 226/226 while paused. Resume reacquired the phone. Stop cleared the live overlay.
- `clip-smoothing.png` shows the two boxes on the phone. `clip-smoothing-paused.png` shows the live box absent after pausing. These screenshots verify appearance/expiry, not a quantified localization-accuracy score.
- Browser error log was empty. 94 tests, type checking, lint and production build passed. Unit tests exercise the 250 ms expiry, jitter easing, snapping to a distant detection, reset, and avoiding canvas resizing during pending inference.

This validates one recorded clip on this computer. Physical iPhone performance and varied live footage remain separate work.

Uninterrupted 15-second follow-up: 149/150 fresh accepted detections, 35 ms median, 37 ms P95; run completed normally. See `smoothing-browser-runs.txt`. Smoothing does not hide this one-frame detection miss from the coverage metric.
