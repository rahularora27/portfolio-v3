---
title: "Deploying to GitHub Pages"
description: "Notes on base paths, router basenames, and what to watch for when deploying."
date: "2025-12-14"
---

## The base path

If your repo is `portfolio-v3`, GitHub Pages serves it under:

`https://<user>.github.io/portfolio-v3/`

## What can break

- Asset paths if `base` is wrong
- Routes if `basename` is wrong

