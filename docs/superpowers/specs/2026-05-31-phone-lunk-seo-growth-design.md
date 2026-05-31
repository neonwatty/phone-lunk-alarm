# Phone Lunk SEO Growth Design

**Date:** 2026-05-31
**Status:** Approved for planning

## Goal

Spiff up Phone Lunk and optimize it for organic traffic by positioning it as a playful AI phone detection demo for gyms, with a credible B2B lead path for gym owners.

## Product Positioning

Phone Lunk should read as a funny, memorable prototype with a real product thesis: gyms lose member goodwill when equipment is occupied by people scrolling between sets, and a browser-based AI demo can show what automated phone detection might look like.

The site should avoid pretending the full enterprise product exists today. It should be explicit about what is real now:

- A browser-based AI demo that detects phones locally.
- A shareable, funny concept for gym etiquette enforcement.
- A pilot-worthy idea for gym owners: kiosk display, moderation, privacy controls, and gym branding.

The tone should stay sharp and playful, but the claims should be trustworthy. Humor can carry the brand, but search pages and conversion pages should make the value proposition legible to gym owners, staff, and curious gym members.

## Audience

The primary SEO and conversion audience is gym owners, operators, and staff who care about member experience, equipment throughput, and gym etiquette.

The secondary audience is gym members and fitness creators who understand the joke instantly and can spread the demo through social sharing.

This means the site should be B2B-facing with a viral demo wrapper: serious enough for a gym owner to understand the pilot concept, weird enough that a gym member wants to send it to a friend.

## Organic Search Strategy

The project should target a small content cluster around gym phone use, gym etiquette, equipment hogging, and lunk alarm-style novelty tools.

Priority search intents:

- "gym phone detection"
- "AI phone detector demo"
- "lunk alarm app"
- "gym phone policy"
- "phone use at gym"
- "gym equipment hogging"
- "gym etiquette phone use"
- "how to stop people hogging gym equipment"

The homepage should target the broad product concept. The demo page should target AI phone detection. Supporting pages should answer practical questions and internally link back to the demo and gym-owner pilot flow.

## Site Architecture

### Homepage

The homepage should become the primary product page. It should explain:

- What Phone Lunk is.
- Why phone use on equipment frustrates members.
- How the AI demo works.
- What happens locally in the browser.
- How the future gym kiosk/pilot concept would work.
- How a gym owner can express interest.

The current hero can keep the "Put Phone Lunks On Blast" attitude, but nearby copy should include plain-language search terms such as "AI phone detection demo for gyms" and "gym equipment hogging."

### Demo Page

`/demo` should become a standalone search landing page for the interactive detector.

It needs:

- A unique title and meta description.
- A visible H1.
- Intro copy explaining the browser-only camera processing.
- Clear expectations about model limitations.
- Internal links back to the homepage, privacy content, and gym-owner pilot page.

### Pilot / Waitlist Page

The current `/waitlist` page should stop undercutting the product with "OK, this isn't real" as the lead message.

It should become a gym-owner pilot interest page. It can still acknowledge that the current product is a prototype, but the page should frame the next step as:

- Kiosk scoreboard concept.
- Gym TV display.
- Anonymous member participation through QR code.
- Owner moderation and controls.
- Privacy-first aggregate detection events.

The page should collect or direct interest from gym owners without overpromising availability.

### Trust And Privacy Page

Add a dedicated privacy/trust page that explains:

- The demo processes camera frames in the browser.
- No camera feed is uploaded by the demo.
- A future kiosk product should transmit detection events, not images or video.
- Moderation and face/privacy protections would be required for real gyms.

This page is important because the product touches cameras, gyms, public screens, and social pressure.

### Search Content Pages

Start with a focused set of evergreen pages:

- `/gym-phone-policy`: a practical guide and sample policy for phone use on gym equipment.
- `/gym-equipment-hogging`: an explanation of equipment hogging, member frustration, and ways gyms can reduce it.
- `/lunk-alarm-app`: a playful branded page for people searching for lunk alarm-related tools.
- `/gym-tv-kiosk`: a concept page for the Phone Lunk Protected kiosk and scoreboard.

These pages should not be generic blog filler. Each one should answer a specific question, include useful examples, and link naturally to the demo.

## Technical SEO

Implement the following technical fixes:

- Standardize canonical URLs on the live canonical domain.
- Align sitemap and robots output with the canonical domain.
- Add route-specific metadata for all public pages.
- Add canonical links through Next metadata alternates.
- Add Open Graph and Twitter metadata per major page.
- Add JSON-LD on the homepage for `WebSite`, `SoftwareApplication`, and publisher/creator data.
- Avoid duplicate or irrelevant structured data on About.
- Ensure each indexable page has one clear H1.
- Update README and package metadata so the repository no longer describes itself as a generic landing page template.
- Fix broken image references on About or remove those sections until assets exist.

## Claims And Brand Safety

Replace or soften risky claims:

- "No false positives" should become a more honest limitation statement.
- "Planet Fitness Approved™" should be removed unless there is real permission.
- "Corporate-tested" and similar proof claims should be removed unless evidence exists.
- "Enterprise" should be used carefully while the product is a prototype.

Keep the brand voice, but separate jokes from factual claims. The visitor should never have to guess what is real.

## Product-Led Organic Loop

The kiosk and embeddable badge concept should become the growth wedge.

The long-term loop:

1. A gym owner finds a helpful page about phone policy or equipment hogging.
2. They try the detector demo.
3. They see the kiosk / "Phone Lunk Protected" concept.
4. They join the pilot interest list.
5. The future badge or kiosk creates visible, linkable proof on gym websites and social posts.

The first implementation pass should create the content and concept pages. The actual backend-backed kiosk/badge implementation belongs in a separate product phase with its own design and implementation plan.

## Analytics And Measurement

Track:

- Demo start clicks.
- Camera permission success/failure.
- Recording/share actions.
- Pilot interest clicks.
- Internal link clicks from SEO pages to `/demo`.
- Outbound social/profile clicks.

Set up or verify Google Search Console for the canonical domain, submit the sitemap, and monitor impressions/clicks for the priority query cluster.

## Success Criteria

The first SEO pass is successful when:

- Every public route has unique metadata and a canonical URL.
- The sitemap and robots file point to the canonical domain.
- The homepage clearly communicates the product concept and demo reality.
- `/demo` stands alone as an AI phone detector demo landing page.
- `/waitlist` or its replacement works as a credible gym-owner pilot page.
- At least two helpful supporting search pages are live.
- Structured data is present, valid, and relevant.
- The site builds cleanly.
- The tone remains funny without making unverifiable claims.

## Non-Goals

This pass will not build the full kiosk backend, real-time rooms, authenticated admin dashboard, billing, or a full blog system.

This pass will not publish a large volume of low-depth SEO content. The intent is to build a small number of useful, durable pages that support the demo and pilot funnel.
