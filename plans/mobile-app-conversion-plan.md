# Mobile App Conversion Plan: Phone Lunk

**Created:** 2025-11-08
**Target Platforms:** iOS, Android, Web (maintain all three)
**Technology:** Capacitor + Next.js 15 Static Export
**Distribution:** Public App Store + Google Play Store release

---

## Executive Summary

Convert the Phone Lunk Next.js static landing page into native mobile apps for iOS and Android using **Capacitor**, while maintaining the web version. All three platforms will share 95% of the same codebase.

**Key Decision:** Capacitor is the clear winner over Hotwire Native (which only works with Rails apps).

**Total Estimated Time:** 27-37 hours
**Critical Path:** Camera system refactor (Phase 2)

---

## Why Capacitor?

### ✅ Advantages
- **Perfect Next.js 15 compatibility** - Designed for static exports
- **95%+ code reuse** - Same codebase for web, iOS, Android
- **TensorFlow.js support** - AI detection works on mobile
- **Active ecosystem** - Capacitor 7 (2025) with ongoing updates
- **Fast development** - 27-37 hours vs 100+ for native rewrite
- **Framework agnostic** - TypeScript/JavaScript-first

### ⚠️ Critical Change Required
**react-webcam must be replaced** with native `getUserMedia` + HTML5 `<video>` element. The library doesn't work reliably in Capacitor's iOS WebView.

---

## Technical Compatibility Assessment

| Technology | Capacitor Compatibility | Notes |
|------------|------------------------|-------|
| Next.js 15 Static Export | ✅ Excellent | Designed for this exact use case |
| TensorFlow.js | ⚠️ Good with caveats | Works but with iOS WebGL limitations |
| WebGL | ⚠️ Good with limitations | iOS uses 16-bit floats, may affect precision |
| react-webcam | ❌ Must replace | Use Capacitor Camera API instead |
| Camera Access (getUserMedia) | ⚠️ Good with config | Requires proper hostname setup |
| COCO-SSD Model | ✅ Excellent | Works in Capacitor iOS/Android apps |
| Canvas API | ✅ Excellent | Full support for bounding boxes |
| CSS Variables & Theming | ✅ Excellent | Works identically to web |

---

## Prerequisites

### Required Before Starting
- [ ] **Apple Developer Account** - $99/year (required for App Store)
- [ ] **Google Play Developer Account** - $25 one-time (required for Play Store)
- [ ] **Mac with Xcode** - For iOS development and builds ✅ (confirmed available)
- [ ] **Privacy Policy Hosted** - Required by both app stores
- [ ] **Android Studio** - For Android builds

