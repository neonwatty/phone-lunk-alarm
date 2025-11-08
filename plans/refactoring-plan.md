# Phone Lunk Mobile App - Refactoring Plan

## Overview
Transform current landing page wrapper into focused mobile app with tab-based navigation and camera-first UX.

---

## Phase 1: Core Infrastructure

### 1.1 Create App Structure
- [ ] Create `app/mobile/` directory for mobile-specific pages
- [ ] Set up tab navigation layout
- [ ] Create mobile app entry point (`app/mobile/layout.tsx`)

### 1.2 State Management
- [ ] Create context for session state (`contexts/SessionContext.tsx`)
  - Current session timer
  - Detection count
  - Active/inactive state
- [ ] Create context for settings (`contexts/SettingsContext.tsx`)
  - Alarm sound on/off
  - Auto-capture on/off
  - Dark mode preference
  - Detection sensitivity (0-100%, default 35%)
- [ ] Create context for stats (`contexts/StatsContext.tsx`)
  - Total sessions
  - Total phones detected
  - Total monitoring time

### 1.3 Data Persistence
- [ ] Create utility for localStorage/AsyncStorage (`lib/storage.ts`)
- [ ] Implement stats persistence
- [ ] Implement settings persistence

---

## Phase 2: Component Refactoring

### 2.1 PhoneDetector Refactor
Current: `components/PhoneDetector.tsx` (459 lines, embedded in landing page)

**Refactor to**:
- `components/detection/DetectionEngine.tsx` - Core detection logic (headless)
  - Model loading
  - Detection loop
  - Bounding box calculation
  - No UI, just hooks/functions
- `components/detection/CameraView.tsx` - Camera display + canvas overlay
  - Video element
  - Canvas for bounding boxes
  - Camera switching logic
- `components/detection/DetectionControls.tsx` - Start/Stop/Settings buttons
- `components/detection/DetectionStats.tsx` - Session timer + count display
- `components/detection/SensitivitySlider.tsx` - NEW: Real-time sensitivity control

**Key changes**:
- Extract model loading into custom hook: `usePhoneDetection()`
- Extract camera management into: `useCamera()`
- Make detection sensitivity a prop (controllable)
- Separate concerns: logic vs. presentation

### 2.2 Create New Components

**Tab Screens**:
- `app/mobile/home/page.tsx` - Home screen with stats
- `app/mobile/detect/page.tsx` - Detection screen wrapper
- `app/mobile/settings/page.tsx` - Settings screen

**UI Components**:
- `components/mobile/TabNavigation.tsx` - Bottom tab bar
- `components/mobile/HomeScreen.tsx` - Welcome + stats dashboard
- `components/mobile/StatsCard.tsx` - Stats display card
- `components/mobile/SessionSummary.tsx` - Post-session results
- `components/mobile/ShareButton.tsx` - Screenshot sharing with watermark
- `components/mobile/PermissionRequest.tsx` - Camera permission UI
- `components/mobile/Tutorial.tsx` - First-time tutorial

**Detection UI**:
- `components/detection/SensitivitySlider.tsx` - Sensitivity control
- `components/detection/CameraSwitch.tsx` - Front/rear camera toggle
- `components/detection/ScreenshotButton.tsx` - Capture + watermark

---

## Phase 3: Feature Implementation

### 3.1 Tab Navigation
- [ ] Create bottom tab bar with 3 tabs (Home, Detect, Settings)
- [ ] Implement navigation state management
- [ ] Add active tab highlighting
- [ ] Handle tab transitions

### 3.2 Home Screen
- [ ] Welcome header
- [ ] Stats dashboard (sessions, phones caught, time)
- [ ] "Start Detection" button → navigate to Detect tab
- [ ] Bottom CTA banner to phone-lunk.app

### 3.3 Detect Screen (Enhanced)
- [ ] Integrate refactored detection components
- [ ] Add sensitivity slider (0-100%, real-time adjustment)
- [ ] Add camera switch button (front/rear)
- [ ] Add screenshot button
- [ ] Session timer display
- [ ] Detection counter display
- [ ] Post-session summary screen

### 3.4 Settings Screen
- [ ] Alarm sound toggle
- [ ] Auto-capture toggle
- [ ] Dark mode toggle
- [ ] "About" section with link to phone-lunk.app
- [ ] "Clear all data" button

### 3.5 Screenshot + Sharing
- [ ] Capture canvas frame when 📷 button tapped
- [ ] Add "phone-lunk.app" watermark (bottom left corner)
- [ ] Store screenshot temporarily
- [ ] Native share sheet integration
- [ ] Clear screenshots after session

---

## Phase 4: Polish & Optimization

### 4.1 First-Time Experience
- [ ] Detect first app launch
- [ ] Show tutorial overlay (optional)
- [ ] Request camera permissions
- [ ] Initialize default settings

