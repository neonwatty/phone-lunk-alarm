# Phone Lunk Social Media Strategy

## Executive Summary

**Goal:** Maximize organic traffic to phone-lunk.app through mystery-focused video content
**Constraints:** DIY production, zero following, keep the gag a surprise
**Timeline:** Phased rollout across Reddit, LinkedIn, and Twitter

---

## I. Understanding the Product

### The Gag Structure
1. **Setup:** Presents as serious AI phone detection system for gyms
2. **Hook:** Aggressive, Planet Fitness-inspired marketing tone
3. **Demo:** Actually works (TensorFlow.js + COCO-SSD) - builds credibility
4. **Reveal:** Waitlist page exposes it's fake with "Wow you're an easy mark!"
5. **Pivot:** Redirects to YTgify (the real product)

### Why It Can Go Viral
- **Relatable problem:** Everyone hates phone lurkers at gym
- **Working demo:** Technical credibility makes the reveal earned, not cheap
- **Controversial tone:** "Fuck Your Phone" gets attention
- **Participatory:** Users can try the detector themselves
- **Shareable:** The reveal moment creates "you have to see this" energy

---

## II. Current State Analysis

### Existing Social Sharing Setup
**Location:** `site.config.mjs`

**Current OG Image Issues:**
- Text-heavy design that spoils everything upfront
- Shows "PHONE LUNK" + "Fuck Your Phone" immediately
- No mystery or intrigue
- Static image doesn't convey the working demo

**What's Working:**
- Proper OG/Twitter card meta tags in place
- 1200x630px standard sizing
- Twitter handle configured (@neonwatty)

**What's Missing:**
- Video preview support
- Action shots that create curiosity
- Platform-specific optimizations
- Any content that teases without revealing

---

## III. Video Content Strategy

### Primary Asset: 20-Second Teaser Video

**Purpose:** Stop scrollers, create curiosity, drive clicks WITHOUT spoiling the gag

#### Shot-by-Shot Breakdown

**Shot 1: The Hook (0-3 seconds)**
- Screen recording of the gym GIF from homepage
- Red flashing "PHONE LUNK DETECTED" overlay appears
- Alarm sound effect
- **Caption:** "🚨 PHONE DETECTED 🚨"

**Shot 2: The Problem (3-8 seconds)**
- Show 2-3 quick cuts of phone detection in action
- Bounding boxes appearing around phones
- Visual alarm state (red borders, warning text)
- **Caption:** "AI detects phones at the gym"

**Shot 3: The Demo (8-15 seconds)**
- Screen recording of live webcam detection
- Show it catching your phone in real-time
- Maybe show it NOT detecting when phone is away
- **Caption:** "Real-time detection. Try it yourself."

**Shot 4: The CTA (15-20 seconds)**
- Text overlay on screen
- **Caption:** "Try the detector ➜ phone-lunk.app"
- Keep it simple, clear, compelling

#### Production Specs (DIY)

**Tools (All Free):**
- **Recording:** QuickTime (Mac built-in) or OBS Studio
- **Editing:** CapCut (free, mobile or desktop) OR DaVinci Resolve (free)
- **Captions:** CapCut auto-captions OR Kapwing (free tier)
- **Sound:** Free alarm sound from freesound.org or YouTube Audio Library

**Export Formats:**
1. **Square (1:1)** - 1080x1080px - LinkedIn primary
2. **Vertical (9:16)** - 1080x1920px - Twitter/Stories
3. **Horizontal (16:9)** - 1920x1080px - YouTube/backup

**Technical Requirements:**
- MP4 format, H.264 codec
- Maximum file size: <100MB (LinkedIn limit)
- Frame rate: 30fps minimum
- Audio: Include but design for silent viewing
- Captions: Burned-in (not just subtitles)

#### Pro Tips for DIY Video
1. **Lighting matters:** Record demo in well-lit room
2. **Cursor visibility:** Make cursor easy to follow in screen recordings
3. **Speed up boring parts:** 1.5x speed for navigation, real-time for payoffs
4. **Text size:** Captions should be readable on mobile (huge fonts)
5. **First frame:** Make thumbnail frame high-contrast and clear
6. **Audio levels:** Alarm sound should be loud but not distorting

