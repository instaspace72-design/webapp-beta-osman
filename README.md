# InstaSpace Platform

Instant booking and settlement for verified residential, commercial, and industrial spaces. One linked platform: a marketing hub that launches four surfaces (Guest, Host, Property Manager, Admin & Ops) over a shared trust layer (InstaPass, GovShield, AI-Yield, Wallet & Settlement, Disputes, AI-Auditor).

This repository is a **static, zero-build site** (vanilla HTML/CSS/JS). It runs by opening a file; no bundler, server, or install step is required for the front end. A small backend is required only for live PayFast payments (see below).

---

## Run locally

Any static file server works. From this folder:

```bash
# Python
python3 -m http.server 8080
# or Node
npx serve .
```

Then open `http://localhost:8080/` (redirects to the hub). Opening `index.html` directly via `file://` also works, but a local server is recommended so relative paths and `localStorage` behave like production.

---

## Deploy to GitHub Pages (for testing)

1. Create a new GitHub repo and push the **contents of this folder** to the `main` branch (this folder is the repo root).
2. In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. The included workflow (`.github/workflows/deploy-pages.yml`) publishes the site on every push to `main`.
4. Your test URL will be `https://<user>.github.io/<repo>/`.

Notes
- `.nojekyll` is included so folders and files are served verbatim.
- `index.html` redirects to `InstaSpace Platform.html` (the hub).
- File names contain spaces; GitHub Pages serves them URL-encoded, and all internal links already match.

---

## File structure

```
index.html                  → redirect to the hub (GitHub Pages entry)
InstaSpace Platform.html     → the hub / front door
platform.css, platform-prefs.js   → hub styles + shared preferences & i18n engine

InstaSpace Web App.html      → Guest + Host marketplace
  webapp.css, wa-ui.js, wa-data.js, wa-app.js,
  wa-views-core.js, wa-views-browse.js, wa-views-host.js
  payfast.js                 → PayFast (Pakistan) payment integration

PM Portal.html               → Property Manager portal
  pm-portal.css, pm-data.js, pm-app.js, pm-views.js, pm-views2.js

InstaSpace Admin.html        → Admin & Ops console
  admin.css, admin-data.js, admin.js

assets/icon_cream.png        → brand mark
docs/                        → integration & architecture notes
```

`platform-prefs.js` is shared by every surface. It persists language (8 languages, incl. Arabic & Urdu with RTL), currency (8), theme (light/dark), and density to `localStorage` under `instaspace-prefs` and syncs across tabs. Deep-link a role with `InstaSpace Web App.html?role=guest` or `?role=host`.

---

## Architecture

Each surface is an independent single-page app with its own in-memory router and a mock data store (`localStorage`). They are **not** a single bundle — the hub links to them as separate pages, and shared preferences flow through `localStorage`. See `docs/ARCHITECTURE.md`.

Because the apps are self-contained vanilla JS, a developer recreating this in a framework (React/Vue/etc.) should treat the HTML as the **design + behavior reference** and re-implement views/state in the target stack, reusing the design tokens in `webapp.css`/`platform.css`.

---

## Payments — PayFast (Pakistan)

`payfast.js` integrates the PayFast (payfast.pk) hosted checkout for PKR settlement. It ships with:
- a **working sandbox simulation** so the prototype completes a payment with no backend, and
- the **production code path** (token fetch via your server, then a signed form POST to PayFast), guarded by `PayFast.CONFIG.mode`.

Going live requires a small backend to hold the `SECURED_KEY` and mint access tokens. Full server contract, endpoints, signature, and return/ITN handling are in **`docs/PAYFAST_INTEGRATION.md`**.

It is wired into the Guest **booking** flow ("Pay with PayFast") and **wallet top-up** ("Top up with PayFast"). The displayed amount is converted to PKR for the gateway.

---

## Status

Beta. Mock data and simulated AI/settlement flows for testing. No real funds move until a payment backend is connected.