### 4.2 Animations & Transitions
- [ ] Tab switching animations
- [ ] Alarm effect polish
- [ ] Session summary reveal animation
- [ ] Bounding box animations

### 4.3 Mobile Optimizations
- [ ] Portrait orientation lock
- [ ] Status bar styling
- [ ] Splash screen
- [ ] App icons (update for mobile context)
- [ ] Handle background/foreground transitions

### 4.4 Error Handling
- [ ] Camera permission denied state
- [ ] Model load failure state
- [ ] No camera available state
- [ ] WebGL not supported state

---

## Implementation Order

### Sprint 1: Infrastructure (Estimated: 4-6 hours)
1. Create mobile app structure
2. Set up contexts (Session, Settings, Stats)
3. Implement data persistence
4. Create tab navigation skeleton

### Sprint 2: Refactor PhoneDetector (Estimated: 6-8 hours)
1. Extract detection logic into hooks
2. Create headless DetectionEngine
3. Build CameraView component
4. Build DetectionControls component
5. Add sensitivity slider
6. Test detection still works

### Sprint 3: Build Screens (Estimated: 6-8 hours)
1. Home screen with stats
2. Detect screen integration
3. Settings screen
4. Session summary screen

### Sprint 4: Screenshot & Sharing (Estimated: 3-4 hours)
1. Canvas capture functionality
2. Watermark overlay
3. Share sheet integration

### Sprint 5: Polish (Estimated: 4-6 hours)
1. First-time tutorial
2. Animations
3. Error states
4. Mobile optimizations
5. Testing on real devices

**Total Estimated Time**: 23-32 hours

---

## File Structure (After Refactoring)

```
app/
  mobile/
    layout.tsx          # Mobile app layout with tab nav
    page.tsx            # Redirect to /mobile/home
    home/
      page.tsx          # Home screen
    detect/
      page.tsx          # Detection screen
    settings/
      page.tsx          # Settings screen

components/
  detection/            # Detection-specific components
    DetectionEngine.tsx # Core headless detection logic
    CameraView.tsx      # Camera display + canvas
    DetectionControls.tsx
    DetectionStats.tsx
    SensitivitySlider.tsx
    CameraSwitch.tsx
    ScreenshotButton.tsx

  mobile/               # Mobile app UI components
    TabNavigation.tsx
    HomeScreen.tsx
    StatsCard.tsx
    SessionSummary.tsx
    ShareButton.tsx
    PermissionRequest.tsx
    Tutorial.tsx

contexts/
  SessionContext.tsx    # Session state
  SettingsContext.tsx   # User preferences
  StatsContext.tsx      # Cumulative stats

hooks/
  usePhoneDetection.ts  # Detection logic hook
  useCamera.ts          # Camera management hook
  useStats.ts           # Stats management hook

lib/
  storage.ts            # localStorage/AsyncStorage utils
  watermark.ts          # Screenshot watermarking logic

public/
  images/
    watermark.png       # "phone-lunk.app" watermark asset
```

---

## Testing Checklist

### Functional Tests
- [ ] Detection works with sensitivity adjustment
- [ ] Camera switch toggles front/rear
- [ ] Screenshots capture with watermark
- [ ] Stats persist across app restarts
- [ ] Settings persist across app restarts
- [ ] Tab navigation works
- [ ] Session timer accurate
- [ ] Detection counter accurate
- [ ] Share sheet opens correctly

### Device Tests
- [ ] iOS Simulator
- [ ] Real iOS device (iPhone)
- [ ] Android Emulator
- [ ] Real Android device
- [ ] Different screen sizes
- [ ] Portrait/landscape handling
- [ ] Background/foreground transitions

### Edge Cases
- [ ] Camera permission denied
- [ ] Model load failure
- [ ] No camera available
- [ ] Low light conditions
- [ ] Multiple phones in frame
- [ ] Rapid start/stop toggling

---

## Migration Strategy

**Option A: Full Rewrite**
- Build mobile app in `app/mobile/`
- Keep existing landing page at `app/page.tsx`
- Separate codebases (web vs. mobile)
- Capacitor points to mobile build

**Option B: Conditional Rendering**
- Detect Capacitor environment
- Render mobile UI if in app
- Render landing page if on web
- Shared components where possible

**Recommendation**: Option A (Full Rewrite in `app/mobile/`)
- Cleaner separation
- Easier to maintain
- Better performance (no conditional logic)
- Can still share detection logic

---

## Next Steps

1. Review this plan
2. Confirm approach (Option A vs. B)
3. Start Sprint 1: Infrastructure
4. Iterative implementation with testing
5. Deploy to test devices

---

## Open Questions

1. Should we support landscape orientation?
2. Do we need offline mode (model cached)?
3. Should screenshots be saved to device photos?
4. Haptic feedback on detection?
5. Sound effects for alarm (custom or native)?