---

## IV. New OG Image Strategy

### Replace Current Image

**Current Problem:**
The existing OG image (`/public/images/og-image.jpg`) is generated programmatically and shows:
- Full branding "PHONE LUNK"
- Text "Fuck Your Phone"
- Purple/yellow gradient
- Alarm icon

**Why This Fails:**
- Gives away too much
- No mystery
- Looks like an ad, not intriguing content
- Doesn't show the working demo

### New OG Image Concept

**Option A: Action Shot (Recommended)**
- Screenshot of the phone detector in alarm state
- Red flashing borders
- Bounding box around detected phone
- "PHONE DETECTED" text
- Minimal branding
- **Feeling:** "What is this??" curiosity

**Option B: Before/After Split**
- Left side: Person on phone at gym (annoyed people waiting)
- Right side: Alarm state detection
- Arrow between them
- Text: "AI Phone Detector"
- **Feeling:** Problem/solution intrigue

**Option C: Meme Format**
- Top text: "POV: You're hogging the bench"
- Screenshot of detection alarm going off
- Bottom text: "The AI knows"
- **Feeling:** Relatable gym frustration

**Recommendation:** Option A - Clean action shot with minimal context

**File to Update:** `/scripts/generate-images.mjs`

---

## V. Platform-Specific Strategies

### Reddit (HIGHEST PRIORITY)

**Why Reddit First:**
- Best organic reach with zero following
- High-intent audience (actively browsing, not passive scrolling)
- Niche communities love "I built this" projects
- Click-through rates higher than other platforms
- Less algorithm suppression of external links

**Target Subreddits:**

**Tier 1 (Post immediately):**
- **r/InternetIsBeautiful** (17M members) - "Interesting web content"
  - Title: "AI-powered phone detector for gyms [Working Demo]"
  - Type: Link post directly to phone-lunk.app
  - Best day: Tuesday-Thursday
  - Best time: 9-11 AM EST

- **r/SideProject** (490K members) - "Show off side projects"
  - Title: "Built a gym 'lunk alarm' for phone users (with working AI demo)"
  - Type: Text post with embedded video + link
  - Tone: Builder sharing their work
  - Best day: Monday/Tuesday
  - Best time: 8-10 AM EST

**Tier 2 (After Tier 1 proves out):**
- **r/webdev** (2M members) - Focus on technical implementation
- **r/fitness** (10M members) - Lead with relatable gym problem
- **r/artificialintelligence** (800K members) - Technical angle
- **r/GymMemes** (300K members) - Humor angle

**Reddit Post Formula:**

```
Title: [Action] + [Result] + [Proof]
Example: "Built an AI lunk alarm for phone users at the gym [Working Demo]"

Body (for text posts):
1. Hook (1-2 sentences): Relatable problem statement
2. Solution (2-3 sentences): What you built and how it works
3. Demo link: Direct link to try it
4. Tech stack (optional): Brief technical details
5. Call to action: "Try it yourself and let me know if it catches your phone"

DO NOT:
- Oversell it
- Use marketing language
- Reveal the gag/redirect
- Mention YTgify
- Sound like an ad
```

**Example Reddit Post (r/InternetIsBeautiful):**

```
Title: AI-powered phone detector for gyms [Working Demo]

We've all seen people hogging equipment while scrolling TikTok.
I built an AI-powered "lunk alarm" for phones that detects when
someone is using their phone in real-time (inspired by Planet Fitness).

The demo works in your browser using your webcam - try holding up
your phone and watch it trigger the alarm.

Try it: phone-lunk.app

Built with TensorFlow.js and COCO-SSD object detection. All
processing happens client-side for privacy.

Let me know if you can get past the detector!
```

**Reddit Engagement Strategy:**
- **Reply to every comment in first 2 hours** (boosts post ranking)
- Answer technical questions (builds credibility)
- Don't defend too hard (Reddit hates overselling)
- Let users discover the gag organically
- If someone spoils it in comments, play along with humor

