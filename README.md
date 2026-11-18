# Public Service Hub Nepal · सार्वजनिक सेवा हब नेपाल

Step-by-step guides to Nepal government services, in English and Nepali.

Getting a passport, national ID, police report, driving licence or land transfer done in Nepal usually means
jumping between confusing websites, and the rules change often. This site puts the essentials in one place:
**where to go, exactly which documents to bring, the official fee, and how long it takes.**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/winzepz/public-service-hub-nepal)

## Features

- **18 step-by-step guides** across identity, travel, vehicles, civil registration, tax, business and land, each with eligibility, office, document list, steps, fee table, processing time and tips.
- **Bilingual.** Every page is available in English (`/en/`) and Nepali (`/ne/`), including Devanagari numerals.
- **Instant search** that matches English, Nepali and romanised Nepali (`rahadani`, `namsari`, `lalpurja`…).
- **Document checklist generator.** Pick several tasks and get one list you can tick off, print, save as PDF or download as text.
- **Verified official portals.** Every link is on a `.gov.np` domain, with tips for spotting phishing clones.
- **3D map** of the 7 provinces and 77 districts, showing where the central offices are, with a full text alternative.
- **Accessible** to WCAG 2.2 AA: keyboard support, skip link, visible focus, screen reader labels, adjustable text size, high-contrast mode, reduced motion and Windows high contrast.
- **No tracking.** No cookies, accounts or analytics. Preferences stay in your browser.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) with static export: no server and no database
- TypeScript, plain CSS (no UI framework)
- [three.js](https://threejs.org/) for the 3D map, loaded only on the map page
- Content stored as JSON files in [`content/`](content/)

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run validate     # check all guides for missing translations, bad links, etc.
npm run build        # static site in ./out
npm run check-links  # confirm every official portal still responds
```

Requires Node.js 18.18 or newer.

## Deploy for free on Render

The repository includes a [`render.yaml`](render.yaml) blueprint for a **free static site** that never sleeps.

1. Click **Deploy to Render** above (or, in Render, choose **New → Blueprint** and select this repository or your fork).
2. Approve the blueprint. The site will be live at `https://<service-name>.onrender.com`.
3. On every push, Render runs `npm ci && npm run validate && npm run build` and publishes `./out`.

To deploy by hand instead, create a **Static Site** with build command `npm ci && npm run build` and publish
directory `out`. Set `NEXT_PUBLIC_SITE_URL` to your own domain so the sitemap uses it.

The `out/` folder is plain HTML, CSS and JS, so it also works on GitHub Pages, Netlify, Cloudflare Pages or any static host.

## Adding or correcting a guide

Each service is one file in [`content/services/`](content/services/). You can fix a fee or add a new service
without touching any code. See [CONTRIBUTING.md](CONTRIBUTING.md) for the format.

## Project structure

```
content/
  services/*.json      one guide per service (English + Nepali)
  portals.json         verified official .gov.np links
src/
  app/[lang]/          pages for /en and /ne
  components/          UI, search, checklist, 3D map
  data/                province boundaries and districts
  lib/                 translations, content loading, search
scripts/               content validator and link checker
```

## Disclaimer

This is an independent, community-maintained project. It is **not** affiliated with the Government of Nepal.
Fees and procedures change, especially at the start of each fiscal year, so always confirm on the official portal
before paying.

## Credits

- Province boundaries: [geoJSON-Nepal](https://github.com/mesaugat/geoJSON-Nepal) (MIT), simplified for the web.
- Typeface: [Mukta](https://fonts.google.com/specimen/Mukta) by Ek Type (SIL Open Font License).

## License

[MIT](LICENSE)