### Optional But Recommended
- [ ] Real iOS device for testing (camera won't work in simulator)
- [ ] Real Android device for testing
- [ ] TestFlight setup for beta testing

---

## Implementation Phases

### Phase 1: Capacitor Foundation (3-4 hours)
**Goal:** Set up Capacitor infrastructure for iOS + Android

**Tasks:**
1. Install Capacitor core packages
   ```bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/camera @capacitor/ios @capacitor/android
   npx cap init "Phone Lunk" "com.phonelunk.app"
   ```

2. Configure `capacitor.config.ts`
   ```typescript
   {
     appId: 'com.phonelunk.app',
     appName: 'Phone Lunk',
     webDir: 'out',  // Next.js export directory
     server: {
       hostname: 'localhost',
       iosScheme: 'https',      // Critical for getUserMedia
       androidScheme: 'https'
     }
   }
   ```

3. Add platforms
   ```bash
   npx cap add ios
   npx cap add android
   ```

4. Verify Next.js build produces correct static export
   ```bash
   npm run build  # Should output to ./out directory
   npx cap sync   # Copy web assets to native projects
   ```

**Success Criteria:**
- [ ] Capacitor config created
- [ ] iOS and Android projects generated
- [ ] Next.js build syncs to native projects
- [ ] Can open projects in Xcode and Android Studio

---

### Phase 2: Camera System Refactor (6-8 hours)
**Goal:** Replace react-webcam with Capacitor-compatible camera

**Critical Change:**
The current `react-webcam` dependency doesn't work reliably in Capacitor's iOS WebView. Must refactor to use native browser APIs.

**Tasks:**

1. **Remove react-webcam dependency**
   ```bash
   npm uninstall react-webcam
   ```

2. **Update PhoneDetector.tsx**
   - Replace `<Webcam>` component with `<video>` element
   - Replace `webcamRef` with `videoRef`
   - Implement `getUserMedia` manually:

   ```typescript
   const videoRef = useRef<HTMLVideoElement>(null);

   const startCamera = async () => {
     try {
       const stream = await navigator.mediaDevices.getUserMedia({
         video: {
           facingMode: facingMode,  // 'user' or 'environment'
           width: 1280,
           height: 720
         }
       });

       if (videoRef.current) {
         videoRef.current.srcObject = stream;
         await videoRef.current.play();
       }
     } catch (err) {
       handleCameraError(err);
     }
   };
   ```

3. **Update detection loop**
   - Change `webcamRef.current.video` to `videoRef.current`
   - Keep all TensorFlow.js logic unchanged (dynamic imports still work)
   - Verify bounding box rendering on canvas overlay

4. **Maintain camera switching**
   - Front/rear camera toggle
   - Update `facingMode` constraint and restart stream

5. **Test in browser first**
   - Should work identically to current version
   - Verify on desktop (webcam) and mobile web (front/rear cameras)

**Success Criteria:**
- [ ] react-webcam removed
- [ ] Camera starts and displays video feed
- [ ] Front/rear switching works
- [ ] TensorFlow.js detection still works
- [ ] Bounding boxes render correctly
- [ ] Web version still works (no regression)

---

### Phase 3: iOS Configuration (3-4 hours)
**Goal:** Configure iOS-specific settings and permissions

**Tasks:**

1. **Add camera permissions to Info.plist**
   - Open `ios/App/App/Info.plist` in Xcode
   - Add:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Phone Lunk uses your camera to detect phones in restricted areas and trigger alerts.</string>

   <key>NSPhotoLibraryUsageDescription</key>
   <string>Access photos to save detection screenshots (optional).</string>
   ```

2. **Configure app icons**
   - Create icons in multiple sizes (1024x1024, 180x180, 167x167, etc.)
   - Add to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Can use existing logo from `public/logo.svg`

3. **Create launch screen**
   - Design simple launch screen (logo + brand colors)
   - Update `ios/App/App/Base.lproj/LaunchScreen.storyboard`

4. **Test on iOS**
   ```bash
   npm run build
   npx cap sync ios
   npx cap open ios
   # Run in Xcode on real device
   ```

5. **Verify TensorFlow.js WebGL backend**
   - Test detection accuracy on iOS
   - Monitor for 16-bit float precision issues
   - Add WASM fallback if needed:
   ```typescript
   try {
     await tf.setBackend('webgl');
   } catch (err) {
     await tf.setBackend('wasm');  // Slower but more reliable
   }
   ```

6. **Handle iOS-specific camera permissions**
   - Test permission denial flow
   - Add "Go to Settings" button for denied permissions
   - Test front/rear camera switching on iPhone

**Success Criteria:**
- [ ] Camera permissions prompt appears
- [ ] App icons display correctly
- [ ] Launch screen looks professional
- [ ] Camera starts and switches between front/rear
- [ ] TensorFlow.js model loads and detects phones
- [ ] Bounding boxes render on iOS
- [ ] No crashes or WebGL errors

---

### Phase 4: Android Configuration (3-4 hours)
**Goal:** Configure Android-specific settings and permissions

**Tasks:**

1. **Add camera permissions to AndroidManifest.xml**
   - Open `android/app/src/main/AndroidManifest.xml`
   - Add:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-feature android:name="android.hardware.camera" android:required="true" />
   ```

2. **Configure app icons**
   - Create icons for different densities (mdpi, hdpi, xhdpi, etc.)
   - Add to `android/app/src/main/res/mipmap-*/`
   - Update icon references in `AndroidManifest.xml`

3. **Create splash screen**
   - Design splash screen (logo + brand colors)
   - Add to `android/app/src/main/res/drawable/`
   - Configure in `styles.xml`

4. **Set up signing keys for release builds**
   - Generate keystore:
   ```bash
   keytool -genkey -v -keystore phone-lunk-release.keystore \
     -alias phone-lunk -keyalg RSA -keysize 2048 -validity 10000
   ```
   - Update `android/app/build.gradle` with signing config

5. **Test on Android**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   # Run in Android Studio on real device or emulator
   ```

6. **Verify TensorFlow.js performance**
   - Test on different Android versions (10, 11, 12+)
   - Monitor FPS and detection latency
   - Test on low-end and high-end devices

7. **Handle Android-specific permission flows**
   - Test permission denial
   - Test camera switching
   - Handle Android 6.0+ runtime permissions

**Success Criteria:**
- [ ] Camera permissions prompt appears
- [ ] App icons and splash screen display correctly
- [ ] Camera starts and switches (if device has multiple cameras)
- [ ] TensorFlow.js model loads and detects phones
- [ ] Bounding boxes render on Android
- [ ] Release build can be generated and signed
- [ ] No crashes or performance issues

---

### Phase 5: Cross-Platform Testing (4-6 hours)
**Goal:** Ensure consistent behavior across all platforms

**Testing Matrix:**

| Platform | Versions to Test | Test Focus |
|----------|-----------------|------------|
| **iOS** | 15.5+, 16.x, 17.x | Camera permissions, WebGL, detection accuracy |
| **Android** | 10, 11, 12+ | Camera permissions, performance, various devices |
| **Web** | Chrome, Safari, Firefox | Regression test - ensure no breaking changes |

**Test Scenarios:**

1. **Camera functionality**
   - [ ] Camera starts successfully
   - [ ] Permission prompts work correctly
   - [ ] Permission denial handled gracefully
   - [ ] Front/rear camera switching (mobile only)
   - [ ] Camera stops when app backgrounds
   - [ ] Camera resumes when app foregrounds

2. **AI detection**
   - [ ] Model loads without errors
   - [ ] Phone detection triggers at ~35% confidence
   - [ ] Bounding boxes render correctly
   - [ ] Detection count increments
   - [ ] Alarm effect displays for 3 seconds
   - [ ] 3-second cooldown between alarms

3. **Performance metrics**
   - [ ] Model load time: 2-5 seconds
   - [ ] Detection latency: 50-200ms
   - [ ] FPS: 5-10 (target 8+ on modern devices)
   - [ ] CPU usage: 40-60%
   - [ ] Memory usage: 100-200MB
   - [ ] Battery drain: Acceptable for continuous use

4. **App lifecycle**
   - [ ] App launches successfully
   - [ ] Background/foreground transitions
   - [ ] Camera cleanup when stopping
   - [ ] No memory leaks during extended use
   - [ ] Theme persistence (light/dark mode)

5. **Error handling**
   - [ ] Camera denied: Show helpful message
   - [ ] WebGL not supported: Show fallback message
   - [ ] Model load failure: Show error + retry option
   - [ ] Network offline: Model loads from cache

6. **Platform-specific bugs**
   - [ ] iOS: getUserMedia hostname issues (iOS 15.5+)
   - [ ] iOS: WebGL 16-bit float precision
   - [ ] Android: Various camera implementations
   - [ ] Android: Performance on low-end devices

**Success Criteria:**
- [ ] All test scenarios pass on all platforms
- [ ] No regressions in web version
- [ ] Performance meets targets on modern devices
- [ ] Critical bugs documented and prioritized

---

### Phase 6: App Store Preparation (6-8 hours)
**Goal:** Prepare for public release on both stores

#### iOS App Store (App Store Connect)

**Tasks:**

1. **Create app listing**
   - Log in to App Store Connect
   - Create new app with bundle ID: `com.phonelunk.app`
   - Fill in app information (name, subtitle, category)

2. **Write marketing copy**
   - App name: "Phone Lunk - Phone Detector"
   - Subtitle: "AI-powered phone detection alerts"
   - Description: Compelling copy explaining features (160 chars + full description)
   - Keywords: phone detector, AI detection, camera alerts, etc.
   - What's New: Initial release notes

3. **Create screenshots**
   - Required sizes: 6.7" (iPhone 14 Pro Max), 6.5" (iPhone 11 Pro Max), 5.5" (iPhone 8 Plus)
   - Take 3-5 screenshots showing:
     - Home screen with hero section
     - Camera detection in action (with bounding box)
     - Alarm effect triggered
     - Settings/features
   - Can use iOS Simulator + Xcode screenshots

4. **Upload build**
   - Archive app in Xcode (Product → Archive)
   - Validate archive
   - Distribute to App Store Connect
   - Select build for release

5. **Complete privacy disclosures**
   - Camera usage: Required for phone detection
   - Data collection: None (or specify if analytics enabled)
   - Link to privacy policy (host on website)

6. **App Review Information**
   - Contact info for App Review team
   - Demo account (if needed)
   - Notes: Explain camera/ML functionality clearly

7. **Submit for review**
   - Review submission checklist
   - Submit app
   - Wait 7-14 days for review

**iOS Success Criteria:**
- [ ] App listing created with compelling copy
- [ ] Screenshots look professional across all sizes
- [ ] Build uploaded and selected
- [ ] Privacy disclosures complete
- [ ] Submitted for review

---

#### Android (Google Play Console)

**Tasks:**

1. **Create app listing**
   - Log in to Google Play Console
   - Create new app
   - Fill in app details (name, description, category)

2. **Write marketing copy**
   - App name: "Phone Lunk - Phone Detector"
   - Short description: 80 chars
   - Full description: Compelling copy (up to 4000 chars)

3. **Create screenshots**
   - Required: Phone and 7" tablet screenshots
   - Recommended: 10" tablet screenshots
   - Take 2-8 screenshots showing key features
   - Can use Android Emulator screenshots

4. **Create feature graphic**
   - 1024x500 banner image for Play Store listing
   - Use brand colors, logo, tagline

5. **Upload APK/AAB**
   - Build signed release APK or AAB in Android Studio
   - Upload to Internal Testing track first
   - Test on real devices
   - Promote to Production when ready

6. **Complete content rating questionnaire**
   - IARC rating questionnaire
   - Answer questions about app content
   - Receive rating (likely E for Everyone)

7. **Privacy policy**
   - Add privacy policy URL
   - Complete data safety section
   - Specify camera usage and data handling

8. **Submit for review**
   - Review release checklist
   - Submit to production
   - Wait 1-3 days for review (typically faster than iOS)

**Android Success Criteria:**
- [ ] App listing created with compelling copy
- [ ] Screenshots and feature graphic look professional
- [ ] Signed APK/AAB uploaded
- [ ] Content rating received
- [ ] Privacy policy and data safety complete
- [ ] Submitted for review

---

### Phase 7: Deployment Workflow Setup (2-3 hours)
**Goal:** Establish repeatable build and release process

**Workflows to Establish:**

1. **Web deployment (existing - no changes)**
   - GitHub Actions workflow deploys to GitHub Pages
   - Triggered on push to main branch
   - Outputs to `out/` directory

2. **iOS deployment (manual initially)**
   ```bash
   # 1. Update version in package.json
   # 2. Build Next.js
   npm run build

   # 3. Sync to iOS
   npx cap sync ios

   # 4. Open in Xcode
   npx cap open ios

   # 5. Archive and upload (Xcode)
   # Product → Archive → Distribute → App Store Connect
   ```

3. **Android deployment (manual initially)**
   ```bash
   # 1. Update version in package.json and build.gradle
   # 2. Build Next.js
   npm run build

   # 3. Sync to Android
   npx cap sync android

   # 4. Open in Android Studio
   npx cap open android

   # 5. Build signed APK/AAB (Android Studio)
   # Build → Generate Signed Bundle/APK

   # 6. Upload to Play Console
   ```

4. **Version syncing**
   - Keep version in `package.json` as source of truth
   - Update iOS version in Xcode project settings
   - Update Android version in `android/app/build.gradle`
   - Use semantic versioning (1.0.0, 1.0.1, 1.1.0, etc.)

5. **Documentation**
   - Create `DEPLOYMENT.md` guide
   - Document build process for each platform
   - Document common issues and solutions
   - Create release checklist

**Future Automation (Optional):**
- **Fastlane** for iOS automated builds and uploads
- **Gradle scripts** for Android automated builds
- **GitHub Actions** for mobile builds (requires macOS runner for iOS)

**Success Criteria:**
- [ ] Can build and deploy web version (existing workflow)
- [ ] Can build and deploy iOS version to TestFlight
- [ ] Can build and deploy Android version to Play Console
- [ ] Version numbers stay in sync across all platforms
- [ ] Process documented for future team members

---

## Critical Technical Issues & Solutions

### Issue #1: react-webcam Incompatibility 🚨

**Problem:** react-webcam doesn't work in Capacitor iOS WebView
- `navigator.mediaDevices` undefined or inconsistent
- Black screens and "No camera found" errors
- iOS WebView limitations

**Solution:**
- Replace with native `getUserMedia` + `<video>` element
- Configure Capacitor server with `iosScheme: 'https'`
- See Phase 2 for detailed implementation

---

### Issue #2: iOS WebGL 16-bit Float Limitation ⚠️

**Problem:**
- iOS WebGL uses 16-bit floats (not 32-bit)
- May affect TensorFlow.js precision
- COCO-SSD should work but may have slightly reduced accuracy

**Solution:**
- Test thoroughly on real iOS devices
- Add WASM backend fallback:
```typescript
try {
  await tf.setBackend('webgl');
} catch (err) {
  await tf.setBackend('wasm');  // Slower but more reliable
}
```

---

### Issue #3: iOS Camera Permissions 📋

**Problem:**
- iOS requires Info.plist entries
- App crashes without permission descriptions

**Solution:**
Add to `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Phone Lunk uses your camera to detect phones in restricted areas and trigger alerts.</string>
```

---

### Issue #4: iOS 15.5+ getUserMedia Bug 🐛

**Problem:**
- getUserMedia fails on iOS 15.5+ with hostname issues
- Works on `capacitor://localhost`, fails with port numbers

**Solution:**
```typescript
// capacitor.config.ts
{
  server: {
    hostname: 'localhost',  // No port number
    iosScheme: 'https'
  }
}
```

---

### Issue #5: App Lifecycle Management 🔄

**Problem:**
- iOS suspends WebViews when app backgrounds
- Camera turns off, detection stops
- Need to restart when returning

**Solution:**
Handle app lifecycle events:
```typescript
import { App } from '@capacitor/app';

App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    startCamera();  // Resume
  } else {
    stopCamera();   // Cleanup
  }
});
```

---

## Performance Expectations

### TensorFlow.js on Mobile

| Metric | iOS (iPhone 12+) | Android (Mid-range) | Notes |
|--------|------------------|---------------------|-------|
| Model load | 2-4 seconds | 3-5 seconds | First load, cached after |
| Detection latency | 50-100ms (WebGL) | 100-150ms | Per frame |
| FPS | 8-10 | 5-8 | Continuous detection |
| CPU usage | 40-60% | 50-70% | One core maxed |
| Battery impact | Moderate-High | High | Continuous camera + ML |
| Memory usage | 100-150MB | 150-200MB | Model + video buffers |

### Optimization Opportunities

1. **Reduce detection frequency**
   - Current: 100ms (10 FPS)
   - Consider: 200ms (5 FPS) for battery savings

2. **Power saver mode**
   - Reduce FPS after 30s of no detections
   - Resume full speed when activity detected

3. **WASM fallback**
   - Slower but better battery life
   - Good for extended sessions

---

## Costs & Resources

### Development Costs

| Item | Cost | Required? |
|------|------|-----------|
| Apple Developer Account | $99/year | ✅ Yes (App Store) |
| Google Play Developer | $25 one-time | ✅ Yes (Play Store) |
| Mac with Xcode | $0 | ✅ Yes (confirmed available) |
| Android Studio | $0 | ✅ Yes (free) |
| Domain for privacy policy | $10-15/year | ✅ Yes (app stores require) |
| SSL certificate | $0 | ✅ Yes (Let's Encrypt free) |
| Testing devices | $0-500 | Recommended (use personal) |
| **Total Year 1** | **$134-149** | |

### Time Investment

| Phase | Hours | Complexity |
|-------|-------|------------|
| Capacitor setup | 3-4 | Easy |
| Camera refactor | 6-8 | Medium-Hard |
| iOS config | 3-4 | Medium |
| Android config | 3-4 | Medium |
| Testing | 4-6 | Medium |
| App store prep | 6-8 | Medium-Hard |
| Deployment setup | 2-3 | Easy |
| **Total** | **27-37 hours** | **Medium** |

---

## Success Metrics

### Launch Goals

**Technical:**
- [ ] App runs on iOS 15.5+ and Android 10+
- [ ] Detection accuracy matches web version (±5%)
- [ ] FPS ≥ 5 on mid-range devices
- [ ] Crash rate < 1%
- [ ] App store approval on first submission

**User Experience:**
- [ ] Camera starts in < 2 seconds
- [ ] Permission flows are clear and intuitive
- [ ] Alarm effect is noticeable and engaging
- [ ] App feels responsive (no janky UI)

**Business:**
- [ ] Successfully published on App Store
- [ ] Successfully published on Google Play Store
- [ ] Web version continues to work (no regressions)
- [ ] Foundation for future feature additions

---

## Post-Launch: Future Enhancements

Once the core conversion is complete and apps are live, consider these additions:

### Feature Ideas
1. **Background detection modes** - Continue detecting when app is backgrounded (iOS limitations apply)
2. **Push notifications** - Alert user when phone detected (requires notification permissions)
3. **Detection history** - Log all detections with timestamps and thumbnails
4. **Cloud sync** - Sync detection history across devices (requires backend)
5. **Premium features** - Subscription model for advanced features
6. **Custom alarm sounds** - Let users upload their own alarm sounds
7. **Geofencing** - Only enable detection in specific locations
8. **Multi-object detection** - Detect other objects beyond phones
9. **Analytics dashboard** - View detection patterns over time
10. **Team/family sharing** - Share detection logs with group

### Technical Improvements
1. **Automated builds** - Fastlane for iOS, Gradle scripts for Android
2. **CI/CD for mobile** - GitHub Actions with macOS runner
3. **Over-the-air updates** - Capacitor Live Updates or CodePush
4. **Crash reporting** - Sentry or Firebase Crashlytics
5. **Performance monitoring** - Firebase Performance or custom telemetry
6. **A/B testing** - Test different alarm effects, UI variations

---

## Risk Assessment

### High Risk
- **iOS WebGL limitations** - May affect detection accuracy (Mitigation: WASM fallback)
- **App store rejection** - Privacy, performance, or guidelines (Mitigation: Thorough testing, clear privacy policy)

### Medium Risk
- **Camera compatibility** - Different devices, different implementations (Mitigation: Extensive device testing)
- **Performance on low-end devices** - May be too slow (Mitigation: Adjustable FPS, power saver mode)
- **Battery drain** - Continuous camera + ML is intensive (Mitigation: Power saver mode, user warnings)

### Low Risk
- **Development timeline overrun** - 27-37 hours is conservative estimate
- **Android fragmentation** - Capacitor abstracts most differences
- **User adoption** - Depends on marketing, not technical implementation

---

## Next Steps

### Immediate Actions (Week 1)
1. [ ] Sign up for Apple Developer account ($99)
2. [ ] Sign up for Google Play Developer account ($25)
3. [ ] Create privacy policy and host on website
4. [ ] Start Phase 1: Capacitor Foundation

### Short-term (Weeks 2-3)
1. [ ] Complete Phase 2: Camera refactor (most critical)
2. [ ] Complete Phase 3 & 4: iOS and Android configuration
3. [ ] Begin Phase 5: Testing

### Medium-term (Weeks 4-5)
1. [ ] Complete testing on all platforms
2. [ ] Phase 6: Prepare app store listings
3. [ ] Phase 7: Document deployment workflow

### Long-term (Week 6+)
1. [ ] Submit to app stores
2. [ ] Wait for approval (7-14 days iOS, 1-3 days Android)
3. [ ] Launch apps publicly
4. [ ] Plan post-launch feature additions

---

## Questions for Future Discussion

Before starting implementation, we should discuss:

1. **App monetization strategy**
   - Free with ads?
   - Freemium with premium features?
   - One-time purchase?
   - Subscription model?

2. **Branding consistency**
   - Same "Phone Lunk" name for apps?
   - Same purple/yellow color scheme?
   - Same Planet Fitness-inspired design?

3. **Feature additions**
   - Which post-launch features are priorities?
   - Should we add any features during initial build?

4. **Analytics and tracking**
   - What metrics do we want to track?
   - Firebase? Google Analytics? Custom solution?

5. **Support and maintenance**
   - How will we handle user support?
   - Bug reporting process?
   - Update cadence?

---

## Conclusion

Converting Phone Lunk to mobile apps using Capacitor is a **straightforward, low-risk approach** that maximizes code reuse while delivering native app experiences. The critical path is the camera refactor (Phase 2), but once that's complete, the rest of the implementation is relatively mechanical.

**Key Takeaways:**
- ✅ Capacitor is the right choice (not Hotwire Native)
- ✅ 95%+ code reuse across web, iOS, Android
- ✅ 27-37 hour implementation timeline is achievable
- ✅ Your tech stack (Next.js, TensorFlow.js) is compatible
- ⚠️ Must replace react-webcam (this is the main blocker)
- ⚠️ Test thoroughly on real devices (simulators can't test camera)

**Ready to proceed?** Start with Phase 1 and we'll iterate from there.
