# Phase 2B: Camera System Refactor - Detailed Implementation Plan

**Goal**: Replace react-webcam with Capacitor-compatible native camera implementation

**Created**: 2025-11-08
**Updated**: 2025-11-08
**Status**: ⚠️ CONDITIONAL - Only execute if Phase 2A testing fails
**Estimated Time**: 6-8 hours
**Risk Level**: Medium
**Impact**: High (critical path for mobile apps)

---

## ⚠️ IMPORTANT: READ THIS FIRST ⚠️

**This plan is CONDITIONAL and should ONLY be executed if Phase 2A testing fails.**

### Decision Flow

```
Phase 1: Install Capacitor ✅
         ↓
Phase 2A: Test react-webcam with Capacitor (30 min)
         ↓
    Does it work?
    ↙         ↘
  YES          NO
   ↓            ↓
Skip this    Execute this plan
document     (Phase 2B)
   ↓            ↓
Phase 3      6-8 hours
             ↓
           Phase 3
```

### Before Starting This Plan

1. **Have you completed Phase 2A testing?**
   - [ ] Yes, tested on real iOS device
   - [ ] No → STOP! Complete Phase 2A first

2. **Did Phase 2A fail?**
   - [ ] Yes, camera doesn't work with react-webcam
   - [ ] No → STOP! Don't refactor, proceed to Phase 3

3. **What specific issues did you encounter?**
   - Document in Phase 2A test results before proceeding

### If Phase 2A Succeeded

**DO NOT USE THIS DOCUMENT.** Mark Phase 2B as SKIPPED in the main plan and save 6-8 hours.

### If Phase 2A Failed

Proceed with this detailed refactoring guide.

---

## Executive Summary

Based on thorough codebase exploration, react-webcam is used in only ONE file (`PhoneDetector.tsx`) and occupies ~50 lines (11% of the component). The refactor involves:

1. Replacing the `<Webcam>` component with native `<video>` element
2. Implementing manual `getUserMedia()` camera stream management
3. Refactoring error handling from callback-based to try/catch
4. Updating tests to mock HTMLVideoElement instead of react-webcam
5. Ensuring Capacitor compatibility with proper hostname configuration

**Key Insight**: 89% of PhoneDetector.tsx (detection logic, state management, UI) is camera-source agnostic and requires NO changes.

---

## Current State Analysis

### React-Webcam Usage Points (9 locations)

| Line | Usage | Impact |
|------|-------|--------|
| 4 | Import statement | Delete |
| 12 | `useRef<Webcam>` type | Change to `useRef<HTMLVideoElement>` |
| 76, 82-92 | Video element access | Change from `webcamRef.current.video` to `videoRef.current` |
| 96 | TensorFlow detection input | Change reference |
| 186-189 | Stream cleanup (toggle) | Simplify (direct stream access) |
| 206-209 | Stream cleanup (switch) | Simplify (direct stream access) |
| 340-369 | `<Webcam>` JSX component | Replace with `<video>` + manual stream setup |
| 350-368 | `onUserMediaError` callback | Replace with try/catch in `startCamera()` |

### Dependencies That Stay

✅ **No changes required**:
- TensorFlow.js integration (`detectPhone` function)
- Canvas overlay rendering
- Detection loop timing (100ms interval)
- State management (all 10 state variables)
- UI components (buttons, status indicators)
- Error message mapping

---

## Pre-Implementation Checklist

### 1. Environment Setup

- [ ] **Create feature branch**
  ```bash
  git checkout -b refactor/native-camera-implementation
  ```

- [ ] **Verify current tests pass**
  ```bash
  npm run test:ci
  npm run test:e2e
  npm run type-check
  ```

- [ ] **Document baseline metrics**
  - Test coverage: Record current %
  - Build time: Record `npm run build` duration
  - Type errors: Should be 0

### 2. Backup Current Implementation

- [ ] **Create backup file**
  ```bash
  cp components/PhoneDetector.tsx components/PhoneDetector.tsx.backup
  ```

- [ ] **Tag current commit**
  ```bash
  git tag before-camera-refactor
  git push origin before-camera-refactor
  ```

### 3. Research & Reference

- [ ] **Study getUserMedia API**
  - MDN: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  - Constraints reference
  - Error types reference

- [ ] **Review Capacitor requirements**
  - Hostname configuration (`capacitor.config.ts`)
  - iOS WebView limitations
  - Android permissions

- [ ] **Test browser compatibility**
  ```typescript
  const hasUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  ```

---

## Implementation Steps

### Step 1: Remove react-webcam Dependency (15 minutes)

**1.1 Uninstall package**
```bash
npm uninstall react-webcam
```

**1.2 Remove from package.json**
- Verify removal: `grep "react-webcam" package.json` (should return nothing)

**1.3 Verify no other imports**
```bash
# Search entire codebase for react-webcam
grep -r "react-webcam" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
# Should only find PhoneDetector.tsx (or nothing after removal)
```

**Success Criteria**:
- [ ] Package removed from node_modules
- [ ] package.json no longer lists react-webcam
- [ ] No other files import react-webcam

---

### Step 2: Update PhoneDetector.tsx - Imports and Types (10 minutes)

**2.1 Remove react-webcam import (Line 4)**

**Before**:
```typescript
import { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import AlarmEffect from './AlarmEffect'
```

