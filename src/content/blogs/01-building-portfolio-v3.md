---
title: "Building Portfolio v3"
description: "A quick tour of the stack (Vite, React, Tailwind) and how the site is structured."
date: "2025-12-10"
---

## What this project uses

- Vite for fast dev/builds
- React for UI
- Tailwind for styling

## Folder map (high level)

- `src/pages` for routes
- `src/components` for UI pieces
- `src/content/blogs` for markdown posts

## A small snippet

```ts
const posts = import.meta.glob("../content/blogs/*.md", { eager: true })
```

