# Personal Site

Personal website built with [Eleventy](https://www.11ty.dev/) v3 and [Tailwind CSS](https://tailwindcss.com/) v3.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build site (outputs to _site/)
npm start            # Dev server on port 8080
npm run clean        # Delete _site/
```

## Deploying to a subdirectory

If the site will be served from a path other than `/`, set `PATH_PREFIX` at build time:

```bash
PATH_PREFIX=/testing/mysite/ npm run build
```

All internal links in the generated HTML will be rewritten to be relative to that prefix.
`PATH_PREFIX` also affects the `Disallow` paths in `robots.txt` and the `Sitemap:` URL.
Leave `PATH_PREFIX` unset (or set it to `/`) for a root deployment.

## Adding content

- **Blog post**: add a `.md` file in `src/blog/` with frontmatter `title`, `date`, `description`
- **Resume entry**: add an object to `src/_data/resume.json`
- **Project**: add an object to `src/_data/projects.json`
- **Nav link**: edit `site.nav` in `src/_data/site.json`