**Reddit Timing:**
- Post Tuesday-Thursday for max engagement
- 8-11 AM EST (catches US morning + Europe afternoon)
- Avoid Friday-Sunday (lower engagement)
- Never post same content to multiple subs same day (looks like spam)

---

### LinkedIn (Professional Virality)

**Why LinkedIn:**
- Controversy drives engagement ("is this too far?")
- Tech professionals appreciate clever implementations
- B2B audience more forgiving of satire
- Video content performs exceptionally well
- Good for building personal brand

**LinkedIn Strategy: "Provocative Question" Approach**

**Post Structure:**

```
Hook (First line - shows in feed):
"Built an AI system that publicly shames people for using
phones at the gym. Too far? 🚨"

Body (2-3 short paragraphs):
We've all been frustrated by the person scrolling Instagram
on the leg press machine for 20 minutes.

So I built a "lunk alarm" for phones - real-time AI detection
using TensorFlow.js. When it spots a phone, it triggers an
alarm and puts them on blast.

Working demo here: phone-lunk.app

[Square video embedded]

What do you think - solution to a real problem or gym dystopia?

#AI #MachineLearning #Fitness #BuildInPublic
```

**LinkedIn Video Specs:**
- **Format:** Square (1:1) - 1080x1080px
- **Length:** 30 seconds max
- **Captions:** REQUIRED (burned in) - 73% watch on mute
- **Hook:** First 2 seconds must stop scrolling
- **CTA:** Text overlay at end with URL

**LinkedIn Best Practices:**
- Post Monday or Wednesday, 8-9 AM EST
- Keep copy under 150 words (truncation limit ~210 chars in feed)
- Ask a question to drive comments
- Use 2-3 hashtags max (not spammy)
- Reply to all comments within first hour
- Native video upload (not YouTube link)

**LinkedIn Engagement Tactics:**
- Tag relevant people in comments (gym owners, tech founders)
- Share to relevant groups (AI developers, fitness tech)
- Repost with new angle after 1 week if it bombs
- Use LinkedIn polls in follow-up posts

---

### Twitter/X (Quick Wins, Lower Priority)

**Why Twitter (Lower Priority):**
- Harder to go viral with zero following in 2025
- Algorithm heavily favors verified accounts
- Links get suppressed in algorithm
- BUT: Still good for tech/meme crossover audience
- Fast feedback loop

**Twitter Strategy: Thread Format**

**Tweet 1 (Hook):**
```
Built an AI that detects people using phones at the gym and
puts them on blast 🚨

Like a lunk alarm, but for phone lunks

Try it: phone-lunk.app

[15-second vertical video]
```

**Tweet 2 (Technical details):**
```
Uses TensorFlow.js + COCO-SSD for real-time phone detection

Runs entirely in your browser (no server uploads)

~10 FPS detection rate

Inspired by @PlanetFitness lunk alarm but way more annoying
```

**Tweet 3 (CTA):**
```
Try the demo yourself and let me know if it catches your phone

Works best if you pretend you're texting on the leg press machine
```

**Twitter Video Specs:**
- **Format:** Vertical (9:16) or Square (1:1)
- **Length:** 15-30 seconds (shorter is better)
- **Captions:** Optional but helps
- **Quality:** Can be rougher/more raw than LinkedIn

**Twitter Best Practices:**
- Post during US hours: 12-3 PM EST
- Use 2-3 relevant hashtags: #AI #BuildInPublic #Fitness
- Tag relevant accounts: @PlanetFitness (risky but could work)
- Pin the thread to your profile
- QRT (quote retweet) any replies that get traction

**Twitter Engagement Tactics:**
- Reply to everyone who tries it
- Share funny user reactions
- Create follow-up content from best comments
- Post thread on weekday (M-Th best)

---

## VI. Content Rollout Timeline

### Week 1: Launch & Test

**Monday:**
- Finalize video content (shoot, edit, export)
- Create new OG image
- Update site.config.mjs with new OG image
- Test social sharing on all platforms (use Twitter card validator)

