# Development notes

## Contact delivery

The contact form uses EmailJS. Configure your own service, template, and browser public key in `lib/contact.ts` before reusing this portfolio for another person. The receiving inbox belongs in the provider's template settings.

The template expects `name`, `email`, `message`, `title`, `date`, and `time`. Set **To Email** to your fixed inbox and **Reply To** to `{{email}}`. If you configure an origin allowlist, include the local development origin and your deployed domain.

Only browser identifiers belong in client code. Never add an EmailJS private key, an email password, or another private credential. Local `.env` files are excluded by `.gitignore`.

[`emailjs-template.html`](emailjs-template.html) contains an optional portfolio-branded email body with matching fields. The form validates input, prevents duplicate submissions while a request is pending, includes a honeypot, and confirms success only after a positive provider response. Provider-side controls are needed for spam protection.

The site does not store messages or include analytics. The direct-email fallback preserves a visitor's draft. The recipient and the public fallback email are separate configuration choices.

## Images

Original images remain in `public/projects` for editing. The portrait and larger project screenshots are served as responsive WebP variants. Regenerate them with the pinned Sharp development dependency:

```bash
node scripts/optimize-images.mjs
```

Use descriptive alt text and appropriate image dimensions when adding new screenshots. Content and asset credits are recorded in [`content-sources.md`](content-sources.md).

## Styles and motion

Tailwind scans the app and seven UI primitives used by it. If you import another primitive, add its source to `app/globals.css`.

Motion handles page entry/exit and one-time viewport reveals using opacity and transforms. Scrolling remains native. Motion preferences are saved per origin and default to the device's reduced-motion setting. The SVG cursor works independently of this preference on supported desktop browsers.

The Contact globe loads separately, pauses when hidden or offscreen, and respects motion preferences. The form remains usable if WebGL is unavailable.

## Local diagnostics

```bash
npm run preview -- --audit
```

Open `http://localhost:4173/?audit=1` for local console samples. This diagnostic code is not part of the hosted site and sends no data. Browser automation can distort frame timings; these samples are not a performance score.

## Deployment

`npm run build` produces the static website in `dist/client`. `npm run preview` serves that output locally. `.openai/hosting.json` identifies this portfolio's existing Sites deployment. GitHub stores the source; a Git push does not publish the website by itself.

If you fork the project, configure your own hosting destination before publishing.
