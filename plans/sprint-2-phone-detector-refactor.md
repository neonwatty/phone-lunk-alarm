# Sprint 2: Phone Detector Refactoring Plan

## Overview
Refactor the existing PhoneDetector component to work in the mobile app. Extract reusable logic into hooks and create mobile-optimized components.

## Current State Analysis

### PhoneDetector Component (459 lines)
**Location**: `components/PhoneDetector.tsx`

**Key Functionality**:
- TensorFlow.js + COCO-SSD model loading (dynamic imports for SSR compatibility)
- Camera management (start/stop, front/rear switching)
- Detection loop (100ms intervals, ~10 FPS)
- Bounding box rendering on canvas overlay
- Alarm trigger with 3-second cooldown
- Error handling for camera permissions and compatibility

**State Management**:
```typescript
- modelLoaded: boolean
- phoneDetected: boolean
- detectionCount: number
- isLoading: boolean
- error: string | null
- isCompatible: boolean
- isCameraActive: boolean
- facingMode: 'user' | 'environment'
```

**Refs**:
```typescript
- webcamRef: Webcam component
- canvasRef: Canvas for drawing boxes
- detectionIntervalRef: setInterval handle
- alarmTimeoutRef: setTimeout handle
- lastAlarmTimeRef: timestamp for cooldown
```

## Goals

1. **Separation of Concerns**: Split detection logic from UI rendering
2. **Reusability**: Create hooks and components usable across web and mobile
3. **Mobile Optimization**: Streamlined UI for mobile screens
4. **Session Integration**: Connect with SessionContext for stats tracking
5. **Settings Integration**: Use sensitivity from SettingsContext

## Architecture Design

```
┌─────────────────────────────────────────┐
│     DetectScreen (Mobile UI)            │
│  - Session controls (start/stop)        │
│  - Stats display                        │
│  - Settings integration                 │
└─────────────────┬───────────────────────┘
                  │
                  ├── usePhoneDetection hook
                  │   (detection logic)
                  │
                  └── MobileCamera component
                      (camera + canvas overlay)
```

## Implementation Tasks

### Task 1: Create usePhoneDetection Hook
**File**: `hooks/usePhoneDetection.ts`

**Purpose**: Encapsulate all detection logic (model loading, detection loop, alarm management)

**Interface**:
```typescript
interface UsePhoneDetectionOptions {
  isActive: boolean;           // Control detection loop
  onPhoneDetected?: () => void; // Callback when phone found
  confidenceThreshold?: number; // Default 0.35
  detectionInterval?: number;   // Default 100ms
  alarmDuration?: number;       // Default 5000ms
  cooldownPeriod?: number;      // Default 3000ms
}

interface UsePhoneDetectionReturn {
  // Model state
  modelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  isCompatible: boolean;

  // Detection state
  phoneDetected: boolean;
  detectionCount: number;

  // Detection function (called by camera component)
  detectPhone: (video: HTMLVideoElement) => Promise<Prediction[]>;

  // Drawing helper
  drawPredictions: (
    ctx: CanvasRenderingContext2D,
    predictions: Prediction[],
    canvasWidth: number,
    canvasHeight: number
  ) => void;
}
```

**Responsibilities**:
- Load TensorFlow.js and COCO-SSD model
- Check browser compatibility (WebGL, getUserMedia)
- Run detection on video frames when active
- Manage alarm state and cooldown
- Call onPhoneDetected callback
- Return predictions for rendering

### Task 2: Create MobileCamera Component
**File**: `components/mobile/MobileCamera.tsx`

**Purpose**: Handle camera display, canvas overlay, and visual feedback

**Props**:
```typescript
interface MobileCameraProps {
  isActive: boolean;
  facingMode: 'user' | 'environment';
  onCameraReady?: () => void;
  onCameraError?: (error: string) => void;
  onSwitchCamera?: () => void;
  detectPhone?: (video: HTMLVideoElement) => Promise<Prediction[]>;
  drawPredictions?: (ctx, predictions, width, height) => void;
  detectionInterval?: number; // Default 100ms
}
```

**Responsibilities**:
- Render Webcam component with mobile-optimized constraints
- Render canvas overlay for bounding boxes
- Run detection loop using detectPhone callback
- Handle camera switching
- Display status indicators (MONITORING badge, detection count)
- Show error states

