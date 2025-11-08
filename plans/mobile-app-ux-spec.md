# Phone Lunk Mobile App - UX Specification

## Overview
Personal companion app for gym-goers. Positions as: "If your gym doesn't have Phone Lunk installed, use our free personal version!"

**Important**: This is a gag app. All CTAs point to https://phone-lunk.app (the satirical B2B site).

---

## App Structure

### Tab-Based Navigation (3 tabs)

```
┌─────────────────────────────────┐
│                                 │
│         TAB CONTENT             │
│                                 │
│                                 │
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

---

## Screen Specifications

### Tab 1: Home Screen (Launch Experience)

**Purpose**: Welcome, context, and quick stats

**Layout**:
```
┌─────────────────────────────────┐
│  Phone Lunk                    │
│  Your Personal Phone Detector   │
├─────────────────────────────────┤
│                                 │
│  [App Icon/Illustration]        │
│                                 │
│  📊 Your Stats                  │
│  ┌─────────────────────────┐   │
│  │ Sessions: 12            │   │
│  │ Phones Caught: 47       │   │
│  │ Total Time: 6h 32m      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎯 START DETECTION     │   │
│  │     (Big CTA Button)    │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Ask your gym to install     │
│     Phone Lunk → phone-lunk.app │
│                                 │
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

**Elements**:
- App branding
- Stats dashboard (persistent, shows cumulative data)
- Big "Start Detection" button → navigates to Detect tab
- Bottom banner CTA to phone-lunk.app
- First-time users: Optional quick tutorial overlay

**Data to track**:
- Total sessions
- Total phones detected
- Total monitoring time
- Last session date

---

### Tab 2: Detect (Camera/Detection Interface)

**Purpose**: Live phone detection experience

**Layout (Before Detection Starts)**:
```
┌─────────────────────────────────┐
│  [< Back]        Detected: 0    │
├─────────────────────────────────┤
│                                 │
│     [Camera Preview Off]        │
│                                 │
│     Ready to catch some         │
│     phone lunks?                │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🔴 START DETECTION     │   │
│  └─────────────────────────┘   │
│                                 │
│  [Switch Camera] [Settings]     │
│                                 │
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

**Layout (During Detection)**:
```
┌─────────────────────────────────┐
│  [Settings ⚙️]      📱 Caught: 3│ ← Detection counter
├─────────────────────────────────┤
│                                 │
│    LIVE CAMERA FEED             │
│    (Full screen)                │
│                                 │
│    [Red bounding box when       │
│     phone detected]             │
│                                 │
│    [Alarm effect overlay        │
│     when triggered]             │
│                                 │
├─────────────────────────────────┤
│  ⏱ Session: 00:15:32            │ ← Stats bar
│  📱 3 caught  🔊 Sound: ON      │
├─────────────────────────────────┤
│  Sensitivity: [━━━●━━━━━━] 35% │ ← Sensitivity slider
├─────────────────────────────────┤
│  [🔴 STOP]  [📷]  [🔄 Camera]  │ ← Action buttons
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

**Essential Elements**:
- Live camera feed (full screen or near-full)
- Bounding boxes when phone detected (red rectangles)
- Detection counter (top right)
- Start/Stop button
- Session timer

**Optional Elements**:
- **Camera switch button** (front/rear on mobile) - REQUIRED
- **Detection sensitivity slider** (0-100%, default 35%) - REQUIRED
- Settings gear icon
- Screenshot/share button (captures the "caught" moment)
- Sound on/off toggle

**Behavior**:
- When phone detected → draw bounding box
- Trigger alarm effect (visual + optional sound)
- Increment counter
- 3-second cooldown between alarms (existing logic)

