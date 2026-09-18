# Ajay Kareer — Portfolio

Interactive React + TypeScript portfolio. Built with Vinext/Vite, with accessible Base UI and shadcn controls. The portfolio is a single page with hash navigation, so the browser Back button and direct links to sections work.

## Run locally

Use Node.js 22 LTS (tested with 22.22.0). Node 24.11.1 can hit a Windows process-shutdown error after a successful Vinext build.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The static website is written to `dist/client` and can also be hosted by any static website host. The production preview runs at `http://localhost:4173`. On Windows with Node 24 installed, the verified build command is:

```sh
npx --yes --package=node@22.22.0 node node_modules/vinext/dist/cli.js build
```

## Edit your portfolio

- `app/portfolio.tsx`: project data, contact details, biography, experience, and interactions.
- `app/globals.css`: colors, typography, layout, animations, and responsive styles.
- `app/premium.css`: refined buttons, app artwork, profile layout, and cursor styling.
- `public/cursor.svg`, `public/cursor-link.svg`, and `app/premium.css`: browser-native custom cursors, with standard text, drag, and disabled states. They work independently of Motion preferences and need no mouse-move JavaScript.
- `app/page-motion.tsx` and `app/motion.css`: Motion-powered page transitions, staggered scroll entrances, a persistent motion preference, and a native CSS scroll progress indicator.
- `app/profile-background.tsx`: education, certifications, and earlier employment.
- `app/contact-page.tsx` and `app/contact.css`: dedicated Contact view, form feedback, and responsive layout.
- `app/contact-orbit.tsx`: lazy-loaded COBE globe, moving starfield, drag/keyboard controls, and reduced-motion handling.
- `lib/contact.ts`: EmailJS browser connection, validation, timeout, and direct-email fallback.
- `app/layout.tsx`: page title and search metadata.
- `public/projects/`: recovered portrait and project screenshots.

Current role confirmed by Ajay: Software & Hardware Engineer, CreativePOS, June 1, 2024–present.

Featured work includes Creative POS Reporting, Kareer’s Walls, Word Shuffle, and Windows Update Manager. The weather app appears last. Creative POS Reporting links to its public App Store listing; Kareer’s Walls has no public download link yet. iOS implementation frameworks are intentionally unspecified until confirmed by Ajay.

Historical content and assets were recovered from ajaykareer.com, Ajay's GitHub repositories, and his LinkedIn profile. The current portrait, education, certifications, and earlier roles were checked on LinkedIn. See `docs/content-sources.md` for provenance and remaining content updates. AKK Web Gallery and DavosBet are adaptations of Diego Arndt's projects; their detail views include attribution.

The Contact page sends name, email, and message through Ajay's EmailJS Contact Us template. The supplied template's receiving inbox is `kareer07@gmail.com`; its connected sending account is separate. The service ID, template ID, and browser public key supplied by Ajay are in `lib/contact.ts`; no private email credentials are included. The static site does not store submissions. The existing public email link (`ajaykareer06@gmail.com`) remains available and carries the draft into the visitor's email application if delivery fails. Every fresh page load starts in light mode; the toggle changes theme for the current visit. No analytics or tracking are installed. Add the downloadable résumé when Ajay supplies the final file.

## Contact delivery

The EmailJS account must have an active email service and template. If it uses an origin allowlist, include `https://ajay-kareer-portfolio.goli15.chatgpt.site`, `https://ajaykareer.com`, and the local development origin as needed. The supplied Contact Us template uses `name`, `email`, `message`, `title`, `date`, and `time`. Configure To Email as the chosen fixed inbox and Reply To as `{{email}}`. Browser identifiers are designed to be public; never add an EmailJS private key to this client file. `docs/emailjs-template.html` is an optional portfolio-branded email body to replace the existing template's “The Sarcastic Tales” branding without changing its fields.

The form validates fields, blocks accidental duplicate submissions, includes a honeypot, and waits for EmailJS's positive response before showing success. These browser checks do not replace provider-side spam controls. Ajay confirmed successful inbox delivery with a received test message on September 17, 2026. Implementation checks use mocked requests and send no messages. Run the contact checks with `node --experimental-strip-types --test tests/contact.test.mjs` on Node 22.22.0 or newer.

The animated globe and stars run only in the Contact view, pause when hidden/offscreen, and stop automatically for reduced-motion preferences. WebGL is optional: the form remains available if the globe cannot render.

## Motion behavior

Motion (the `motion` package) handles page exit/entry and one-time viewport reveals. Pages fade out before the next view mounts; cards rise in with a short stagger. Only opacity and transforms animate. Scroll stays native, with no JavaScript scroll handler, portrait parallax, animated blur, or pointer-driven card lighting. The progress line uses CSS scroll timelines where supported. Print and no-JavaScript styles keep content visible.

The Motion switch beside the theme button follows the device’s reduced-motion preference by default. Visitors can explicitly enable or reduce motion for this site; their choice is saved locally per origin. The same preference controls entrances, the globe, and stars. The static custom cursor remains available on desktop even with motion reduced. Keyboard focus reveals interactive items immediately. Navigation moves focus to the new heading after its page entrance finishes.

Portrait and large project screenshots use responsive WebP variants; originals remain available for editing. Regenerate variants with `node scripts/optimize-images.mjs`, which uses the pinned Sharp development dependency. Tailwind scans the app and the seven UI primitives it uses; when adding a new UI primitive, add its source to `app/globals.css`.

See `docs/qa-report.md` for the website checks and measured asset reductions. For local diagnostics only, `npm run preview -- --audit` enables console performance samples at `http://localhost:4173/?audit=1`; it sends no data and is not part of the hosted build. Browser automation can distort frame timings, so these samples are not a performance score.

Keep this folder backed up or push it to your own Git repository to retain the complete source.
