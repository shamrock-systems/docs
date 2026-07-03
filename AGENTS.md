# Shamrock Docs — AGENTS.md

## What this is

Static SPA doc site for Shamrock Systems API + bot commands. No build step.
Markdown in `content/` is rendered client-side via `marked.js` (CDN).

## Commands

| What | Command |
|------|---------|
| Preview locally | `npx serve .` |
| MCP (stdio) | `npm run mcp` |
| MCP (SSE) | `npm run mcp:sse` |

## Deployment

- **GitHub Pages** — push to `main`, workflow in `.github/workflows/deploy.yml` auto-deploys.
- **Transient failure** — "Deployment failed, try again later" is a GitHub Pages flake. Re-run the workflow; it always succeeds on retry.
- **MCP (Render)** — `render.yaml` blueprint. Deploy via https://render.com/deploy?repo=https://github.com/shamrock-systems/docs

## Architecture

- `index.html` — shell (navbar, sidebar, footer). 404.html duplicates it with `window.__pagesPath` fallback for SPA direct URL access.
- `main.js` — hash-based routing (`#content/<path>.md`), fetches markdown, renders via `marked.parse()`, converts `> **Warning:** ...` blockquotes to styled callouts.
- Sidebar links use `data-page` attributes. Internal links are resolved relative to the current page's directory.
- Theme toggle saves to `localStorage` key `theme`.
- Add a new page: create `content/<section>/<page>.md`, add `<a>` in `index.html` and `404.html` sidebar with `data-page="content/<section>/<page>.md"`.

## MCP tools

Running in SSE mode exposes `read_<section_name>` tools (e.g. `read_api_intro`) and `docs://` resources for each markdown file. Tools are auto-generated from filenames.

## Licensing

- `/LICENSE` = MIT (site code)
- `/LICENSE-text` = CC BY 4.0 (documentation content)
- `render.yaml`, `mcp-server.mjs`, `package.json` are site code → MIT