**After**:
```typescript
import { useRef, useState, useEffect } from 'react'
import AlarmEffect from './AlarmEffect'
```

**2.2 Update ref type (Line 12)**

**Before**:
```typescript
const webcamRef = useRef<Webcam>(null)
```

**After**:
```typescript
const videoRef = useRef<HTMLVideoElement>(null)
```

**2.3 Add new state for stream management**

**Add after line 24**:
```typescript
const streamRef = useRef<MediaStream | null>(null)
```

**Success Criteria**:
- [ ] No TypeScript errors after changes
- [ ] `videoRef` properly typed as `HTMLVideoElement`
- [ ] New `streamRef` added for cleanup

---

### Step 3: Implement startCamera() Function (45 minutes)

**3.1 Create new startCamera function**

**Add before detectPhone() function (around line 72)**:

```typescript
/**
 * Start camera stream with getUserMedia
 * Handles permissions, constraints, and error states
 */
const startCamera = async () => {
  try {
    // Request camera access with constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode,  // 'user' or 'environment'
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })

    // Store stream reference for cleanup
    streamRef.current = stream

    // Attach stream to video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not found'))
          return
        }

        videoRef.current.onloadedmetadata = () => {
          resolve()
        }

        videoRef.current.onerror = () => {
          reject(new Error('Video element failed to load'))
        }
      })

      // Start playback
      await videoRef.current.play()

      // Clear any previous errors
      setError(null)
    }
  } catch (err: any) {
    console.error('Camera error:', err)

    // Map error types to user-friendly messages
    let errorMessage = 'Camera access failed. Please try again.'

    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      errorMessage = 'No camera detected. This demo requires a webcam.'
    } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      errorMessage = 'Camera access denied. Please allow camera access in your browser settings.'
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      errorMessage = 'Camera is being used by another application. Please close other apps using the camera.'
    } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      errorMessage = 'Selected camera mode not available. Try switching cameras.'
    } else if (err.name === 'TypeError') {
      errorMessage = 'Camera access not supported in this browser. Please use Chrome, Safari, or Firefox.'
    }

    setError(errorMessage)
    setIsCameraActive(false)

    // Cleanup on error
    stopCamera()
  }
}
```

**3.2 Create stopCamera() helper function**

**Add after startCamera()**:

```typescript
/**
 * Stop camera stream and cleanup resources
 */
const stopCamera = () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => {
      track.stop()
    })
    streamRef.current = null
  }

  if (videoRef.current) {
    videoRef.current.srcObject = null
  }
}
```

**Success Criteria**:
- [ ] startCamera() handles all error types
- [ ] stopCamera() properly cleans up streams
- [ ] Error messages match original mapping
- [ ] TypeScript compiles without errors

---

### Step 4: Update detectPhone() Function (15 minutes)

**4.1 Update video element access (Lines 75-88)**

**Before**:
```typescript
if (
  !modelLoaded ||
  !webcamRef.current ||
  !webcamRef.current.video ||
  !canvasRef.current
) {
  return
}

const video = webcamRef.current.video
const canvas = canvasRef.current
const ctx = canvas.getContext('2d')

if (!ctx || video.readyState !== 4) {
  return
}
```

**After**:
```typescript
if (
  !modelLoaded ||
  !videoRef.current ||
  !canvasRef.current
) {
  return
}

const video = videoRef.current
const canvas = canvasRef.current
const ctx = canvas.getContext('2d')

if (!ctx || video.readyState !== 4) {
  return
}
```

**Changes**:
- Replace `webcamRef` with `videoRef`
- Remove `.video` property access (videoRef IS the video element)
- All other detection logic stays identical

**Success Criteria**:
- [ ] Video element properly accessed
- [ ] TensorFlow detection still works
- [ ] Canvas drawing unchanged

---

### Step 5: Update toggleCamera() Function (20 minutes)

**5.1 Refactor toggle logic (Lines 172-195)**

**Before**:
```typescript
const toggleCamera = () => {
  if (isCameraActive) {
    // Stop camera
    setIsCameraActive(false)
    setPhoneDetected(false)

    // Clear any active alarm timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }

    // Stop the media stream
    if (webcamRef.current?.video?.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  } else {
    // Start camera
    setError(null)
    setIsCameraActive(true)
  }
}
```

**After**:
```typescript
const toggleCamera = async () => {
  if (isCameraActive) {
    // Stop camera
    setIsCameraActive(false)
    setPhoneDetected(false)

    // Clear any active alarm timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }

    // Stop the media stream
    stopCamera()
  } else {
    // Start camera
    setError(null)
    setIsCameraActive(true)
    await startCamera()
  }
}
```

**Changes**:
- Make function `async`
- Replace manual stream cleanup with `stopCamera()`
- Call `startCamera()` when activating

**Success Criteria**:
- [ ] Camera starts when button clicked
- [ ] Camera stops and cleans up properly
- [ ] Error states cleared on restart

---

### Step 6: Update handleCameraSwitch() Function (20 minutes)

**6.1 Refactor switch logic (Lines 204-228)**

