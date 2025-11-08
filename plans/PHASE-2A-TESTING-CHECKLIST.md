# Phase 2A Testing Checklist - Manual Device Testing

**Date**: 2025-11-08
**Automated Setup**: ✅ COMPLETE
**Status**: ⏳ READY FOR DEVICE TESTING

---

## ✅ Automated Setup Complete (Part A)

All automated preparation steps are done:

- [x] iOS permissions added to Info.plist
  - NSCameraUsageDescription ✅
  - NSMicrophoneUsageDescription ✅
- [x] Capacitor config verified
  - iosScheme: 'https' ✅
  - hostname: 'localhost' ✅
- [x] Next.js production build complete
  - Static export in `out/` ✅
- [x] Web assets synced to iOS
  - Files in `ios/App/App/public/` ✅
- [x] CocoaPods dependencies installed ✅

**✅ iOS PROJECT IS READY FOR DEVICE TESTING**

---

## ⏳ Manual Testing Required (Part B)

**CRITICAL**: You need a real iOS device. Simulators cannot test camera.

### Prerequisites Checklist

Before starting, verify:

- [ ] Mac with Xcode installed
- [ ] iPhone connected via USB (iOS 15.5 or later)
- [ ] Device trusted ("Trust This Computer" on iPhone)
- [ ] Device unlocked
- [ ] Lightning/USB-C cable connected

---

## Step-by-Step Testing Guide

### Step 1: Open Project in Xcode

```bash
npx cap open ios
```

**What to expect**:
- Xcode launches
- `App.xcworkspace` opens
- Project appears in left sidebar

**If Xcode doesn't open**:
```bash
open -a Xcode ios/App/App.xcworkspace
```

---

### Step 2: Select Your Device

1. Top toolbar: Find device dropdown (next to "App" scheme)
2. Click dropdown
3. Select your iPhone from the list
4. Should show: "[Your Name]'s iPhone"

**Not seeing your device?**
- Unlock iPhone
- Check USB connection
- Window → Devices and Simulators → Check if device listed

---

### Step 3: Configure Code Signing

1. Left sidebar: Click "App" project (blue icon)
2. Select "App" target under TARGETS
3. Click "Signing & Capabilities" tab
4. Check "✓ Automatically manage signing"
5. Team dropdown: Select your Apple ID or Developer account

**Using free Apple ID?**
- Works for development testing
- May need to change bundle identifier to unique value
- Format: com.yourname.phonelunk

**Signing error?**
- Go to Xcode → Settings → Accounts
- Add Apple ID if not present
- Click "Download Manual Profiles"

---

### Step 4: Build and Deploy

1. Click ▶️ Play button in top left (or press Cmd+R)
2. Wait for build (~30-60 seconds first time)
3. Watch build progress in top bar

**Expected**:
- Build progress bar completes
- App installs on device
- App launches automatically

**Build failed?**
- Read error message in red bar
- Common: "Code signing required"
  → Fix signing in Step 3
- Common: "iPhone is busy"
  → Wait for Xcode indexing to finish

**First time on this device?**
- iPhone may show "Untrusted Developer" message
- Settings → General → VPN & Device Management
- Trust your developer certificate
- Return to app and try again

---

### Step 5: Test Camera Functionality

Now test the actual camera/detection features:

#### Test 5.1: App Launch ✅/❌
- [ ] App launches without crashing
- [ ] Home screen visible
- [ ] "See The Technology In Action" section displays
- [ ] "Start Camera" button visible
- [ ] Page scrolls normally

**If app crashes immediately**:
❌ CRITICAL FAILURE
- Check Xcode console for error logs
- Look for missing permissions or config issues

#### Test 5.2: Camera Permission Prompt ✅/❌
- [ ] Tap "Start Camera" button
- [ ] Permission dialog appears
- [ ] Dialog asks for BOTH camera AND microphone access
- [ ] Tap "Allow" for both

**Expected dialog text**:
```
"Phone Lunk" Would Like to Access the Camera

Phone Lunk uses your camera to detect phones in restricted areas and trigger alerts.

[Don't Allow] [OK]
```

**If no dialog appears**:
❌ CRITICAL FAILURE
- Permissions may already be set
- Settings → Phone Lunk → Check permissions
- Or: Delete app, reinstall, try again

**If dialog only asks for camera (not microphone)**:
⚠️ WARNING
- Check Info.plist has NSMicrophoneUsageDescription
- May cause issues later

#### Test 5.3: Camera Feed Display ✅/❌
- [ ] Camera feed appears (not black screen)
- [ ] Video shows live camera view
- [ ] Image is clear (not pixelated/frozen)
- [ ] "MONITORING" indicator shows with pulsing red dot
- [ ] Camera switch button visible (front/rear icon)

