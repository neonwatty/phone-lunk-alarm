# Phase 2A: Test react-webcam with Capacitor

**Goal**: Verify if react-webcam works with Capacitor without refactoring
**Time**: 30 minutes
**Risk**: Low (just testing, no code changes)
**Created**: 2025-11-08

---

## Why This Matters

**Original assumption**: react-webcam doesn't work in Capacitor iOS WebView
**Research finding**: iOS 14.5+ (April 2021) added native getUserMedia support
**Key insight**: Most failures are due to missing permissions, not the library

**If this test succeeds → Save 6-8 hours of refactoring work! 🎉**

---

## Prerequisites

Before starting this test:

- [x] Phase 1 completed (Capacitor installed and configured)
- [ ] Real iOS device available (iOS 15.5+)
  - Simulator CANNOT test camera
  - Must be physical iPhone/iPad
- [ ] Device connected to Mac via USB
- [ ] Xcode installed and updated
- [ ] Current codebase is working (camera works on web)

---

## Step-by-Step Test Plan

### Step 1: Add iOS Permissions (5 minutes)

After running `npx cap add ios` in Phase 1, you'll have an iOS project.

**1.1 Open Info.plist in Xcode**

```bash
npx cap open ios
```

**1.2 Navigate to Info.plist**
- In Xcode Project Navigator: `App` → `App` → `Info.plist`
- Right-click → Open As → Source Code

**1.3 Add BOTH camera and microphone permissions**

Add these entries inside the `<dict>` tag:

```xml
<key>NSCameraUsageDescription</key>
<string>Phone Lunk uses your camera to detect phones in restricted areas and trigger alerts.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Required for camera access (WebRTC security model).</string>
```

**Why both?** WebRTC's security model requires microphone permission even if you don't use audio. Without it, `navigator.mediaDevices` will be undefined.

**Save the file** (Cmd+S)

---

### Step 2: Verify Capacitor Configuration (3 minutes)

**2.1 Check capacitor.config.ts**

File should exist at project root with this config:

```typescript
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.phonelunk.app',
  appName: 'Phone Lunk',
  webDir: 'out',
  server: {
    hostname: 'localhost',    // No port number!
    iosScheme: 'https',       // Critical for getUserMedia
    androidScheme: 'https'
  }
}

export default config
```

**Critical**: `iosScheme: 'https'` is REQUIRED for getUserMedia to work on iOS 15.5+

**If missing or different**: Update the file and save.

---

### Step 3: Build and Sync (5 minutes)

**3.1 Build Next.js for production**

```bash
npm run build
```

Expected output:
- ✓ Generating static pages
- ✓ Finalizing page optimization
- Export success! Output in `out/` directory

**3.2 Sync to iOS**

```bash
npx cap sync ios
```

This copies the built web app to the iOS project.

Expected output:
- ✓ Copying web assets
- ✓ Updating iOS plugins
- ✓ Synced successfully

---

### Step 4: Deploy to Real iOS Device (7 minutes)

**4.1 Open in Xcode (if not already open)**

```bash
npx cap open ios
```

**4.2 Connect your iPhone/iPad**
- Connect via USB cable
- Unlock the device
- Trust the computer if prompted

**4.3 Select your device in Xcode**
- Top toolbar: Select your device from dropdown (next to "App" scheme)
- Should show device name (e.g., "Jeremy's iPhone")

**4.4 Configure signing**
- Select "App" project in Project Navigator
- Select "App" target
- Go to "Signing & Capabilities" tab
- Check "Automatically manage signing"
- Select your Team (Personal Team or Developer account)

**4.5 Build and run**
- Click the ▶️ Play button in Xcode (or Cmd+R)
- Wait for build to complete (~30-60 seconds first time)
- App should launch on your device

---

### Step 5: Test Camera Functionality (10 minutes)

Once the app launches on your device:

#### 5.1 Initial Load
- [ ] App loads without crashes
- [ ] "See The Technology In Action" section visible
- [ ] "Start Camera" button visible

#### 5.2 Camera Permissions
- [ ] Click "Start Camera" button
- [ ] Permission prompt appears asking for **camera AND microphone**
- [ ] Grant both permissions (Allow)

**If permissions don't appear:**
- ❌ FAIL: Missing Info.plist entries
- Go back to Step 1, verify both keys are added

#### 5.3 Camera Activation
- [ ] Camera feed appears in video element
- [ ] No black screen
- [ ] No "mediaDevices undefined" error
- [ ] "MONITORING" indicator shows with red dot

**If camera shows black screen:**
- ❌ FAIL: Possible iosScheme configuration issue
- Check Step 2, verify `iosScheme: 'https'`

