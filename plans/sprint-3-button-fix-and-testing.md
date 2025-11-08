# Sprint 3: Button Fix & Detection Testing

## Overview
Fix the button click issue preventing users from starting detection sessions, then perform end-to-end testing of the camera and detection functionality.

## Problem Analysis

### Current Issue
The START DETECTION button in DetectScreen doesn't respond to taps in iOS Simulator.

### Working vs Non-Working
**Working**: TabNavigation buttons
```typescript
<button
  onClick={() => handleTabClick(tab)}
  className="... touch-manipulation cursor-pointer"
>
```

**Not Working**: START DETECTION button
```typescript
<button
  onClick={() => { ... handleStart(); }}
  className="... active:scale-95"
>
```

### Potential Causes
1. **Missing touch CSS**: TabNavigation has `touch-manipulation` class
2. **Z-index issues**: Button might be covered by another element
3. **Parent container**: `min-h-screen` might be interfering
4. **Button size**: May need larger touch target
5. **Capacitor-specific**: WebView may need special handling

## Implementation Plan

### Phase 1: Quick Fixes (Try All)
1. Add `touch-manipulation` class to button
2. Add `cursor-pointer` class
3. Increase touch target size (already 4px padding, add more?)
4. Remove `active:scale-95` (might interfere)
5. Add explicit `type="button"` attribute
6. Test with `onTouchStart` instead of `onClick`

### Phase 2: Alternative Approaches
If quick fixes don't work:
1. Use Capacitor Haptics API for button feedback
2. Implement custom touch event handlers
3. Restructure button as a clickable div
4. Add debug overlay to visualize tap zones

### Phase 3: End-to-End Testing
Once buttons work:
1. Test START DETECTION flow
2. Verify camera permission prompt
3. Test camera feed display
4. Test phone detection (use second device or photo)
5. Verify alarm triggers
6. Test STOP DETECTION
7. Verify stats save correctly

## Implementation Tasks

### Task 1: Apply Quick Fixes
Update DetectScreen button with all fixes at once:

```typescript
<button
  type="button"
  onTouchStart={(e) => {
    e.preventDefault();
    console.log('[DetectScreen] Touch start detected');
  }}
  onClick={() => {
    console.log('[DetectScreen] Button clicked - calling handleStart');
    handleStart();
  }}
  className="w-full max-w-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg touch-manipulation cursor-pointer"
>
  🔴 START DETECTION
</button>
```

Also apply same fixes to:
- Switch Camera button
- STOP DETECTION button (in active state)

### Task 2: Test in Simulator
1. Build and deploy
2. Navigate to Detect screen
3. Tap START DETECTION
4. Check logs for touch/click events
5. Verify session starts

### Task 3: Camera Permission Flow
Once button works:
1. First tap should trigger camera permission
2. Grant permission
3. Camera feed should appear
4. Model should start detecting

### Task 4: Detection Testing
**Simulator Limitations**: iOS Simulator doesn't have a real camera
- Webcam feed will show black or error
- Can't test actual phone detection
- Need physical device for full test

**What We CAN Test**:
- Button click works ✓
- Session starts ✓
- Timer increments ✓
- UI updates correctly ✓
- Stop button works ✓
- Stats save ✓

**What Needs Physical Device**:
- Camera permissions
- Live camera feed
- Actual phone detection
- Alarm on detection

### Task 5: Add Visual Polish
Once core functionality works:
1. Loading state animations
2. Better error messages
3. Haptic feedback on buttons (Capacitor Haptics)
4. Smooth transitions between states
5. Session summary modal after stop

## Success Criteria

### Must Have ✅
- [ ] START DETECTION button responds to taps
- [ ] Session starts when button tapped
- [ ] Session timer increments
- [ ] STOP DETECTION button works
- [ ] Stats save after session ends
- [ ] No console errors

### Nice to Have 🎯
- [ ] Haptic feedback on button taps
- [ ] Smooth state transitions
- [ ] Session summary after stop
- [ ] Better loading animations

### Physical Device Only 📱
- [ ] Camera permission prompt
- [ ] Camera feed displays
- [ ] Phone detection works
- [ ] Alarm triggers correctly
- [ ] Screenshot capture

## Debugging Strategy

If buttons still don't work after Task 1:

### Debug Step 1: Check Event Propagation
Add click handler to parent container:
```typescript
<div
  onClick={() => console.log('[Parent] Click detected')}
  className="flex flex-col items-center justify-center min-h-screen p-6"
>
```

### Debug Step 2: Visual Debug Overlay
Add visible tap zones:
```typescript
<div className="fixed inset-0 pointer-events-none z-50">
  <div className="absolute bg-red-500 opacity-20"
       style={{ top: 480, left: 100, width: 200, height: 60 }}>
    Button Zone
  </div>
</div>
```

### Debug Step 3: Try Different Event
```typescript
<div
  onMouseDown={() => console.log('Mouse down')}
  onTouchStart={() => console.log('Touch start')}
  onPointerDown={() => console.log('Pointer down')}
  onClick={() => console.log('Click')}
>
```

## Timeline

- Task 1 (Quick Fixes): 15 minutes
- Task 2 (Testing): 10 minutes
- Task 3-4 (Detection Flow): 20 minutes
- Task 5 (Polish): 30 minutes

**Total**: ~75 minutes

## Files to Modify

```
components/mobile/DetectScreen.tsx  - Add button fixes
components/mobile/MobileCamera.tsx  - May need button fix for Switch Camera
```

## Next Steps After Sprint 3

If all works in simulator:
- Test on physical device
- Fine-tune detection sensitivity
- Add screenshot capture (Sprint 4)
- Add sharing functionality (Sprint 4)
- Prepare for production deployment
