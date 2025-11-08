# Tab Navigation Fix Plan

## Problem Statement

Tab navigation in the mobile app is rendering correctly but not responding to taps. The bottom tab bar shows "Home", "Detect", and "Settings" but clicking them doesn't navigate between pages.

**Symptoms**:
- Tab bar is visible and styled correctly
- Icons and labels display properly
- Taps/clicks have no effect (no navigation occurs)
- App stays on Home screen regardless of which tab is tapped

**Environment**:
- Next.js 15.5.6 (static export mode)
- Capacitor (iOS app wrapper)
- Client component using Next.js `<Link>` and `usePathname()`

---

## Root Cause Analysis

### Hypothesis 1: Next.js Link Component Issues in Static Export + Capacitor

**Problem**: Next.js `<Link>` component may not work correctly in Capacitor with static export mode because:
- Static export generates HTML files with limited client-side routing
- Capacitor uses `capacitor://localhost` protocol
- Link prefetching and navigation may be broken in this environment

**Evidence**:
- Tabs render but don't respond
- Similar issues reported with Next.js static export in Capacitor

**Solution**: Replace `<Link>` with button + `router.push()` or native anchor tags

---

### Hypothesis 2: CSS Pointer Events Blocked

**Problem**: CSS might be blocking pointer events on the Link elements

**Evidence**:
- Tab bar is at bottom of screen
- Could be z-index or pointer-events issue

**Solution**: Check and adjust CSS pointer-events and z-index

---

### Hypothesis 3: Tab Bar Position / Touch Target Issue

**Problem**: The tab bar might be positioned incorrectly or touch targets too small

**Evidence**:
- Taps not registering at all
- iOS simulator touch events might not be reaching elements

**Solution**: Increase touch targets, verify positioning

---

### Hypothesis 4: Static Export Routing Limitation

**Problem**: Next.js static export creates separate HTML files (`/mobile/home.html`, `/mobile/detect.html`) and client-side routing between them may not work as expected in Capacitor

**Evidence**:
- Static export mode limitations documented by Next.js
- Capacitor loads initial HTML file and may not handle SPA-style routing

**Solution**:
- Use full page reloads with `<a>` tags
- OR implement custom router using window.location
- OR use hash-based routing

---

## Investigation Steps

### Step 1: Check Current Implementation
- [x] Review `components/mobile/TabNavigation.tsx`
- [x] Identify: Using Next.js `<Link>` with `href` prop
- [x] Check if `usePathname()` is updating

### Step 2: Test Basic Navigation
- [ ] Add console.log to Link onClick
- [ ] Check if clicks are being registered
- [ ] Verify router is accessible

### Step 3: Review Build Output
- [ ] Check `out/` directory structure
- [ ] Verify HTML files exist for each route
- [ ] Check if Next.js router chunks are included

### Step 4: Test Alternative Approaches
- [ ] Try `router.push()` with button
- [ ] Try native `<a>` tag with href
- [ ] Try window.location.href

---

## Proposed Solutions (In Priority Order)

### Solution 1: Replace Link with Button + useRouter (RECOMMENDED)

**Approach**: Use buttons with onClick handlers that call `router.push()`

**Pros**:
- Full control over navigation
- Works reliably in static export + Capacitor
- Can add transition animations
- TypeScript type safety

**Cons**:
- Slightly more verbose
- No automatic prefetching (but not needed for local routes)

**Implementation**:
```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, CameraIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function TabNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 ...">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => handleTabClick('/mobile/home')}
          className="flex flex-col items-center justify-center flex-1 h-full"
        >
          <HomeIcon className="w-6 h-6" />
          <span>Home</span>
        </button>
        {/* ... other tabs */}
      </div>
    </nav>
  );
}
```

**Estimated Time**: 15 minutes

---

### Solution 2: Use Native Anchor Tags

**Approach**: Replace Next.js `<Link>` with native `<a>` tags

**Pros**:
- Simple, standard HTML
- Works everywhere
- Full page reload ensures clean state