**Before**:
```typescript
const handleCameraSwitch = () => {
  // Stop current stream
  if (webcamRef.current?.video?.srcObject) {
    const stream = webcamRef.current.video.srcObject as MediaStream
    stream.getTracks().forEach(track => track.stop())
  }

  // Toggle facing mode
  setFacingMode(prev => prev === 'user' ? 'environment' : 'user')

  // Clear detection state during switch
  setPhoneDetected(false)

  // Clear any active alarm timeout
  if (alarmTimeoutRef.current) {
    clearTimeout(alarmTimeoutRef.current)
    alarmTimeoutRef.current = null
  }

  // Brief pause to ensure stream stops before restarting
  setIsCameraActive(false)
  setTimeout(() => {
    setIsCameraActive(true)
  }, 100)
}
```

**After**:
```typescript
const handleCameraSwitch = async () => {
  // Stop current stream
  stopCamera()

  // Toggle facing mode
  const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
  setFacingMode(newFacingMode)

  // Clear detection state during switch
  setPhoneDetected(false)

  // Clear any active alarm timeout
  if (alarmTimeoutRef.current) {
    clearTimeout(alarmTimeoutRef.current)
    alarmTimeoutRef.current = null
  }

  // Brief pause to ensure stream stops before restarting
  await new Promise(resolve => setTimeout(resolve, 100))

  // Restart with new facing mode
  await startCamera()
}
```

**Changes**:
- Make function `async`
- Replace manual cleanup with `stopCamera()`
- Remove `setIsCameraActive` toggle (keep active)
- Restart camera directly with new facingMode

**Success Criteria**:
- [ ] Front/rear camera switching works
- [ ] No flicker or UI jumps
- [ ] Stream properly cleaned up between switches

---

### Step 7: Replace <Webcam> JSX with <video> (30 minutes)

**7.1 Update video element JSX (Lines 336-420)**

**Before**:
```typescript
{/* Webcam and canvas (when camera is active) */}
{!isLoading && !error && isCompatible && isCameraActive && (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
    {/* Webcam feed */}
    <Webcam
      ref={webcamRef}
      audio={false}
      className="w-full h-auto"
      screenshotFormat="image/jpeg"
      videoConstraints={{
        facingMode: facingMode,
        width: 1280,
        height: 720,
      }}
      onUserMediaError={(err: any) => {
        // ... error handling
      }}
    />

    {/* Canvas overlay for detection boxes */}
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />

    {/* ... rest of UI */}
  </div>
)}
```

**After**:
```typescript
{/* Video and canvas (when camera is active) */}
{!isLoading && !error && isCompatible && isCameraActive && (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
    {/* Video feed */}
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-auto"
      style={{
        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
      }}
    />

    {/* Canvas overlay for detection boxes */}
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />

    {/* ... rest of UI */}
  </div>
)}
```

**Key Attributes**:
- `autoPlay`: Start playback when stream attached
- `playsInline`: Prevent fullscreen on iOS
- `muted`: Required for autoPlay to work
- `transform: scaleX(-1)`: Mirror front camera (user-facing)

**7.2 Add useEffect to manage camera lifecycle**

**Add new useEffect after model loading (around line 170)**:

```typescript
// Start/stop camera based on isCameraActive state
useEffect(() => {
  if (isCameraActive && isCompatible && !error) {
    startCamera()
  }

  // Cleanup on unmount or when camera deactivated
  return () => {
    if (isCameraActive) {
      stopCamera()
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isCameraActive, facingMode])
```

**Success Criteria**:
- [ ] Video element renders correctly
- [ ] Camera stream displays in video
- [ ] Front camera is mirrored
- [ ] Canvas overlay positioned correctly
- [ ] Camera starts/stops with state changes

---

### Step 8: Update Test Files (60 minutes)

**8.1 Update PhoneDetector.test.tsx**

**Location**: `__tests__/PhoneDetector.test.tsx`

**Changes Required**:

1. **Remove react-webcam mock (Lines 4-15)**

**Before**:
```typescript
jest.mock('react-webcam', () => {
  return jest.fn((props) => {
    // Capture the onUserMediaError callback
    if (props.onUserMediaError) {
      (global as any).__webcamErrorCallback = props.onUserMediaError
    }

    return <div data-testid="webcam" {...props} />
  })
})
```

**After**:
```typescript
// Mock getUserMedia
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn(),
  },
  writable: true,
})
```

2. **Update video element mocking**

**Add helper to setup successful getUserMedia**:
```typescript
const mockGetUserMediaSuccess = () => {
  const mockStream = {
    getTracks: jest.fn(() => [
      {
        stop: jest.fn(),
        kind: 'video',
        enabled: true,
      },
    ]),
  }

  ;(navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(mockStream)

  return mockStream
}
```

**Add helper for getUserMedia errors**:
```typescript
const mockGetUserMediaError = (errorName: string) => {
  const error = new Error('getUserMedia error')
  error.name = errorName

  ;(navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(error)
}
```

3. **Update test cases**

**Update "renders without camera active" test**:
```typescript
it('renders without camera active', () => {
  render(<PhoneDetector />)

  expect(screen.queryByTestId('video')).not.toBeInTheDocument()
  expect(screen.getByText(/Camera is off/i)).toBeInTheDocument()
})
```

**Update "starts camera when button clicked" test**:
```typescript
it('starts camera when button clicked', async () => {
  mockGetUserMediaSuccess()

  render(<PhoneDetector />)

  const startButton = await screen.findByText(/Start Camera/i)
  fireEvent.click(startButton)

  await waitFor(() => {
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })
  })
})
```