**Tuesday Morning:**
- Reddit: Post to r/SideProject (8-9 AM EST)
- Monitor comments, reply actively
- Track analytics: traffic spike, time on site

**Wednesday Morning:**
- LinkedIn: Post with provocative question (8-9 AM EST)
- Share to relevant LinkedIn groups
- Engage with all comments

**Thursday:**
- Analyze Reddit/LinkedIn performance
- Twitter: Post thread (12-2 PM EST)
- Reddit: If r/SideProject went well, post to r/InternetIsBeautiful

**Friday:**
- Review analytics: traffic sources, conversion rates
- Document what worked / what didn't

### Week 2: Amplification

**Based on Week 1 performance:**

**If Reddit went well:**
- Post to Tier 2 subreddits (r/webdev, r/fitness)
- Space out posts (1 per day max)
- Vary the title and angle

**If LinkedIn went well:**
- Reshare with new commentary
- Post follow-up: "Update: X people tried the detector"
- Create engagement post: "Should this be real?" poll

**If Twitter went well:**
- Thread about the tech stack
- Share user reactions
- Post video clips of funny detection moments

### Week 3: Content Recycling

**Repurpose top content:**
- Create "behind the scenes" content
- Technical blog post about implementation
- User reaction compilation
- Post to Product Hunt (frame as "satirical AI project")

---

## VII. Technical Implementation Checklist

### High Priority (Do Before Launch)

**1. New OG Image**
- [ ] Create action shot screenshot of detector in alarm state
- [ ] Save as `/public/images/og-image.jpg` (replace existing)
- [ ] Dimensions: 1200x630px
- [ ] File size: <500KB
- [ ] Test: Use Twitter Card Validator & LinkedIn Post Inspector

**2. Video Assets**
- [ ] Record 20-second teaser video
- [ ] Export square version (1080x1080)
- [ ] Export vertical version (1080x1920)
- [ ] Add burned-in captions
- [ ] Save to `/public/videos/` for easy reference

**3. Platform Testing**
- [ ] Share phone-lunk.app on Twitter - verify preview
- [ ] Share on LinkedIn - verify preview
- [ ] Share on Reddit - verify link works
- [ ] Test on mobile (most traffic will be mobile)

### Optional Enhancements

**1. Add og:video Tags**
Update `site.config.mjs`:
```javascript
'og:video': 'https://phone-lunk.app/videos/teaser.mp4',
'og:video:width': '1080',
'og:video:height': '1080',
'og:video:type': 'video/mp4',
```

**2. Add UTM Parameters**
Track which platform drives most traffic:
- LinkedIn: `?utm_source=linkedin&utm_medium=social`
- Reddit: `?utm_source=reddit&utm_medium=social`
- Twitter: `?utm_source=twitter&utm_medium=social`

**3. Add Analytics Events**
Track key user actions:
- Demo page view
- Webcam permission granted
- Phone detected
- Waitlist page reached
- YTgify link clicked

---

## VIII. Measuring Success

### Primary Metrics (Check Daily)

**Traffic:**
- Unique visitors to phone-lunk.app
- Traffic sources (Reddit vs LinkedIn vs Twitter)
- Pages per session (indicates engagement)
- Time on site (should be 30s+ if trying demo)

**Engagement:**
- Demo usage rate (visitors who grant webcam access)
- Waitlist page views (indicates they got to reveal)
- Social shares (track with social share buttons)

**Conversion:**
- Click-through to YTgify
- Chrome Web Store visits (if trackable)

### Secondary Metrics (Check Weekly)

**Social Engagement:**
- Reddit: Upvotes, comments, cross-posts
- LinkedIn: Reactions, comments, shares
- Twitter: Likes, retweets, replies

**Qualitative Feedback:**
- Comments mentioning "this is funny"
- People sharing with friends
- Screenshots shared on other platforms
- Feature requests (people wanting it to be real)

### Success Benchmarks