**Expected view**:
```
┌─────────────────────────┐
│ 🔴 MONITORING  [🤳Front]│
│                         │
│   [Live Camera Feed]    │
│                         │
│                         │
│ ✓ All Clear             │
└─────────────────────────┘
```

**If black screen**:
❌ CRITICAL FAILURE - react-webcam not working
- Possible causes:
  1. iosScheme not set to 'https'
  2. WebRTC not supported in this iOS version
  3. react-webcam incompatible with Capacitor
- **DECISION**: Likely need Phase 2B refactor

**If frozen/pixelated**:
⚠️ WARNING
- Performance issue, not camera issue
- Continue testing

#### Test 5.4: TensorFlow Model Loading ✅/❌
- [ ] Wait 2-5 seconds after camera starts
- [ ] Loading indicator (if any) completes
- [ ] Status changes to "All Clear" or detection state
- [ ] No error messages appear

**Check Safari Web Inspector** (if issues):
1. iPhone: Settings → Safari → Advanced → Web Inspector (ON)
2. Mac Safari: Develop → [iPhone] → Phone Lunk
3. Look for console errors

**Common errors**:
- "Failed to load model": Network or TensorFlow issue
- "WebGL not supported": Try WASM backend
- "Out of memory": Device limitations

**If model fails to load**:
⚠️ WARNING
- Not camera-related
- May need optimization
- Continue testing camera

#### Test 5.5: Camera Switching ✅/❌
- [ ] Tap camera switch button (top right)
- [ ] Stream switches to other camera
- [ ] Front camera view is mirrored (selfie mode)
- [ ] Rear camera view is normal
- [ ] No black screen during switch
- [ ] No app crash
- [ ] Can switch back and forth multiple times

**Expected behavior**:
- Front → Rear: Button changes 🤳 → 📱
- Smooth transition (~0.5-1 second)
- Feed resumes immediately

**If switching causes black screen**:
❌ CRITICAL FAILURE
- react-webcam camera switching broken
- **DECISION**: Need Phase 2B refactor

**If switching crashes app**:
❌ CRITICAL FAILURE
- Severe compatibility issue
- **DECISION**: Need Phase 2B refactor

#### Test 5.6: Phone Detection ✅/❌
- [ ] Point rear camera at a phone (real or photo)
- [ ] Red bounding box appears around phone within 1-2 seconds
- [ ] Box follows phone as you move it
- [ ] Label above box shows "📱 PHONE XX%"
- [ ] Alarm effect triggers (red screen flash)
- [ ] Detection count increments (visible in UI)
- [ ] Status changes to "⚠️ PHONE DETECTED"

**Testing tips**:
- Use another phone or phone photo
- Ensure good lighting
- Phone should be clearly visible
- Try different angles/distances

**Expected detection**:
```
┌─────────────────────────┐
│ 🔴 MONITORING Rear      │
│  ┏━━━━━━━━━━━┓          │
│  ┃ 📱PHONE85%┃          │
│  ┃   [Phone] ┃          │
│  ┗━━━━━━━━━━━┛          │
│                         │
│ ⚠️ PHONE DETECTED       │
└─────────────────────────┘
```

**If no detection**:
⚠️ WARNING
- Not camera-related (detection logic issue)
- Camera is working if feed displays
- May need model/threshold tuning

**If detection too slow**:
⚠️ WARNING
- Performance optimization needed
- Not a camera compatibility issue

#### Test 5.7: Stop Camera ✅/❌
- [ ] Scroll back to "Start Camera" button
- [ ] Button now shows "Stop Camera"
- [ ] Tap "Stop Camera"
- [ ] Camera feed disappears
- [ ] Placeholder shows "📷 Camera is off"
- [ ] Camera indicator light turns off on device
- [ ] No lingering camera access

**Expected**:
- Clean stop
- No camera light still on
- Can restart camera successfully

**If camera won't stop**:
⚠️ WARNING
- Stream cleanup issue
- May need better cleanup code

---

## Decision Matrix

### ✅ ALL TESTS PASS

**Critical Tests (All Must Pass)**:
- [x] App launches
- [x] Permissions prompt appears
- [x] Camera feed displays (not black)
- [x] Camera switching works
- [x] No crashes

**Decision**: ✅ KEEP react-webcam
- No refactor needed
- Skip Phase 2B
- Save 6-8 hours
- Proceed to Phase 3

**Action**: Document success and update main plan.

---

### ❌ CRITICAL FAILURES

**Any of these = Must Refactor**:
- [ ] Black screen after permission granted
- [ ] `navigator.mediaDevices` undefined error
- [ ] Camera switching causes crash
- [ ] App crashes on camera start

**Decision**: ❌ PROCEED TO PHASE 2B REFACTOR
- react-webcam not compatible
- Replace with native getUserMedia
- 6-8 hour refactor required
- Use `plans/phase-2-camera-refactor-implementation.md`