**Update error handling tests**:
```typescript
it('handles camera permission denied error', async () => {
  mockGetUserMediaError('NotAllowedError')

  render(<PhoneDetector />)

  const startButton = await screen.findByText(/Start Camera/i)
  fireEvent.click(startButton)

  await waitFor(() => {
    expect(screen.getByText(/Camera access denied/i)).toBeInTheDocument()
  })
})
```

**8.2 Run tests and verify**

```bash
npm run test -- PhoneDetector.test.tsx
```

**Success Criteria**:
- [ ] All existing tests pass or updated
- [ ] New tests cover getUserMedia errors
- [ ] Coverage maintained at 20%+
- [ ] No TypeScript errors in tests

---

### Step 9: Manual Testing (90 minutes)

**9.1 Desktop Testing (Chrome, Safari, Firefox)**

Test on macOS/Windows with webcam:

- [ ] **Camera permissions**
  - First visit prompts for permissions
  - Denied permissions show error message
  - Retry button works after granting permissions

- [ ] **Camera controls**
  - Start Camera button activates webcam
  - Stop Camera button deactivates webcam
  - Camera feed displays correctly

- [ ] **Detection functionality**
  - TensorFlow model loads successfully
  - Phone detection triggers alarm
  - Bounding boxes render correctly
  - Detection count increments
  - 3-second cooldown works

- [ ] **Camera switching**
  - Front camera displays (if available)
  - Rear camera displays (if available)
  - Stream switches without crashes

**9.2 Mobile Testing (iOS Safari, Chrome Android)**

Test on real devices (simulators can't access camera):

- [ ] **iOS Safari (iPhone)**
  - Camera permissions prompt
  - Front camera works
  - Rear camera works
  - Camera switch button works
  - Front camera is mirrored
  - Detection works on both cameras

- [ ] **Chrome Android**
  - Camera permissions prompt
  - Front camera works
  - Rear camera works
  - Camera switch button works
  - Detection works on both cameras

**9.3 Edge Cases**

- [ ] **Browser compatibility**
  - getUserMedia not supported → friendly error
  - WebGL not supported → compatibility message

- [ ] **Camera errors**
  - Camera in use by another app → helpful message
  - No camera available → helpful message
  - Camera disconnected mid-session → graceful failure

- [ ] **Performance**
  - Detection runs at ~10 FPS
  - No memory leaks during extended use
  - CPU usage acceptable (40-60%)
  - Camera stops properly on tab switch

**9.4 Testing Checklist Template**

Create a markdown checklist for testers:

```markdown
# Camera Refactor Test Report

**Tester**: ___________
**Date**: ___________
**Device**: ___________
**Browser**: ___________

## Camera Basics
- [ ] Camera starts successfully
- [ ] Camera stops successfully
- [ ] Permissions prompt works
- [ ] Error messages are clear

## Detection
- [ ] Phone detected correctly
- [ ] Bounding box renders
- [ ] Alarm triggers
- [ ] Cooldown works

## Camera Switching
- [ ] Front camera works
- [ ] Rear camera works
- [ ] Switching is smooth
- [ ] Front camera is mirrored

## Issues Found
1. ___________
2. ___________

## Performance Notes
- FPS: ___________
- Load time: ___________
- Responsiveness: ___________
```

**Success Criteria**:
- [ ] All test scenarios pass
- [ ] No regressions from web version
- [ ] Performance matches original (±10%)
- [ ] All edge cases handled gracefully

---

### Step 10: Capacitor-Specific Configuration (30 minutes)

**10.1 Verify capacitor.config.ts setup**

Even though Capacitor isn't installed yet, prepare the configuration:

**Create/verify** `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.phonelunk.app',
  appName: 'Phone Lunk',
  webDir: 'out',
  server: {
    hostname: 'localhost',
    iosScheme: 'https',      // Critical for getUserMedia on iOS
    androidScheme: 'https',  // Ensures consistent behavior
  },
}

export default config
```

**10.2 Document iOS-specific considerations**

Create `docs/ios-camera-requirements.md`:
```markdown
# iOS Camera Requirements

## Critical Configuration

1. **Capacitor server config**
   - Must use `iosScheme: 'https'`
   - Hostname must be 'localhost' (no port)
   - Required for getUserMedia() to work on iOS 15.5+

2. **Info.plist entries** (Phase 3)
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Phone Lunk uses your camera to detect phones</string>
   ```

3. **WebGL backend fallback**
   - iOS uses 16-bit floats
   - May need WASM fallback for precision

## Testing Requirements

- Must test on real iOS device (camera won't work in simulator)
- Test on iOS 15.5+ (getUserMedia changes)
- Test front and rear cameras
- Test WebGL performance

## Known Limitations

- Camera access requires secure context (HTTPS)
- Background detection not possible (iOS suspends WebViews)
- Front camera mirroring handled in CSS
```

**10.3 Add backend fallback for iOS WebGL limitations**

**Update model loading in PhoneDetector.tsx (around line 56)**:

**Before**:
```typescript
const loadModel = async () => {
  try {
    setIsLoading(true)
    tf = await import('@tensorflow/tfjs')
    const cocoSsdModule = await import('@tensorflow-models/coco-ssd')
    cocoSsd = await cocoSsdModule.load()
    setModelLoaded(true)
    setIsLoading(false)
  } catch (err) {
    console.error('Error loading model:', err)
    setError('Failed to load AI model. Please refresh the page.')
    setIsLoading(false)
  }
}
```

**After**:
```typescript
const loadModel = async () => {
  try {
    setIsLoading(true)
    tf = await import('@tensorflow/tfjs')

    // Try WebGL backend first, fallback to WASM if issues
    try {
      await tf.setBackend('webgl')
      await tf.ready()
      console.log('TensorFlow.js backend: WebGL')
    } catch (backendErr) {
      console.warn('WebGL backend failed, falling back to WASM:', backendErr)
      await tf.setBackend('wasm')
      await tf.ready()
      console.log('TensorFlow.js backend: WASM')
    }

    const cocoSsdModule = await import('@tensorflow-models/coco-ssd')
    cocoSsd = await cocoSsdModule.load()
    setModelLoaded(true)
    setIsLoading(false)
  } catch (err) {
    console.error('Error loading model:', err)
    setError('Failed to load AI model. Please refresh the page.')
    setIsLoading(false)
  }
}
```

**Success Criteria**:
- [ ] capacitor.config.ts properly configured
- [ ] iOS requirements documented
- [ ] WebGL fallback implemented
- [ ] Backend selection logged to console

---

### Step 11: Type Checking and Linting (15 minutes)

**11.1 Run TypeScript type checker**

```bash
npm run type-check
```

**Common issues to fix**:
- Ensure `videoRef.current` null checks
- Ensure `streamRef.current` null checks
- Verify async/await types
- Check error object types

**11.2 Run ESLint**

```bash
npm run lint:fix
```

**Common issues**:
- useEffect dependencies (may need eslint-disable comments)
- Async function in useEffect (need wrapper)
- Unused imports

**11.3 Verify build**

```bash
npm run build
```

**Success Criteria**:
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] Build completes successfully
- [ ] No runtime warnings in dev mode

---

### Step 12: End-to-End Testing (30 minutes)

**12.1 Update Playwright tests**

**Location**: `tests/example.spec.ts`

**Update camera permission mocking**:
```typescript
test.describe('Phone Detector', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant camera permissions
    await context.grantPermissions(['camera'])
  })

  test('should load phone detector demo', async ({ page }) => {
    await page.goto('/')

    // Should see demo section
    await expect(page.locator('text=See The Technology In Action')).toBeVisible()

    // Should see start camera button
    const startButton = page.locator('button:has-text("Start Camera")')
    await expect(startButton).toBeVisible()
  })

  test('should show camera feed when started', async ({ page }) => {
    await page.goto('/')

    // Click start camera
    await page.locator('button:has-text("Start Camera")').click()

    // Should see video element
    await expect(page.locator('video')).toBeVisible()

    // Should see monitoring indicator
    await expect(page.locator('text=MONITORING')).toBeVisible()
  })
})
```

**12.2 Run E2E tests**

```bash
npm run test:e2e
```

**Success Criteria**:
- [ ] All E2E tests pass
- [ ] Camera permissions handled correctly
- [ ] Video element renders
- [ ] No console errors

---

### Step 13: Documentation Updates (30 minutes)

**13.1 Update CLAUDE.md**

**Find section**: "PhoneDetector Component Architecture"

**Update camera management section**:
```markdown
### Camera Management

