# Shamrock Docs

Static SPA doc site for Shamrock Systems API + bot commands. No build step. Markdown in `content/` is rendered client-side via `marked.js` (CDN).

## Commands

- Preview: `npx serve .`
- MCP stdio: `npm run mcp`
- MCP SSE: `npm run mcp:sse`

## Deployment

- Push to `main` → auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`.
- "Deployment failed, try again later" is a Pages flake — re-run the workflow.
- MCP server on Render: `render.yaml` blueprint at https://render.com/deploy?repo=https://github.com/shamrock-systems/docs

## Architecture

- `index.html` is the shell (navbar, sidebar, footer). `404.html` duplicates it with `window.__pagesPath` for direct URL SPA access.
- `main.js` routes via hash (`#content/<path>.md`), renders markdown with `marked.parse()`, converts `> **Warning:/Info:/Danger:/Tip:**` blockquotes into styled callout boxes.
- Sidebar `<a>` tags use `data-page="content/<path>.md"`. Internal links resolve relative to the current page's directory.
- Theme toggle persisted in `localStorage` key `theme`.
- To add a page: create `content/<section>/<page>.md`, add sidebar link in both `index.html` and `404.html`.

## MCP tools

SSE mode exposes `read_<section_name>` tools (e.g. `read_api_intro`) and `docs://` resources for each markdown file, auto-generated from filenames.

## Licensing

- Site code (`/LICENSE`): MIT
- Documentation text (`/LICENSE-text`): CC BY 4.0
- `render.yaml`, `mcp-server.mjs`, `package.json` are site code → MIT
