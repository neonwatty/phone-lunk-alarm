# Move to phone-lunk.neonwatty.com

Cut over October 18, 2026 with user approval. PR #26 merged as
`69da64452d6a681044d5bfa7cd7792261c8e3ea9`. Vercel production, DNS/HTTPS,
the existing GA stream URL, and legacy-host redirects now use the new domain.

## Existing services to retain

- Vercel project: `phone-lunk-alarm` in `jermwatts-projects`.
- Google Analytics account `337965956`, property **Phone Lunk** `520041561`.
- Web stream **Phone Lunk Web**, stream `13301482795`, measurement ID
  `G-PM737NZX2R`. Its current URL is `https://phone-lunk.neonwatty.com`; the Analytics
  dashboard reports active collection in the past 48 hours.
- Google Tag Manager: `GTM-MKS2GNDH`.
- Existing Vercel Analytics and Speed Insights integrations and funnel events.
- Contact email and form recipient remain `hello@phone-lunk.app`; this website
  move does not provision a new mailbox. Keep the old domain's email DNS.

Retain the existing project, GA property/stream, and measurement ID rather than
creating replacements. Historical analytics stay in their existing services.
Cloudflare's zone-level traffic history stays with the old zone; future
requests to the subdomain are counted under the neonwatty.com zone. Browser
preferences/cookies on phone-lunk.app do not transfer to neonwatty.com.

## Prepared configuration

The new subdomain is attached to the existing Vercel project. This Cloudflare
record is saved in the neonwatty.com zone (TTL Auto); authoritative DNS and
1.1.1.1 return the exact target, and Vercel reports configured-correctly:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | phone-lunk | 6629076320876e32.vercel-dns-017.com | DNS only |

Verify with `npx vercel domains verify phone-lunk.neonwatty.com`. The blog's
apex, www, nameservers, and email DNS were not changed. Vercel certificate
`cert_CPpZGqPc5pHxHJnjpBHdhmVE` has automatic renewal enabled; public HTTPS
passes normal certificate validation.

Application canonical/structured-data URLs, sitemap/robots, sharing links,
form return URL, and recording/image watermarks now target the subdomain.
Vercel host-specific redirects are prepared for both legacy hosts, preserving
paths. Both legacy domains additionally have Vercel project-domain redirects
to `phone-lunk.neonwatty.com` with status 308. These were necessary because
production host-rule checks initially still served pages from the old www host.

## Cutover order

1. The user chose migration alongside the approved PR. Do not merge PR #26
   or promote its deployment without authorization. Prepare DNS/HTTPS before
   publishing the release that enables the legacy-host redirects.
2. Add the Cloudflare record, verify Vercel DNS and HTTPS, and confirm the new
   host serves the intended production deployment.
3. Release the new canonical URL configuration at the approved time. Preserve
   `NEXT_PUBLIC_GA_ID=G-PM737NZX2R` in the Vercel environment and retain GTM.
4. In the existing GA stream, edit Website URL to
   `https://phone-lunk.neonwatty.com`. Keep its stream and measurement IDs.
   Review Google tag domain/internal-traffic settings and GTM hostname
   conditions before saving any needed changes.
5. Inspect pageviews and a real detector/CTA event in GA Realtime/DebugView;
   verify requests use the existing measurement ID and the new page hostname.
   Check Vercel Analytics/Speed Insights on the same project. A preserved tag
   ID alone is not proof of ingestion.
6. Enable/verify redirects from `phone-lunk.app` and `www.phone-lunk.app` after
   the new site's HTTPS works. Check `/`, `/demo/`, a guide, and query strings.
   The current Vercel apex-to-www domain redirect may need updating to avoid
   an extra hop; verify the final destination regardless.
7. Verify new-host canonical tags, sitemap, robots, form return URL, recording
   watermark, model assets, and alarm assets. Update Search Console separately
   if the old domain is registered there.

GitHub Pages is also enabled on this repository and currently names the old
domain, although live traffic points to Vercel. The workflow and CNAME file are
prepared for the new canonical host; do not change public DNS to GitHub Pages.
Reconcile this secondary deployment during cutover so it does not become a
second competing source of production assets.

## Rollback

Keep the old hosts attached to Vercel and retain their DNS during transition.
If the new host fails validation, revert/promote the previous production
deployment and remove the migration's legacy-host redirects before directing
visitors back. Do not delete the existing GA property, stream, or Vercel project.

## Validation so far

- 101 Jest tests, TypeScript, and ESLint pass after canonical URL updates.
- The local detector responds at http://phone-lunk.localhost:3107/demo/.
- Production GA ID and existing stream ID were independently checked against
  deployment configuration and the Analytics dashboard.
- Production deployment `dpl_Fb71RAhHWwk2A75nbN1Uacjm4ytQ` is Ready and
  matches the merge SHA. Browser review confirms the Athletic Signal landing
  and detector model loading reaches Start Camera. Physical iPhone testing is deferred.
- GA stream Website URL saved as `https://phone-lunk.neonwatty.com`; stream
  `13301482795` and measurement `G-PM737NZX2R` retained. Realtime received a
  page view and actual Launch detector `cta_click`; its `page_location` was
  `https://phone-lunk.neonwatty.com/?utm_source=cutover_qa&utm_medium=verification&utm_campaign=domain_migration_20261018`.
- Eight public redirect checks cover both legacy hosts at `/`, `/demo/`,
  `/gym-phone-policy/`, and `/demo/?source=cutover-check&test=1`: each returns
  308 directly to the same path/query on the new host, then 200, without loops.
- Vercel Web Analytics dashboard shows Enable, so collection is not enabled
  there despite bundled integration scripts. GA collection is verified; no
  paid analytics feature was enabled as part of cutover.
- The post-deployment checker had stale old-host and purple-theme expectations.
  These are updated to the configured canonical host and Athletic Signal cobalt.
