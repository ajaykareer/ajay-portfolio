# Portfolio QA — September 17, 2026

Checked the static production build in a Chromium browser, with desktop and mobile viewport sizes. Also checked the local development site in Chrome. This is a functional and responsive-layout review, not a Lighthouse score or a guarantee of performance on every device.

## Changes

- Enlarged the Overview greeting from 12px to a responsive 16–19px.
- Replaced the JavaScript cursor overlay with native SVG cursors. Desktop cursor styling no longer depends on animation preferences or mouse-following frame callbacks; inputs retain their text cursor and the globe retains grab cursors.
- Removed the contact sentence naming the email provider. Delivery and validation are unchanged.
- Added responsive WebP portrait and project screenshots, preserving the originals for editing.
- Limited Tailwind generation to the app and its seven required UI primitives.
- Reduced the globe's maximum rendering pixel ratio and corrected its frame limiter; existing offscreen, hidden-tab, and reduced-motion pauses remain.
- Fixed Skip to content so it preserves the current page and focuses the main content.
- Fixed project dialog initial focus so long mobile dialogs open at their title instead of scrolling down to an action link.

## Measured asset reductions

| Assets | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Four largest displayed images, combined | 2,015,402 bytes | 120,330 bytes | 94% |
| Generated stylesheet, uncompressed | 222,941 bytes | 81,968 bytes | 63% |

Image totals compare the originals with the largest new WebP variants; smaller responsive variants are available for narrow screens. These measurements describe asset sizes, not total page transfer or a measured increase in frame rate. The cursor also no longer requires a mouse-following animation loop.

## Browser checks

- Overview, Projects, Experience, About, and Contact: navigation, one main heading, images, and layout checked at desktop and 390px mobile width. No horizontal page overflow found. Contact also checked at 320px.
- All seven project dialogs: matching content, labels, actions, closing behavior, and no horizontal dialog overflow. Creative POS Reporting additionally checked at mobile size after the initial-focus fix: title focused and scroll position zero.
- Filters: All projects 7, iOS apps 2, Systems 1, Salesforce 1, Web apps 3.
- All eight public project destination URLs returned HTTP 200 during the check. Third-party availability can change.
- Quick jump: searching for Windows returns the expected project, Enter opens it, and Escape closes the dialog and restores focus.
- Contact: submitting an empty form shows all three validation messages and focuses the name field. No live test email was sent during this review; earlier inbox delivery was confirmed by Ajay.
- Globe: rendered successfully; pause/play interaction and mobile layout checked.
- Theme: light mode on fresh page load, dark toggle, and mobile dark Contact layout checked.
- Motion preference: toggle, persistence after reload, and cursor availability with motion off checked. Page and card entrance states settle to visible content.
- Skip to content: keyboard activation focuses main content without changing the Contact route.
- No browser errors or warnings reported in the final production-preview check.

## Automated checks

- Production build: passed using Node 22.22.0; static routes generated successfully.
- TypeScript: `npx tsc --noEmit` passed.
- Application and new helper scripts: Oxlint passed.
- Contact tests: all four passed, covering validation, request fields, provider failures, and draft-preserving email fallback. Delivery requests were mocked.
- `git diff --check`: passed.

Optional local performance logging is available through `npm run preview -- --audit` at `http://localhost:4173/?audit=1`. These diagnostics are not shipped or transmitted. Automated browser frame timings were not reliable enough to report an FPS result.