Uses native browser `getUserMedia()` API:
- Manual stream management via `streamRef`
- Front/rear camera switching with `facingMode` constraint
- Comprehensive error handling with try/catch
- Proper cleanup in useEffect and event handlers

**Implementation**:
- `startCamera()`: Request camera, attach to video element, handle errors
- `stopCamera()`: Stop all tracks, cleanup stream reference
- `videoRef`: Direct reference to HTMLVideoElement (passed to TensorFlow)
- `streamRef`: MediaStream reference for cleanup

**Capacitor Compatibility**:
- Works in Capacitor iOS/Android WebViews
- Requires `iosScheme: 'https'` in capacitor.config.ts
- No library dependencies, pure Web APIs
```

**13.2 Update README (if exists)**

Add note about camera implementation:
```markdown
## Camera Implementation

Phone Lunk uses native browser APIs for camera access:
- `navigator.mediaDevices.getUserMedia()` for camera stream
- Native `<video>` element for display
- HTML5 Canvas for bounding box overlays
- No third-party camera libraries

This ensures compatibility with:
- Desktop browsers (Chrome, Safari, Firefox)
- Mobile web browsers
- Capacitor iOS/Android apps
```

**13.3 Create migration documentation**

**Create**: `docs/camera-refactor-notes.md`
```markdown
# Camera Refactor: react-webcam → Native getUserMedia

**Completed**: 2025-11-08
**Developer**: [Your name]

## What Changed

Replaced `react-webcam` library with native browser APIs:
- Removed dependency on react-webcam package
- Implemented manual getUserMedia() camera management
- Direct HTMLVideoElement usage (no wrapper library)

## Why

1. **Capacitor compatibility**: react-webcam doesn't work reliably in iOS WebView
2. **Reduced dependencies**: One less package to maintain
3. **More control**: Direct access to MediaStream API
4. **Performance**: No abstraction overhead

## Migration Impact

### Files Changed
- `components/PhoneDetector.tsx` (459 → 485 lines)
- `__tests__/PhoneDetector.test.tsx` (514 → 540 lines)
- `package.json` (removed react-webcam)