**Post-Session (Stop Detection)**:
```
┌─────────────────────────────────┐
│  Session Complete! 🎉           │
├─────────────────────────────────┤
│  You caught 3 phone lunks!      │
│  Duration: 15:32                │
│                                 │
│  [Screenshot preview if any]    │
│  └─ phone-lunk.app (watermark)  │
│                                 │
│  ┌─────────────────────────┐   │
│  │  📤 SHARE RESULTS       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🔄 START NEW SESSION   │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Imagine if your whole gym   │
│     had Phone Lunk installed!   │
│     → phone-lunk.app            │
│                                 │
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

**Screenshot Feature**:
- When user taps 📷 button during detection OR detection triggers
- Captures current camera frame with bounding box overlay
- Adds "phone-lunk.app" watermark in **bottom left corner**
- Stores temporarily for sharing
- Share button opens native share sheet with image

---

### Tab 3: Settings

**Purpose**: Configuration and preferences

**Layout**:
```
┌─────────────────────────────────┐
│  Settings                       │
├─────────────────────────────────┤
│                                 │
│  Detection Settings             │
│  ┌─────────────────────────┐   │
│  │ 🔊 Alarm Sound    [ON]  │   │
│  │ 🎚️ Sensitivity    [●○○]│   │
│  │ 📸 Auto-capture   [OFF] │   │
│  └─────────────────────────┘   │
│                                 │
│  App Preferences                │
│  ┌─────────────────────────┐   │
│  │ 🌙 Dark Mode      [ON]  │   │
│  │ 📊 Save Stats     [ON]  │   │
│  └─────────────────────────┘   │
│                                 │
│  About                          │
│  ┌─────────────────────────┐   │
│  │ ℹ️ About Phone Lunk     │   │
│  │ 🌐 Visit phone-lunk.app │   │
│  │ 🗑️ Clear All Data       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
  [🏠 Home] [📸 Detect] [⚙️ Settings]
```

**Settings Options**:

**Detection**:
- Alarm sound toggle
- Auto-capture screenshots when phone detected
- *(Note: Sensitivity slider moved to Detect screen for real-time adjustment)*

**App**:
- Dark/Light mode toggle
- Save stats toggle
- Vibration on detection (mobile only)

**About**:
- App version
- Link to phone-lunk.app
- Privacy policy (tongue-in-cheek)
- Clear all stats

---

## User Flows

### First-Time User Flow
1. App opens → Splash screen (Phone Lunk logo)
2. Camera permission request
3. Optional tutorial overlay (swipeable cards):
   - "Welcome to Phone Lunk"
   - "Point camera at phones"
   - "We'll catch them automatically"
   - "Let's get started!"
4. Land on Home tab with empty stats
5. User taps "Start Detection" → Navigate to Detect tab

### Returning User Flow
1. App opens → Home tab with stats
2. Tap "Start Detection" or navigate to Detect tab
3. Detection starts immediately (permissions already granted)

### Detection Session Flow
1. Detect tab → "Start Detection" button
2. Camera activates
3. Live detection runs
4. User points camera around gym
5. Phones detected → bounding boxes + alarm
6. Tap "Stop" → Session summary
7. Option to share or start new session

---

## Data Persistence

**LocalStorage/AsyncStorage**:
- Total sessions count
- Total phones detected
- Total time monitored
- Settings preferences
- Last session date

**Session Data (temporary)**:
- Current session start time
- Current session detection count
- Current session screenshots (optional)

---

## CTAs to Phone-Lunk.app

**Placement**:
1. Home tab: Bottom banner (persistent)
2. Post-session summary: Context-aware ("Imagine if your whole gym had this...")
3. Settings: "Visit phone-lunk.app"
4. Share screen: Subtle branding

**Messaging options**:
- "Ask your gym to install Phone Lunk"
- "Get Phone Lunk for your gym"
- "Upgrade your whole gym → phone-lunk.app"
- "Don't just stop yourself, stop everyone → phone-lunk.app"

---

## Technical Notes

**Components to Reuse**:
- `PhoneDetector.tsx` - Core detection logic (refactor for mobile UX)
- `AlarmEffect.tsx` - Visual alarm overlay
- `ThemeProvider.tsx` - Dark/light mode

**Components to Create**:
- `HomeScreen.tsx` - Welcome + stats dashboard
- `DetectScreen.tsx` - Camera interface wrapper
- `SettingsScreen.tsx` - Settings panel
- `TabNavigation.tsx` - Bottom tab bar
- `SessionSummary.tsx` - Post-detection summary
- `StatsCard.tsx` - Stats display component
- `PermissionRequest.tsx` - Camera permission UI
- `Tutorial.tsx` - First-time user tutorial

**State Management Needs**:
- Global stats (sessions, total detections, time)
- Settings preferences
- Current session state
- First-time user flag

---

## Design Principles

1. **Focus**: Camera/detection is the star. Everything else supports it.
2. **Speed**: Get to detection in 1-2 taps max.
3. **Fun**: Maintain the gag vibe. Celebrate caught phone lunks.
4. **Subtle conversion**: CTAs present but not pushy. It's a joke product anyway.
5. **Mobile-first**: Optimize for thumb reach, portrait orientation.

---

## Next Steps

1. Create wireframes/mockups for each screen
2. Refactor existing components for mobile UX
3. Build new screens (Home, Settings)
4. Implement tab navigation
5. Add stats persistence
6. Polish animations and interactions
7. Test on real devices
