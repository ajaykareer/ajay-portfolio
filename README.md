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
```

The static website is written to `dist/client` and can also be hosted by any static website host. On Windows with Node 24 installed, the verified build command is:

```sh
npx --yes --package=node@22.22.0 node node_modules/vinext/dist/cli.js build
```

## Edit your portfolio

- `app/portfolio.tsx`: project data, contact details, biography, experience, and interactions.
- `app/globals.css`: colors, typography, layout, animations, and responsive styles.
- `app/premium.css`: refined buttons, app artwork, profile layout, and cursor styling.
- `app/premium-cursor.tsx`: desktop cursor with native fallbacks for touch and reduced motion.
- `app/page-motion.tsx` and `app/motion.css`: scroll-triggered entrances, staggered cards, pointer-responsive depth, subtle portrait movement, and a page scroll indicator. Native browser animation APIs keep this independent of extra animation libraries.
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

Content starts visible before JavaScript. An IntersectionObserver progressively enhances each view with one-time entrances; newly filtered project cards are observed too. Entrances stop on keyboard focus, when reduced motion is requested, and before printing. Pointer tilt and portrait depth apply only to fine-pointer devices without reduced motion. Scrolling stays native. Observers, animation frames, and event listeners are cleaned up when changing views.

Keep this folder backed up or push it to your own Git repository to retain the complete source.
