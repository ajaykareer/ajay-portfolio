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
- `app/profile-background.tsx`: education, certifications, and earlier employment.
- `app/layout.tsx`: page title and search metadata.
- `public/projects/`: recovered portrait and project screenshots.

Current role confirmed by Ajay: Software & Hardware Engineer, CreativePOS, June 1, 2024–present.

Featured work includes Creative POS Reporting, Kareer’s Walls, Word Shuffle, and Windows Update Manager. The weather app appears last. Creative POS Reporting links to its public App Store listing; Kareer’s Walls has no public download link yet. iOS implementation frameworks are intentionally unspecified until confirmed by Ajay.

Historical content and assets were recovered from ajaykareer.com, Ajay's GitHub repositories, and his LinkedIn profile. The current portrait, education, certifications, and earlier roles were checked on LinkedIn. See `docs/content-sources.md` for provenance and remaining content updates. AKK Web Gallery and DavosBet are adaptations of Diego Arndt's projects; their detail views include attribution.

The contact action opens the visitor's email application. No contact messages are collected or stored by this site. Every fresh page load starts in light mode; the toggle changes theme for the current visit. No analytics or tracking are installed. Add the downloadable résumé when Ajay supplies the final file.

Keep this folder backed up or push it to your own Git repository to retain the complete source.
