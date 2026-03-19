# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website built with [Eleventy (11ty)](https://www.11ty.dev/) v3 and [Tailwind CSS](https://tailwindcss.com/) v3.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build: Tailwind CSS + Eleventy (outputs to _site/)
npm start            # Dev server: Tailwind watch + Eleventy serve (port 8080)
npm run clean        # Delete _site/ output directory
```

## Structure

- `src/` — all source files (Eleventy input dir)
- `src/_data/` — global data: `site.json`, `work.json`, `projects.json`
- `src/_includes/layouts/` — Nunjucks layouts: `base.njk`, `post.njk`
- `src/assets/css/main.css` — Tailwind source (committed)
- `src/assets/css/output.css` — Tailwind output (gitignored, generated)
- `src/blog/` — blog posts as Markdown; `blog.json` sets layout + tag
- `_site/` — build output (gitignored)

## CSS Pipeline

Tailwind CLI processes `main.css` → `output.css`. Eleventy passthrough-copies
`src/assets/` to `_site/assets/`. Run both together with `npm start`.

## Adding content

- **Blog post**: add a `.md` file in `src/blog/` with frontmatter `title`, `date`, `description`
- **Work entry**: add an object to `src/_data/work.json`
- **Project**: add an object to `src/_data/projects.json`
- **Nav link**: edit `site.nav` in `src/_data/site.json`
