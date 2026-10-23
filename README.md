# 1 CLICK OS

A premium, responsive download portal for Microsoft Windows releases — from Windows XP to Windows 11. Built as a lightweight static site with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

## Features

- **Dark premium theme** — charcoal background with violet and electric-blue accents, clean cards, and subtle transitions.
- **Hero section** — "Your OS. Your Choice." headline with abstract visual and dual CTAs.
- **Organized downloads** — separate sections for Windows 11, 10, 8.1, 8, 7, Vista, and XP, each with edition cards.
- **Live search & filtering** — case/whitespace-insensitive search, OS filter chips, and an edition dropdown auto-populated per OS.
- **Clear filters** — one-click reset that refocuses the search field.
- **Empty state** — helpful message when no releases match.
- **Responsive navigation** — sticky header, desktop nav, navbar search shortcut, and a keyboard-accessible mobile hamburger menu.
- **Accessibility** — semantic landmarks, skip link, `aria` states, focus-visible rings, and reduced-motion support.
- **Transparent sourcing** — every download is labelled with its host and an "Unverified" status; no safety claims are made.

## Project structure

```
.
├── index.html   # Single-page markup (semantic, all content)
├── style.css    # Design system via CSS custom properties
├── script.js    # Search/filter logic + mobile menu + nav search
└── README.md
```

## Run locally

Because the site is pure static files, just open `index.html` in a browser, or serve it:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages → Build and deployment**.
3. Set **Source** to *Deploy from a branch*, **Branch** to `main`, and **Folder** to `/ (root)`.
4. Save. The site publishes to `https://<username>.github.io/<repo>/`.

No build command is required.

## Content & sourcing notes

- **Download URLs** are preserved exactly as provided by the site owner. They are shortened links to external hosts (Google Drive / MediaFire) and are **not verified** by this repository.
- **Support status** — only Windows 11 is shown as supported. Windows 10, 8.1, 8, 7, Vista, and XP are all out of support and flagged accordingly. Install them only for legacy/offline use.
- **"Latest" badges** indicate the newest release listed on the site for a given OS, not an external confirmation of current Microsoft releases.

## Development

- The design system lives in CSS custom properties at the top of `style.css` (colors, spacing, radii, shadows, transitions).
- Filtering logic is centralized in `script.js` — cards are matched on `data-search`, the OS section (`data-os`), and the derived edition label.
- To add a new release, duplicate an `.os-card` article, keep its exact download URL, and update `data-search`.

## Testing checklist

- Desktop / tablet / mobile layouts render without horizontal overflow.
- Search, OS chips, edition filter, and Clear filters behave correctly.
- Hamburger menu opens/closes and closes after selecting a link.
- Keyboard-only navigation reaches every control with visible focus.
- External links open in new tabs (`rel="noopener noreferrer"`).

## License & disclaimer

This is a personal/community project. All Windows trademarks belong to their respective owners. Downloaded ISOs should be treated as unverified; use at your own risk.