**Cons**:
- Full page reload (slower)
- Lose React state between navigations
- No SPA-style transitions

**Implementation**:
```tsx
<a
  href="/mobile/home"
  className="flex flex-col items-center justify-center flex-1 h-full"
>
  <HomeIcon className="w-6 h-6" />
  <span>Home</span>
</a>
```

**Estimated Time**: 10 minutes

---

### Solution 3: Hash-Based Routing

**Approach**: Use hash-based URLs (#/home, #/detect) and custom router

**Pros**:
- Works in static export
- No page reloads
- SPA-style navigation

**Cons**:
- Requires custom routing logic
- URLs less clean
- More complex implementation

**Estimated Time**: 1-2 hours

**Not Recommended**: Too complex for this use case

---

### Solution 4: Hybrid Approach - Link with Custom Click Handler

**Approach**: Keep `<Link>` but add onClick handler with `router.push()`

**Pros**:
- Belt-and-suspenders approach
- May fix issue if Link is being blocked

**Cons**:
- Redundant code
- Doesn't address root cause

**Implementation**:
```tsx
<Link
  href={tab.href}
  onClick={(e) => {
    e.preventDefault();
    router.push(tab.href);
  }}
>
  {/* ... */}
</Link>
```

**Estimated Time**: 15 minutes

---

## Debugging Checklist

Before implementing solution:

- [ ] Add console.log to verify component renders
- [ ] Add console.log to verify pathname updates
- [ ] Check browser console for errors
- [ ] Test if router.push() works from browser console
- [ ] Verify CSS is not blocking pointer events
- [ ] Check z-index stacking context
- [ ] Verify touch targets are adequate size (min 44x44px iOS guideline)

---

## Implementation Plan

### Phase 1: Debug (15 minutes)
1. Add logging to TabNavigation component
2. Capture console logs from simulator
3. Identify exact failure point
4. Confirm hypothesis

### Phase 2: Implement Solution 1 (20 minutes)
1. Update `components/mobile/TabNavigation.tsx`
2. Replace `<Link>` with `<button>` + `onClick` handlers
3. Add proper accessibility attributes (role, aria-label)
4. Ensure keyboard navigation still works

### Phase 3: Test (15 minutes)
1. Rebuild app (`npm run build && npx cap sync ios`)
2. Launch in simulator
3. Test all tab transitions:
   - Home → Detect
   - Detect → Settings
   - Settings → Home
   - Verify active state updates
   - Verify navigation works in both directions

### Phase 4: Polish (10 minutes)
1. Add transition animations (optional)
2. Add haptic feedback (optional, iOS only)
3. Verify accessibility
4. Test on real device if available

**Total Estimated Time**: 1 hour

---

## Testing Checklist

After implementing fix:

- [ ] Home tab navigates to /mobile/home
- [ ] Detect tab navigates to /mobile/detect
- [ ] Settings tab navigates to /mobile/settings
- [ ] Active tab indicator updates correctly
- [ ] Navigation works in both directions
- [ ] Back button behavior (if applicable)
- [ ] State persistence across navigations
- [ ] No console errors
- [ ] Touch targets feel responsive
- [ ] Works on iOS simulator
- [ ] Works on real iOS device (if available)

---

## Rollback Plan

If solution doesn't work:

1. Revert changes to TabNavigation.tsx
2. Try Solution 2 (native anchor tags)
3. If anchor tags work, stick with them despite page reloads
4. Document limitation and move forward

---

## Success Criteria

✅ Tab navigation works reliably
✅ All three tabs accessible
✅ Active state updates correctly
✅ No console errors
✅ Smooth user experience
✅ Works on both simulator and device

---

## Next Steps After Fix

Once tab navigation is working:

1. Test navigation from Home "START DETECTION" button
2. Verify detect screen loads correctly
3. Test settings screen toggles
4. Confirm stats persist across tab changes
5. Move on to Sprint 2: PhoneDetector refactoring
