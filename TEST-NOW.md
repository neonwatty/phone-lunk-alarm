# ⚡ QUICK START: Test Phase 2A NOW

**Time**: 20-30 minutes
**Goal**: Does react-webcam work with Capacitor?

---

## 🚀 START HERE

### 1. Connect iPhone ⏱️ 30 seconds
```
✓ Plug in USB cable
✓ Unlock iPhone
✓ Trust computer
```

### 2. Open Xcode ⏱️ 1 minute
```bash
npx cap open ios
```

### 3. Select Device ⏱️ 30 seconds
```
Top toolbar → Device dropdown → Select your iPhone
```

### 4. Configure Signing ⏱️ 1 minute
```
Left sidebar: App → Signing & Capabilities
✓ Check "Automatically manage signing"
→ Select your Apple ID in Team dropdown
```

### 5. Build & Deploy ⏱️ 2 minutes
```
Click ▶️ Play button (or Cmd+R)
Wait for build...
```

**First time?**
- Settings → General → VPN & Device Management → Trust

---

## ✅ TEST CHECKLIST (15 minutes)

On your iPhone, test these 7 things:

### 5.1 App Launches [ ]
- App opens without crash
- "Start Camera" button visible

### 5.2 Permissions [ ]
- Tap "Start Camera"
- Dialog asks for camera & microphone
- Tap "Allow"

### 5.3 Camera Feed [ ] ⚠️ MOST CRITICAL
- **Camera feed shows (NOT black screen)**
- Live video displays
- "MONITORING" indicator visible

**⚠️ BLACK SCREEN = FAIL (need refactor)**

### 5.4 Model Loads [ ]
- Wait 2-5 seconds
- Status shows "All Clear"

### 5.5 Camera Switches [ ] ⚠️ IMPORTANT
- Tap switch button (top right)
- **Switches without crash or black screen**
- Front camera is mirrored

**⚠️ CRASH ON SWITCH = FAIL (need refactor)**

### 5.6 Detection [ ]
- Point at phone
- Red box appears
- Alarm triggers

### 5.7 Stop Camera [ ]
- Tap "Stop Camera"
- Feed stops
- Light turns off

---

## 📊 DECISION

### ✅ ALL 7 PASS?
**KEEP react-webcam**
- Save 6-8 hours! 🎉
- Skip Phase 2B
- Proceed to Phase 3

### ❌ TEST 5.3 OR 5.5 FAIL?
**REFACTOR NEEDED**
- Execute Phase 2B (6-8 hours)
- Replace react-webcam

---

## 🆘 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| iPhone not in dropdown | Unlock, trust, replug |
| Code signing error | Add Apple ID in signing |
| "Untrusted Developer" | Settings → Trust certificate |
| Black screen after permissions | ❌ CRITICAL - Document this! |

---

## 📝 DOCUMENT RESULTS

```
Device: _______________
iOS: _______________

Results:
[ ] 5.1 Launch
[ ] 5.2 Permissions
[ ] 5.3 Camera Feed ← Critical
[ ] 5.4 Model Load
[ ] 5.5 Switching ← Critical
[ ] 5.6 Detection
[ ] 5.7 Stop

Decision:
[ ] ✅ Keep react-webcam
[ ] ❌ Need refactor
```

---

## 🔧 COMMANDS

```bash
# Open project
npx cap open ios

# Rebuild if needed
npm run build && npx cap sync ios

# Full guide
open plans/PHASE-2A-TESTING-CHECKLIST.md
```

---

**🎯 Most Important Tests**:
1. Test 5.3: Camera feed (NOT black screen)
2. Test 5.5: Camera switching (no crash)

If both pass → You're golden! ✅
If either fails → Need refactor ❌

**GO TEST NOW!** 🚀
