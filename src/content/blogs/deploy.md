---
title: "Vite + React + GitHub Pages: The Clean Way"
description: "Skip the npm packages. Use GitHub Actions for clean, automatic deployments."
date: "2025-12-21"
image: "/blog/deploy.jpg"
---

# Introduction

GitHub Pages is a free hosting service that lets you publish static websites directly from a GitHub repository. In this guide, we'll set up automatic deployment for a Vite React app using GitHub Actions.

# Step 1: Configure Vite Base Path

When deploying to GitHub Pages at `https://username.github.io/repo-name/`, you need to set the base path in your Vite config.

Open `vite.config.ts` and add the `base` property:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

Replace `your-repo-name` with your actual repository name.

> **Note:** If you're using a custom domain (e.g., `example.com`), set `base: '/'` instead.

# Step 2: Configure React Router (If Using)

If your app uses React Router with `BrowserRouter`, you need to set the `basename` prop to match your base path.

In your `main.tsx` or wherever you configure the router:

```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/your-repo-name">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

# Step 3: Create GitHub Actions Workflow

Create a new file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - id: deployment
        uses: actions/deploy-pages@v4
```

This workflow:

1. Triggers on every push to `main`
2. Sets up Node.js and installs dependencies
3. Builds your app
4. Uploads the `dist` folder to GitHub Pages
5. Deploys the site

# Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**

![GitHub Pages Settings](/blog/github_pages_settings.png)

# Step 5: Push and Deploy

Commit your changes and push to the `main` branch:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

GitHub Actions will automatically build and deploy your site. You can monitor the progress in the **Actions** tab of your repository.

Once the workflow completes, your site will be live at:

```
https://username.github.io/repo-name/
```