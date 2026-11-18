# Contributing

Thank you for helping keep these guides accurate. Fees and procedures in Nepal change often, so corrections from
people who have recently been through a process are the most valuable contribution.

## Reporting an error

Open an issue with:

- the page (for example `/en/services/passport-renewal/`)
- what is wrong and what it should say
- a source: an official notice, a `.gov.np` page, or "I did this at the X office on <date>"

## Editing a guide

Each guide is one JSON file in `content/services/`. Every text field has an English (`en`) and a Nepali (`ne`) version:

```json
{
  "slug": "passport-renewal",
  "category": "travel",
  "icon": "passport",
  "popular": true,
  "lastReviewed": "2026-11",
  "title": { "en": "Passport renewal", "ne": "राहदानी नवीकरण" },
  "summary": { "en": "…", "ne": "…" },
  "authority": { "en": "…", "ne": "…" },
  "keywords": ["passport", "rahadani", "राहदानी"],
  "eligibility": [{ "en": "…", "ne": "…" }],
  "where": [{ "en": "…", "ne": "…" }],
  "documents": [{ "en": "…", "ne": "…" }],
  "steps": [{ "en": "…", "ne": "…" }],
  "fees": [{ "label": { "en": "…", "ne": "…" }, "amount": { "en": "Rs 5,000", "ne": "रु. ५,०००" } }],
  "time": { "en": "…", "ne": "…" },
  "portals": ["dop-apply", "dop"],
  "tips": [{ "en": "…", "ne": "…" }]
}
```

| Field | Notes |
| --- | --- |
| `slug` | Must match the file name. Used in the URL. |
| `category` | One of `identity`, `travel`, `transport`, `civil`, `tax-business`, `land-property`. |
| `icon` | One of `passport`, `id-card`, `citizenship`, `police`, `licence`, `car`, `bluebook`, `birth`, `marriage`, `family`, `ballot`, `work-abroad`, `graduation`, `pan`, `company`, `land`. |
| `lastReviewed` | `YYYY-MM`. Update it whenever you verify the guide. |
| `keywords` | Extra search terms, including romanised Nepali spellings people actually type. |
| `documents` | One item per physical document. These become the checklist. |
| `portals` | Ids from `content/portals.json`. |

### Writing style

- Use short sentences and plain words. Many readers are reading in their second language.
- Write Nepali numbers in Devanagari (`रु. ५,०००`).
- If a fee varies by province or is not published, say so ("Set by each province") instead of guessing.
- Only link to official `.gov.np` domains.

### Before opening a pull request

```bash
npm run validate   # catches missing translations, unknown portals and bad fields
npm run build
```

## Adding a portal

Add an entry to `content/portals.json`. The validator rejects any URL that is not `https://*.gov.np`.
Run `npm run check-links` to confirm it responds.

## Code changes

Keep the design flat and minimal, and keep everything keyboard-accessible. Test new UI with only a keyboard and with
200% browser zoom.