### Breaking Changes
- None (internal implementation only)

### API Changes
- `webcamRef` → `videoRef` (HTMLVideoElement instead of Webcam)
- Added `streamRef` for manual stream management
- `toggleCamera()` and `handleCameraSwitch()` now async

### Testing Changes
- Mock getUserMedia instead of react-webcam
- Test MediaStream lifecycle
- Verify cleanup behavior

## Future Work

- [ ] Add Capacitor-specific optimizations
- [ ] Test on iOS 15.5+ with Capacitor
- [ ] Implement app lifecycle handlers for mobile
- [ ] Consider adding camera resolution selector
```

**Success Criteria**:
- [ ] CLAUDE.md updated with new architecture
- [ ] Migration notes documented
- [ ] Technical decisions recorded
- [ ] Future work identified

---

### Step 14: Create Pull Request (20 minutes)

**14.1 Review changes**

```bash
git status
git diff
```

**14.2 Commit changes**

```bash
git add components/PhoneDetector.tsx
git add __tests__/PhoneDetector.test.tsx
git add package.json package-lock.json
git add docs/
git commit -m "$(cat <<'EOF'
refactor: Replace react-webcam with native getUserMedia API

## Summary
Replaced react-webcam library with native browser getUserMedia() API
for Capacitor iOS/Android compatibility.

## Changes
- Remove react-webcam dependency
- Implement manual camera stream management with getUserMedia()
- Replace Webcam component with native <video> element
- Update error handling from callback to try/catch
- Add MediaStream cleanup with streamRef
- Update tests to mock getUserMedia instead of react-webcam

## Impact
- ✅ Capacitor iOS/Android compatible (no WebView issues)
- ✅ Reduced dependencies (removed react-webcam)
- ✅ Better control over camera lifecycle
- ✅ No breaking changes (internal implementation only)

## Testing
- ✅ Unit tests updated and passing
- ✅ E2E tests passing
- ✅ Manual testing on desktop (Chrome, Safari, Firefox)
- ✅ Manual testing on mobile (iOS Safari, Chrome Android)
- ✅ Type checking passes
- ✅ Linting passes
- ✅ Build succeeds

## Performance
- Detection FPS: ~10 (unchanged)
- Model load time: 2-4s (unchanged)
- Memory usage: 100-150MB (unchanged)

## Next Steps
- Phase 3: iOS Capacitor configuration
- Phase 4: Android Capacitor configuration
- Phase 5: Cross-platform testing with Capacitor

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**14.3 Push and create PR**

```bash
git push origin refactor/native-camera-implementation
```

**PR Template**:
```markdown
## Phase 2: Camera System Refactor

**Goal**: Replace react-webcam with Capacitor-compatible camera implementation

### Changes
- Removed react-webcam dependency
- Implemented native getUserMedia() API
- Updated PhoneDetector component to use HTMLVideoElement
- Refactored error handling and stream management
- Updated all tests to mock getUserMedia

### Testing
- [x] Unit tests pass
- [x] E2E tests pass
- [x] Type checking passes
- [x] Build succeeds
- [x] Manual testing on desktop
- [x] Manual testing on mobile

### Compatibility
- ✅ Desktop browsers (Chrome, Safari, Firefox)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ✅ Ready for Capacitor iOS/Android (Phase 3-4)

### Performance
No regressions detected:
- Detection FPS: ~10 (target met)
- Model load: 2-4s (acceptable)
- Memory: 100-150MB (normal)

### Documentation
- [x] CLAUDE.md updated
- [x] Migration notes created
- [x] Technical decisions documented

### Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added/updated
- [x] No new warnings
- [x] Dependent changes merged

### Next Steps
1. Review and merge this PR
2. Begin Phase 3: iOS Capacitor configuration
3. Test on real iOS device with Capacitor

---

**Estimated Review Time**: 30-45 minutes
**Merge After**: All checks pass + 1 approval
```

**Success Criteria**:
- [ ] Changes committed with detailed message
- [ ] PR created with comprehensive description
- [ ] CI/CD pipeline passes
- [ ] Ready for review

---

## Rollback Strategy

If critical issues arise, here's the rollback plan:

### Option 1: Revert Commit (Preferred)

```bash
# If not merged yet
git revert HEAD

# If merged to main
git revert <commit-hash>
git push origin main
```

### Option 2: Restore from Backup

```bash
# Restore backup file
cp components/PhoneDetector.tsx.backup components/PhoneDetector.tsx

# Reinstall react-webcam
npm install react-webcam@^7.2.0

# Restore tests
git checkout HEAD~1 __tests__/PhoneDetector.test.tsx

# Commit rollback
git add .
git commit -m "revert: Rollback camera refactor, restore react-webcam"
git push
```

### Option 3: Return to Tagged Commit

```bash
# Reset to tagged commit
git reset --hard before-camera-refactor

# Force push (only if safe)
git push --force origin refactor/native-camera-implementation
```

### When to Rollback

Rollback immediately if:
- ⚠️ Camera fails on 50%+ of tested devices
- ⚠️ Detection accuracy drops >10%
- ⚠️ Performance degrades significantly (FPS <5)
- ⚠️ Critical security issue discovered
- ⚠️ Cannot fix within 2 hours

