---
title: "Dark Mode and Theming"
description: "How the theme class drives CSS variables, and how to avoid a flash on first load."
date: "2025-12-11"
image: "/blog/hello-blogs.svg"
---

## The idea

Theme is applied by toggling a class on `html` (`.dark` / `.light`) and letting CSS variables do the rest.

## Common gotchas

- Applying the class *after* first paint can cause a flash
- Storage access can fail in some contexts, so reads/writes should be guarded

## Checklist

- [x] Persist theme
- [x] Respect system theme
- [x] Keep transitions smooth