**Conservative Win:**
- 1,000 unique visitors in first week
- 50+ engaged comments across platforms
- 10% conversion to waitlist page

**Solid Win:**
- 5,000 unique visitors in first week
- 200+ engaged comments
- Top 10 post in at least one subreddit
- 25% conversion to waitlist page

**Viral Win:**
- 20,000+ unique visitors in first week
- Featured on tech news sites
- 100+ upvotes on r/InternetIsBeautiful
- Organic mentions on other platforms

---

## IX. Risk Mitigation

### Potential Backlash Scenarios

**"This is clickbait!"**
- **Prevention:** The demo actually works, so it's not false advertising
- **Response:** "Demo is fully functional - try it yourself. The reveal is the cherry on top."

**"This is just marketing for YTgify"**
- **Prevention:** Don't mention YTgify in social posts
- **Response:** "Yeah, the redirect is a bit cheeky - but the tech demo is legit and was fun to build"

**"Using people's webcams is creepy"**
- **Prevention:** Emphasize privacy (client-side processing) in posts
- **Response:** "All processing happens in your browser - nothing is uploaded. You can check the code."

**Reddit "Self-Promotion" Removal**
- **Prevention:** Follow 10:1 rule (engage genuinely on Reddit before posting)
- **Response:** Frame as "I built this and want feedback" not "Check out my product"

### Reddit-Specific Risks

**Shadowban/Removal:**
- Don't post to more than 2 subreddits per day
- Don't use the exact same title across subreddits
- Engage authentically in comments
- Have account history of genuine participation

**"OP is a shill" Accusations:**
- Be transparent about being the creator
- Accept criticism gracefully
- Don't argue with every negative comment
- Let community defend you if demo is good

### Platform Restrictions

**LinkedIn:**
- Avoid excessive hashtags (2-3 max)
- Don't repost same content too frequently
- Native video performs better than links

**Twitter:**
- Links get suppressed - use tweet thread format
- Don't spam mentions of big accounts
- Space out tweets in thread (not all at once)

**Reddit:**
- Read and follow subreddit rules carefully
- Respect "no self-promotion" rules
- Participate in comments before posting

---

## X. Content Variations & A/B Testing

### Title Variations (Test These)

**For Reddit:**
- A: "Built an AI lunk alarm for phone users at the gym [Demo]"
- B: "AI-powered phone detector for gyms [Working Demo]"
- C: "Made a Planet Fitness-style alarm for people on phones at the gym"

**For LinkedIn:**
- A: "Built an AI that shames people for using phones at the gym. Too far?"
- B: "What if gyms had lunk alarms... but for phones? (I built a working demo)"
- C: "Solved the most annoying gym problem with AI"

**For Twitter:**
- A: "Built an AI that detects gym phone lurkers 🚨"
- B: "POV: You're texting on the leg press and the AI knows"
- C: "Lunk alarm for phones at the gym (working demo)"

### Video Hook Variations

**Opening Frame Options:**
- A: Gym equipment with someone obviously on phone
- B: Red alarm state (most attention-grabbing)
- C: Bounding box appearing around phone (shows tech)

**Test which gets highest completion rate**

---

## XI. Post-Launch Content Ideas

### If It Goes Well

**Follow-Up Content:**
1. **"The tech behind Phone Lunk"** - Technical deep dive
2. **"What I learned launching a viral gag"** - Meta commentary
3. **"People want this to be real"** - Share funny user reactions
4. **"Should we actually build this?"** - Gauge real interest
5. **User reaction compilation video** - Show people trying it

### If It Flops

**Pivot Content:**
1. **"What I learned from a failed launch"** - Honest retrospective
2. **"The working demo is actually pretty cool"** - Focus on tech
3. **"Making of Phone Lunk"** - Behind the scenes
4. **Post to smaller niche communities** - Try different angles

---

## XII. Key Success Factors

### Do This:
✅ Lead with the working demo (technical credibility)
✅ Keep the gag a surprise (information gap marketing)
✅ Reply to every comment in first 2 hours (algorithm boost)
✅ Design for silent viewing (captions required)
✅ Test on mobile before launching (most traffic)
✅ Track which platform drives most traffic (double down on winner)
✅ Have fun with it (authenticity shows)

