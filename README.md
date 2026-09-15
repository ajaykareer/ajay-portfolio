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
- `app/layout.tsx`: page title and search metadata.
- `public/projects/`: recovered portrait and project screenshots.

Current role confirmed by Ajay: Software & Hardware Engineer, CreativePOS, June 1, 2024–present.

Historical content and assets recovered from ajaykareer.com and Ajay's public GitHub repositories. AKK Web Gallery and DavosBet are adaptations of Diego Arndt's projects; their detail views include attribution. CreativePOS responsibilities and customer outcomes have not been invented.

The contact action opens the visitor's email application. No contact messages are collected or stored by this site. Theme preference is the only persisted browser data. No analytics or tracking are installed.

Keep this folder backed up or push it to your own Git repository to retain the complete source.