**UI Elements**:
- Video feed with canvas overlay
- Top bar: MONITORING indicator, camera switch button
- Bottom bar: Detection status (All Clear / Phone Detected)
- Error overlay when camera fails

### Task 3: Update DetectScreen
**File**: `components/mobile/DetectScreen.tsx`

**Purpose**: Integrate camera, detection, and session management

**State to Add**:
```typescript
const [isActive, setIsActive] = useState(false);
const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
```

**Context Integration**:
```typescript
const { settings } = useSettings(); // Get sensitivity
const {
  isActive: sessionActive,
  startSession,
  endSession,
  incrementDetection,
  elapsedSeconds
} = useSession();
```

**Layout**:
```
┌─────────────────────────────────┐
│         Detect Screen           │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   MobileCamera Component  │  │
│  │   (or placeholder)        │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Session Stats Bar        │  │
│  │  Time: 0m 0s | Phones: 0  │  │
│  └───────────────────────────┘  │
│                                 │
│  [START DETECTION] (big button) │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Sensitivity Slider       │  │
│  │  🐌 ─────●───── 🐇       │  │
│  └───────────────────────────┘  │
│                                 │
│  [Switch Camera] [Settings]     │
│                                 │
└─────────────────────────────────┘
```

**Flow**:
1. User taps START DETECTION
   - Call `startSession()`
   - Set `isActive = true`
   - Camera starts, model loads
2. Detection runs
   - On phone detected: call `incrementDetection()`, show alarm
3. User taps STOP DETECTION
   - Call `endSession()` (saves to stats)
   - Set `isActive = false`
   - Camera stops

### Task 4: Session Integration

**Connect detection to SessionContext**:
```typescript
const handlePhoneDetected = useCallback(() => {
  incrementDetection();

  // Optional: capture screenshot if auto-capture enabled
  if (settings.autoCapture) {
    // TODO: Implement in Sprint 4
  }

  // Optional: play alarm sound if enabled
  if (settings.alarmSound) {
    // Play sound
  }
}, [incrementDetection, settings]);
```

**Use hook with session control**:
```typescript
const detection = usePhoneDetection({
  isActive: sessionActive,
  onPhoneDetected: handlePhoneDetected,
  confidenceThreshold: settings.detectionSensitivity / 100,
});
```

## File Structure

```
hooks/
  usePhoneDetection.ts        (NEW) - Detection logic hook

components/mobile/
  MobileCamera.tsx            (NEW) - Camera component
  DetectScreen.tsx            (UPDATE) - Main detect screen

components/
  PhoneDetector.tsx           (KEEP) - For landing page demo
```

## Testing Checklist

### Simulator Testing
- [ ] Model loads without errors
- [ ] Camera permission prompt appears
- [ ] Front camera works (user mode)
- [ ] Rear camera works (environment mode)
- [ ] Camera switch button toggles between cameras
- [ ] Detection loop runs when session active
- [ ] Phone detection triggers alarm
- [ ] Bounding boxes render correctly
- [ ] Session timer increments
- [ ] Detection count increments
- [ ] Stop detection ends session
- [ ] Stats are saved after session ends

### Edge Cases
- [ ] Handle camera permission denied
- [ ] Handle no camera available
- [ ] Handle model load failure
- [ ] Handle WebGL not supported
- [ ] Camera switch during active detection
- [ ] Multiple rapid detections (cooldown works)
- [ ] Stop detection during alarm animation

## Success Criteria

1. ✅ Detection logic extracted into reusable hook
2. ✅ Mobile camera component renders correctly
3. ✅ Start/stop detection controls work
4. ✅ Camera switching works on mobile
5. ✅ Phone detection triggers properly
6. ✅ Session stats update correctly
7. ✅ Settings sensitivity affects detection
8. ✅ No regressions on landing page PhoneDetector

## Implementation Order

1. Create `usePhoneDetection` hook (copy logic from PhoneDetector)
2. Create `MobileCamera` component (simplified UI)
3. Update `DetectScreen` to use new hook + component
4. Test in simulator
5. Fix any bugs
6. Verify landing page still works

## Notes

- Keep existing PhoneDetector.tsx unchanged for landing page
- Use dynamic imports for TensorFlow.js (SSR compatibility)
- Default to rear camera on mobile (better for detection)
- Sensitivity slider value: 0-100, convert to confidence 0.0-1.0
- Consider adding visual feedback for detection cooldown