### Don't Do This:
❌ Spoil the punchline in social posts
❌ Over-market YTgify in initial posts
❌ Post to too many subreddits at once (looks like spam)
❌ Argue with negative comments (makes it worse)
❌ Use clickbait that the demo can't deliver on
❌ Forget captions (85% watch on mute)
❌ Give up after one platform (different audiences respond differently)

---

## XIII. Quick Start Checklist

**This Week:**
- [ ] Record and edit 20-second teaser video
- [ ] Create new OG image (action shot)
- [ ] Update site.config.mjs with new OG image
- [ ] Test social sharing previews
- [ ] Write Reddit post variations
- [ ] Write LinkedIn post
- [ ] Write Twitter thread

**Launch Day (Tuesday):**
- [ ] Post to r/SideProject at 8-9 AM EST
- [ ] Monitor and reply to all comments
- [ ] Watch analytics dashboard

**Day 2 (Wednesday):**
- [ ] Post to LinkedIn at 8-9 AM EST
- [ ] Engage with all comments and reactions
- [ ] Share in relevant LinkedIn groups

**Day 3 (Thursday):**
- [ ] Analyze early performance
- [ ] Post Twitter thread at 12-2 PM EST
- [ ] If Reddit went well, post to r/InternetIsBeautiful

**End of Week:**
- [ ] Review analytics
- [ ] Document lessons learned
- [ ] Plan Week 2 based on results

---

## XIV. Resources & Tools

### Free Video Tools
- **Recording:** QuickTime (Mac), OBS Studio (cross-platform)
- **Editing:** CapCut (mobile/desktop), DaVinci Resolve (desktop)
- **Captions:** CapCut auto-captions, Kapwing free tier
- **Sound Effects:** freesound.org, YouTube Audio Library
- **Compression:** HandBrake (reduce file size)

### Testing Tools
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** Share in draft post to preview
- **OG Tag Checker:** https://www.opengraph.xyz/
- **Reddit Preview:** Create draft post to see preview

### Analytics Tools
- **Google Analytics:** Track traffic sources
- **Plausible/Fathom:** Privacy-friendly alternative
- **UTM Builder:** https://ga-dev-tools.google/campaign-url-builder/

### Content Inspiration
- **Successful "Show HN" posts:** news.ycombinator.com/show
- **Top r/InternetIsBeautiful:** See what formatting works
- **Viral LinkedIn posts:** Study hooks and formatting

---

## XV. Final Thoughts

### The Core Strategy

**Mystery > Explanation**

Don't tell them what it is - make them click to find out. The working demo builds credibility that makes the reveal land better. People will appreciate the joke more if they've invested 30 seconds trying the detector first.

**Organic > Paid**

With zero following, paid promotion won't help much. Focus on nailing organic reach in niche communities where your ideal audience already hangs out. One successful Reddit post can drive more traffic than $1000 in ads.

**Authentic > Polished**

You're not a company - you're a builder sharing something fun you made. Lean into the DIY aesthetic. Screen recordings and honest "I built this" energy will resonate more than over-produced marketing.

**Platform-Specific > One-Size-Fits-All**

Reddit wants humble builders. LinkedIn wants provocative questions. Twitter wants quick hits. Tailor your message to each platform's culture.

### The Real Win

If this gets even modest traction (5,000 visitors), you'll have:
1. A portfolio piece showing you can build AND market
2. Social proof (testimonials, comments, engagement)
3. A case study ("How I got X visitors with zero budget")
4. Confidence to launch future projects

The traffic is nice. The learning is invaluable.

### Go Build

The strategy is outlined. The tools are free. The content is strong.

Now go record that video and hit post. Tuesday morning, 9 AM EST, r/SideProject.

You got this. 🚀

---

**Document Version:** 1.0
**Last Updated:** 2025-11-04
**Owner:** @neonwatty
**Project:** Phone Lunk (phone-lunk.app)