Do NOT rollback if:
- ✅ Minor edge case issues
- ✅ Specific browser/device issues (can fix incrementally)
- ✅ Test failures (can update tests)
- ✅ Documentation issues

---

## Success Metrics

### Must Have (Blockers for merge)

- ✅ **Functional**: Camera starts/stops on all tested browsers
- ✅ **Detection**: Phone detection works identically to before
- ✅ **Tests**: 100% of tests pass (unit + E2E)
- ✅ **Build**: Production build succeeds with zero errors
- ✅ **Performance**: Detection FPS within ±10% of baseline

### Should Have (Nice to have, not blockers)

- ✅ **Documentation**: All docs updated with new architecture
- ✅ **Error Handling**: All error scenarios tested
- ✅ **Mobile**: Tested on iOS and Android mobile browsers
- ✅ **Accessibility**: Video element properly labeled

### Could Have (Future improvements)

- 🔲 **Performance**: FPS tracking and reporting
- 🔲 **Analytics**: Track camera error rates
- 🔲 **UX**: Camera resolution selector
- 🔲 **UX**: Picture-in-picture mode

---

## Estimated Timeline

| Step | Estimated Time | Actual Time | Notes |
|------|----------------|-------------|-------|
| 1. Remove dependency | 15 min | ___ | ___ |
| 2. Update imports/types | 10 min | ___ | ___ |
| 3. Implement startCamera() | 45 min | ___ | ___ |
| 4. Update detectPhone() | 15 min | ___ | ___ |
| 5. Update toggleCamera() | 20 min | ___ | ___ |
| 6. Update handleCameraSwitch() | 20 min | ___ | ___ |
| 7. Replace JSX | 30 min | ___ | ___ |
| 8. Update tests | 60 min | ___ | ___ |
| 9. Manual testing | 90 min | ___ | ___ |
| 10. Capacitor config | 30 min | ___ | ___ |
| 11. Type check/lint | 15 min | ___ | ___ |
| 12. E2E testing | 30 min | ___ | ___ |
| 13. Documentation | 30 min | ___ | ___ |
| 14. Create PR | 20 min | ___ | ___ |
| **Total** | **6h 30m** | ___ | ___ |

**Buffer**: Add 1-2 hours for unexpected issues
**Total with Buffer**: **7-8 hours**

---

## Risk Assessment

### High Risk ⚠️

**Risk**: TensorFlow.js detection breaks
- **Likelihood**: Low (video element API is stable)
- **Impact**: High (core feature broken)
- **Mitigation**: Extensive testing before merge, keep detection logic identical