#### 5.4 TensorFlow.js Model Loading
- [ ] Wait 2-5 seconds for model to load
- [ ] No errors in console (check via Safari Web Inspector)
- [ ] Status shows "All Clear" or detection state

**If model fails to load:**
- ⚠️ WARNING: Might be WebGL issue (separate from camera)
- Continue testing camera functionality

#### 5.5 Camera Switching
- [ ] Click camera switch button (front/rear icon)
- [ ] Stream switches successfully
- [ ] Front camera shows mirrored view
- [ ] Rear camera shows normal view
- [ ] No crashes during switch

**If switching doesn't work:**
- ⚠️ WARNING: May indicate react-webcam issue with Capacitor
- Note the specific error for analysis

#### 5.6 Phone Detection
- [ ] Point rear camera at a phone (real phone or phone photo)
- [ ] Red bounding box appears around phone
- [ ] Label shows "📱 PHONE XX%"
- [ ] Alarm effect triggers (red flash)
- [ ] Detection count increments
- [ ] Status shows "⚠️ PHONE DETECTED"

**If detection doesn't work:**
- Check if model loaded (Step 5.4)
- Try increasing phone size in camera view
- Try different phone angles/lighting

#### 5.7 Stop Camera
- [ ] Click "Stop Camera" button
- [ ] Camera feed stops
- [ ] Placeholder shows "Camera is off"
- [ ] No lingering streams (check camera indicator on device)

---

### Step 6: Debug (if needed)

**6.1 Enable Safari Web Inspector on iOS**

On iPhone:
1. Settings → Safari → Advanced
2. Enable "Web Inspector"

On Mac:
1. Safari → Settings → Advanced
2. Show Develop menu
3. Connect iPhone
4. Develop → [Your iPhone] → Phone Lunk

This lets you see console errors from the iOS device.

**6.2 Common Error Messages**

| Error | Meaning | Fix |
|-------|---------|-----|
| `navigator.mediaDevices is undefined` | Missing microphone permission | Add NSMicrophoneUsageDescription to Info.plist |
| `NotAllowedError` | User denied permission | Go to Settings → Phone Lunk → Allow Camera |
| `NotFoundError` | No camera detected | Test on real device (not simulator) |
| `NotReadableError` | Camera in use by another app | Close other camera apps |
| Black screen but no error | iosScheme not set to 'https' | Update capacitor.config.ts |

---

## Decision Matrix

Based on test results:

### ✅ SUCCESS - All 7 checks pass

**Outcome**: Keep react-webcam!

**Next steps**:
1. Mark Phase 2B as **SKIPPED** in main plan
2. Document decision in plan revision
3. Proceed directly to Phase 3 (iOS Configuration)
4. **Time saved**: 6-8 hours 🎉

**Update plan**:
```markdown
## Phase 2 Status: COMPLETE ✅

- Phase 2A: ✅ PASSED - react-webcam works with Capacitor
- Phase 2B: ⏭️ SKIPPED - No refactor needed
- Decision: Keeping react-webcam
- Time saved: 6-8 hours
```

---

### ❌ FAILURE - Any critical check fails

**Critical failures** (must refactor):
- Camera feed shows black screen
- mediaDevices is undefined (after adding permissions)
- Camera switching causes crashes
- Detection doesn't work at all

**Outcome**: Proceed to Phase 2B refactor

**Next steps**:
1. Document specific failures
2. Review `plans/phase-2-camera-refactor-implementation.md`
3. Execute 14-step refactor process (6-8 hours)
4. Test again after refactor

**Document failures**:
```markdown
## Phase 2A Test Results: FAILED ❌

**Date**: 2025-11-XX
**Device**: [iPhone model, iOS version]
**Failures**:
1. [Specific issue #1]
2. [Specific issue #2]

**Decision**: Proceeding to Phase 2B refactor
**Reference**: plans/phase-2-camera-refactor-implementation.md
```

---

### ⚠️ PARTIAL - Some checks fail

**Non-critical failures** (can fix without refactor):
- Model loads slowly (performance optimization)
- Detection accuracy lower than expected (model/threshold tuning)
- UI glitches (CSS fixes)

**Outcome**: Likely keep react-webcam, but investigate

**Next steps**:
1. Assess if issues are react-webcam specific or general
2. If general (TensorFlow, performance): Keep react-webcam
3. If react-webcam specific: Consider refactor

---

## Test Results Template

Copy this template and fill it out:

```markdown
# Phase 2A Test Results

**Date**: _____________
**Tester**: _____________
**Device**: _____________ (model + iOS version)
**Xcode Version**: _____________

## Environment Setup
- [ ] Info.plist has NSCameraUsageDescription
- [ ] Info.plist has NSMicrophoneUsageDescription
- [ ] capacitor.config.ts has iosScheme: 'https'
- [ ] Real device connected and trusted

## Test Results

### ✅ PASSED / ❌ FAILED / ⚠️ PARTIAL

| Test | Result | Notes |
|------|--------|-------|
| 5.1 Initial Load | [ ] | ___ |
| 5.2 Camera Permissions | [ ] | ___ |
| 5.3 Camera Activation | [ ] | ___ |
| 5.4 Model Loading | [ ] | ___ |
| 5.5 Camera Switching | [ ] | ___ |
| 5.6 Phone Detection | [ ] | ___ |
| 5.7 Stop Camera | [ ] | ___ |

## Issues Found

1. **Issue**: _______________
   - **Severity**: Critical / Medium / Low
   - **Error message**: _______________
   - **Reproducible**: Yes / No

2. **Issue**: _______________
   - **Severity**: Critical / Medium / Low
   - **Error message**: _______________
   - **Reproducible**: Yes / No

## Console Errors

```
[Paste any console errors from Safari Web Inspector]
```

## Decision

[ ] ✅ **KEEP react-webcam** - All critical tests passed
[ ] ❌ **REFACTOR** - Critical failures, proceed to Phase 2B
[ ] ⚠️ **INVESTIGATE** - Partial success, needs analysis

## Next Steps

1. _______________
2. _______________
3. _______________

---

**Completed by**: _______________
**Date**: _______________
```

---

## Troubleshooting Guide

### Problem: "Could not launch Phone Lunk" in Xcode

**Solution**:
1. Unlock iOS device
2. Trust the computer (popup on device)
3. In Xcode: Product → Clean Build Folder (Cmd+Shift+K)
4. Try running again

### Problem: Signing error in Xcode

**Solution**:
1. Go to Signing & Capabilities
2. Check "Automatically manage signing"
3. Select a valid Team
4. If using free account: Change bundle ID to unique value

### Problem: App installs but crashes immediately

**Solution**:
1. Check Xcode console for crash logs
2. Look for missing permissions or configuration
3. Verify Info.plist entries are saved
4. Try: Product → Clean Build Folder → Run again

### Problem: Camera permission prompt doesn't appear

**Solution**:
1. Verify Info.plist has both camera + microphone keys
2. If keys exist, delete app from device
3. Rebuild and reinstall (fresh permissions state)

### Problem: "mediaDevices is undefined"

**Solution**:
1. Add NSMicrophoneUsageDescription to Info.plist (often forgotten!)
2. Verify iosScheme: 'https' in capacitor.config.ts
3. Rebuild app after changes

---

## Success Criteria Checklist

Mark each as you complete:

**Setup**:
- [ ] Info.plist has both camera + microphone permissions
- [ ] capacitor.config.ts has iosScheme: 'https'
- [ ] App builds successfully in Xcode
- [ ] App installs on real iOS device

**Camera**:
- [ ] Permission prompts appear
- [ ] Camera feed displays (not black)
- [ ] No "mediaDevices undefined" errors
- [ ] Front and rear cameras work
- [ ] Camera stops cleanly

**Detection**:
- [ ] TensorFlow model loads
- [ ] Phone detection triggers
- [ ] Bounding boxes render
- [ ] Alarm effect displays

**Decision**:
- [ ] Test results documented
- [ ] Decision made: Keep or Refactor
- [ ] Main plan updated with decision
- [ ] Next phase identified

---

## Timeline

| Step | Estimated | Actual | Notes |
|------|-----------|--------|-------|
| 1. Add permissions | 5 min | ___ | ___ |
| 2. Verify config | 3 min | ___ | ___ |
| 3. Build & sync | 5 min | ___ | ___ |
| 4. Deploy to device | 7 min | ___ | ___ |
| 5. Test functionality | 10 min | ___ | ___ |
| 6. Debug (if needed) | 0-10 min | ___ | ___ |
| **Total** | **30 min** | ___ | ___ |

---

## Quick Reference: Info.plist Entries

Copy-paste these into Info.plist (inside `<dict>` tag):

```xml
<key>NSCameraUsageDescription</key>
<string>Phone Lunk uses your camera to detect phones in restricted areas and trigger alerts.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Required for camera access (WebRTC security model).</string>
```

## Quick Reference: capacitor.config.ts

Ensure this is in your config:

```typescript
server: {
  hostname: 'localhost',
  iosScheme: 'https',
  androidScheme: 'https'
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-08
**Status**: Ready for execution after Phase 1 completion
