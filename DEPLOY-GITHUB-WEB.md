# Deploy InstaSpace via GitHub web upload (no command line)

Repo: `instaspace72-design/webapp-beta-osman`
Result URL: `https://instaspace72-design.github.io/webapp-beta-osman/`

---

## Step 0 — Unzip the download
Unzip `instaspace-platform.zip`. Open the folder. You should see `index.html`, `InstaSpace Platform.html`, the `.css`/`.js` files, an `assets` folder, and a `docs` folder.

> You will upload **what is inside** this folder, not the folder itself.

---

## Step 1 — Open the upload screen
1. Go to `https://github.com/instaspace72-design/webapp-beta-osman`
2. Click **Add file** (top right) → **Upload files**.
   (If the repo is empty, there's also an **“uploading an existing file”** link on the page — same thing.)

---

## Step 2 — Drag the files in
1. Select **everything inside** the unzipped folder — all the `.html`, `.css`, `.js` files **plus** the `assets` and `docs` folders.
2. Drag them onto the upload area. GitHub keeps the folder structure (`assets/…`, `docs/…`).

> **Hidden files:** your OS may hide `.nojekyll`. It's optional for this method — skip it if you can't see it.
> **The `.github` folder is optional too** — we'll use the simpler "branch" deploy below, so you do **not** need it for the web-upload route.

---

## Step 3 — Commit
1. Scroll down to **Commit changes**.
2. Message: `InstaSpace platform — beta`.
3. Keep **“Commit directly to the `main` branch”** selected.
4. Click **Commit changes**. Wait for the files to finish uploading.

---

## Step 4 — Turn on GitHub Pages
1. In the repo, go to **Settings** (top tab) → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. **Branch:** `main`  ·  **Folder:** `/ (root)`  → click **Save**.

---

## Step 5 — Open your site
- Wait about 1 minute. Refresh the **Settings → Pages** screen; it shows **“Your site is live at …”**.
- Open: `https://instaspace72-design.github.io/webapp-beta-osman/`
- `index.html` automatically forwards to the hub.

---

## If something looks off
- **404 or blank:** give it 1–2 minutes after the first deploy, then hard-refresh (Ctrl/Cmd + Shift + R).
- **Styles missing:** make sure the `.css`/`.js` files are at the **root** of the repo (same level as `index.html`), not inside an extra `instaspace-platform/` subfolder. If they landed in a subfolder, open that folder on GitHub and re-upload at root, or set Pages folder accordingly.
- **Logo missing:** confirm the `assets/icon_cream.png` path exists in the repo.

---

## Updating later
Repo → open the file → pencil (Edit) → commit. Or **Add file → Upload files** to replace several at once. Pages redeploys automatically within a minute.

---

## Going further (optional)
- **Custom domain:** Settings → Pages → Custom domain.
- **Auto-deploy workflow:** if you later push via git, the included `.github/workflows/deploy-pages.yml` deploys on every push (switch Pages Source to **GitHub Actions**).
- **Payments backend:** PayFast live mode needs a small server — see `docs/PAYFAST_INTEGRATION.md`.