**Action**: Document failures and start refactor.

---

### ⚠️ PARTIAL SUCCESS

**Non-Critical Issues**:
- [ ] Slow model loading (performance, not camera)
- [ ] Lower detection accuracy (model tuning, not camera)
- [ ] UI glitches (CSS, not camera)

**Decision**: ⚠️ LIKELY KEEP react-webcam
- Assess if issues are camera-specific
- If general issues: Fix separately
- If camera-specific: Consider refactor

**Action**: Investigate and make informed decision.

---

## Results Documentation

### Fill Out This Template

```markdown
# Phase 2A Test Results

**Date**: 2025-11-08
**Tester**: [Your name]
**Device**: [iPhone model] iOS [version]
**Xcode Version**: [version]

## Overall Result

[ ] ✅ ALL TESTS PASSED - Keep react-webcam
[ ] ❌ CRITICAL FAILURES - Proceed to Phase 2B refactor
[ ] ⚠️ PARTIAL - Needs investigation

## Test Results

| Test | Pass? | Notes |
|------|-------|-------|
| 5.1 App Launch | ☐ | |
| 5.2 Permissions | ☐ | |
| 5.3 Camera Feed | ☐ | |
| 5.4 Model Loading | ☐ | |
| 5.5 Switching | ☐ | |
| 5.6 Detection | ☐ | |
| 5.7 Stop Camera | ☐ | |

## Issues Found

[Describe any issues]

## Console Errors

[Paste Safari Web Inspector errors if any]

## Photos/Screenshots

[Attach screenshots if helpful]

## Decision

Based on test results:

[ ] ✅ Keep react-webcam - All critical tests passed
[ ] ❌ Refactor to native getUserMedia - Critical failures found
[ ] ⚠️ Investigate further - Unclear results

## Next Steps

[What to do next]

## Estimated Time Saved/Lost

If keeping react-webcam: +6-8 hours saved
If refactoring: 6-8 hours to Phase 2B
```

---

## Quick Commands Reference

### Open Project
```bash
npx cap open ios
```

### Rebuild and Sync
```bash
npm run build && npx cap sync ios
```

### Clean Build (if issues)
```bash
cd ios/App
pod install
cd ../..
```

### Check Xcode Version
```bash
xcodebuild -version
```

### Check iOS Version
Settings → General → About → Software Version

---

## Troubleshooting Guide

### Problem: "iPhone is Busy"
**Solution**: Wait for Xcode to finish indexing (progress bar in top center)

### Problem: "Code Signing Required"
**Solution**: Step 3 - Configure signing with your Apple ID

### Problem: "Untrusted Developer"
**Solution**: Settings → General → VPN & Device Management → Trust

### Problem: Build Errors
**Solution**:
1. Product → Clean Build Folder (Cmd+Shift+K)
2. Try building again
3. Check error message for specific issue

### Problem: No Device in Dropdown
**Solution**:
1. Unlock iPhone
2. Trust computer
3. Window → Devices and Simulators → Check connection
4. Replug USB cable

### Problem: Black Screen After Permissions
**Critical Issue - Document This!**
- Take screenshot
- Check Safari Web Inspector console
- Document exact behavior
- This likely means Phase 2B refactor needed

---

## Important Reminders

⚠️ **MUST USE REAL DEVICE**
- iOS Simulator cannot test camera
- Camera functionality only works on physical iPhone/iPad

⚠️ **BOTH PERMISSIONS REQUIRED**
- Camera permission (obvious)
- Microphone permission (required for WebRTC even without audio)

⚠️ **TEST THOROUGHLY**
- Don't skip tests
- Document everything
- Take screenshots of issues
- This decision affects 6-8 hours of work

✅ **AUTOMATED SETUP COMPLETE**
- All prep work done
- iOS project ready
- Just need device testing now

---

## Expected Timeline

**If All Goes Well**: 20 minutes
- 5 min: Xcode setup
- 10 min: Testing all scenarios
- 5 min: Documentation

**If Issues Occur**: 30-45 minutes
- Additional time debugging
- Investigating errors
- Multiple test attempts

---

## Success Criteria Summary

**Minimum for Success (Keep react-webcam)**:
1. ✅ Camera feed displays (not black)
2. ✅ Front/rear switching works
3. ✅ No crashes
4. ✅ Permissions work correctly

**Nice to Have (But Not Required)**:
- Fast model loading
- Perfect detection accuracy
- Zero console warnings

**Remember**: Even if some things aren't perfect, as long as the camera itself works, you can keep react-webcam and optimize other issues later.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-08
**Status**: ✅ READY FOR TESTING

🎯 **You're Ready!** Connect your iPhone and start testing.