**Risk**: Camera permissions fail on iOS
- **Likelihood**: Medium (iOS WebView can be finicky)
- **Impact**: High (iOS users can't use app)
- **Mitigation**: Test on real iOS device, implement Capacitor config early

### Medium Risk ⚠️

**Risk**: Performance regression
- **Likelihood**: Low (native APIs are efficient)
- **Impact**: Medium (poor UX but functional)
- **Mitigation**: Benchmark before/after, monitor FPS

**Risk**: Browser compatibility issues
- **Likelihood**: Medium (getUserMedia support varies)
- **Impact**: Medium (some browsers/versions fail)
- **Mitigation**: Feature detection, graceful fallbacks

### Low Risk ✅

**Risk**: Test failures
- **Likelihood**: Medium (mocking strategy changed)
- **Impact**: Low (can update tests)
- **Mitigation**: Update mocks, add new test cases

**Risk**: Build errors
- **Likelihood**: Low (TypeScript catches most issues)
- **Impact**: Low (can fix before merge)
- **Mitigation**: Run type-check frequently during development

---

## Common Pitfalls & Solutions

### Pitfall 1: Video element readyState

**Problem**: Accessing video before it's ready causes errors

**Solution**:
```typescript
// Always check readyState before using video
if (video.readyState !== 4) {
  return // Not ready yet
}
```

### Pitfall 2: Async startCamera in useEffect

**Problem**: Can't make useEffect callback async directly

**Solution**:
```typescript
useEffect(() => {
  if (isCameraActive) {
    startCamera() // Call async function, don't await
  }

  return () => {
    stopCamera() // Sync cleanup
  }
}, [isCameraActive])
```

### Pitfall 3: Stream cleanup

**Problem**: Stream continues running after component unmount

**Solution**:
```typescript
// Always stop all tracks
streamRef.current.getTracks().forEach(track => track.stop())
streamRef.current = null
```

### Pitfall 4: Front camera mirroring

**Problem**: Front camera appears backwards (mirror image)

**Solution**:
```typescript
// Apply CSS transform for front camera
<video
  style={{
    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
  }}
/>
```

### Pitfall 5: iOS autoPlay restrictions

**Problem**: Video won't autoPlay on iOS

**Solution**:
```typescript
// Must include muted attribute
<video autoPlay playsInline muted />
```

### Pitfall 6: Race conditions during camera switch

**Problem**: Multiple streams active during switch

**Solution**:
```typescript
// Always stop before starting new stream
await stopCamera()
await new Promise(resolve => setTimeout(resolve, 100)) // Brief pause
await startCamera()
```

---

## Questions & Answers

### Q: Why remove react-webcam if it works on web?

**A**: Capacitor iOS WebView has getUserMedia restrictions that react-webcam doesn't handle well. Native implementation gives us full control and ensures compatibility.

### Q: Will this work with Next.js static export?

**A**: Yes! getUserMedia is client-side only. We use dynamic imports for TensorFlow.js just like before, and the video element is purely runtime.

### Q: Do we need to test in Capacitor before merging?

**A**: No. This refactor makes the code Capacitor-compatible, but we test on web first. Capacitor testing happens in Phase 3-4 after iOS/Android setup.

### Q: What about older browsers?

**A**: We already check for getUserMedia support in `isCompatible` check. Unsupported browsers see the friendly fallback message.

### Q: Will performance be affected?

**A**: No. We're replacing a thin wrapper (react-webcam) with direct API calls. Performance should be identical or slightly better (less abstraction overhead).

### Q: Can we revert easily if needed?

**A**: Yes. We've tagged the commit before changes, created a backup file, and documented the rollback process. Revert takes ~5 minutes.

---

## Appendix A: Code Comparison

### Before (react-webcam)

```typescript
// Import
import Webcam from 'react-webcam'

// Ref
const webcamRef = useRef<Webcam>(null)

// Access video
const video = webcamRef.current.video

// JSX
<Webcam
  ref={webcamRef}
  audio={false}
  videoConstraints={{
    facingMode: facingMode,
    width: 1280,
    height: 720,
  }}
  onUserMediaError={(err) => {
    // Handle error
  }}
/>

// Cleanup
if (webcamRef.current?.video?.srcObject) {
  const stream = webcamRef.current.video.srcObject as MediaStream
  stream.getTracks().forEach(track => track.stop())
}
```

### After (native getUserMedia)

```typescript
// No import needed (native APIs)

// Refs
const videoRef = useRef<HTMLVideoElement>(null)
const streamRef = useRef<MediaStream | null>(null)

// Access video
const video = videoRef.current

// Start camera
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })

    streamRef.current = stream

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      await videoRef.current.play()
    }
  } catch (err: any) {
    // Handle error
  }
}

// JSX
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted
/>

// Cleanup
if (streamRef.current) {
  streamRef.current.getTracks().forEach(track => track.stop())
  streamRef.current = null
}
```

---

## Appendix B: Browser Compatibility Matrix

| Browser | Version | getUserMedia | Front Camera | Rear Camera | Notes |
|---------|---------|-------------|--------------|-------------|-------|
| Chrome Desktop | 53+ | ✅ | ✅ | N/A | Excellent support |
| Firefox Desktop | 36+ | ✅ | ✅ | N/A | Excellent support |
| Safari Desktop | 11+ | ✅ | ✅ | N/A | Requires user gesture |
| Chrome Android | 53+ | ✅ | ✅ | ✅ | Excellent support |
| Safari iOS | 11+ | ✅ | ✅ | ✅ | Requires secure context |
| Edge | 79+ | ✅ | ✅ | N/A | Chromium-based, same as Chrome |

**Minimum Requirements**:
- HTTPS or localhost (secure context required)
- Camera hardware available
- User grants permissions

---

## Appendix C: Testing Device Matrix

| Device | OS | Browser | Front | Rear | Detection | Notes |
|--------|-----|---------|-------|------|-----------|-------|
| MacBook Pro | macOS 14 | Chrome 120 | ✅ | N/A | ✅ | Dev machine |
| MacBook Pro | macOS 14 | Safari 17 | ✅ | N/A | ✅ | Dev machine |
| iPhone 14 Pro | iOS 17 | Safari | ✅ | ✅ | ✅ | Real device test |
| Pixel 7 | Android 14 | Chrome | ✅ | ✅ | ✅ | Real device test |
| ___ | ___ | ___ | ⬜ | ⬜ | ⬜ | Add your tests |

**Legend**:
- ✅ Tested and working
- ⚠️ Tested with issues
- ❌ Tested and failing
- ⬜ Not tested

---

## Appendix D: File Checklist

**Files to Modify**:
- [x] `components/PhoneDetector.tsx` - Main implementation
- [x] `__tests__/PhoneDetector.test.tsx` - Update tests
- [x] `package.json` - Remove react-webcam
- [x] `package-lock.json` - Updated after npm uninstall
- [x] `CLAUDE.md` - Update architecture docs
- [ ] `README.md` - Add camera notes (if applicable)

**Files to Create**:
- [ ] `docs/camera-refactor-notes.md` - Migration notes
- [ ] `docs/ios-camera-requirements.md` - iOS-specific docs
- [ ] `capacitor.config.ts` - Capacitor config (if not exists)

**Files NOT to Modify**:
- ✅ `components/AlarmEffect.tsx` - No changes needed
- ✅ `app/page.tsx` - No changes needed
- ✅ `app/globals.css` - No changes needed
- ✅ `site.config.mjs` - No changes needed
- ✅ All other components - No changes needed

---

## Final Pre-Flight Checklist

Before starting implementation, verify:

- [ ] Current codebase is clean (no uncommitted changes)
- [ ] All tests pass on main branch
- [ ] Feature branch created
- [ ] Backup created and tagged
- [ ] This plan reviewed and understood
- [ ] Time allocated (7-8 hours)
- [ ] Testing devices available (desktop + mobile)
- [ ] Team notified (if applicable)

**Ready to begin?** Start with Step 1: Remove react-webcam Dependency

---

**Document Version**: 1.0
**Last Updated**: 2025-11-08
**Next Review**: After Phase 2 completion
