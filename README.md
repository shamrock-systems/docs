# Shamrock Systems Documentation

Documentation site for Shamrock Systems API and bot.

## Structure

```
├── index.html          # Documentation site
├── style.css           # Mintlify-inspired styles
├── main.js             # Client-side routing + markdown rendering
├── content/
│   ├── index.md        # Landing page
│   └── api/
│       ├── intro.md    # API overview
│       ├── global-bans.md
│       └── health.md   # Server status endpoint
├── .github/workflows/
│   └── deploy.yml      # GitHub Pages deployment
├── LICENSE             # MIT (site code)
└── LICENSE-text        # CC BY 4.0 (documentation content)
```

## Development

The site is a static single-page app. Markdown content is rendered client-side using [marked](https://marked.js.org/).

```bash
npx serve .
```

## MCP Server

The docs include a [Model Context Protocol](https://modelcontextprotocol.io) server for AI assistant access to documentation.

### Local (stdio)

```bash
npm install
npm run mcp
```

Configure in your MCP client:

```json
{
  "mcpServers": {
    "shamrock-docs": {
      "command": "node",
      "args": ["mcp-server.mjs"],
      "cwd": "/path/to/docs"
    }
  }
}
```

### Remote (SSE)

Run the server in SSE mode on your host:

```bash
npm install
node mcp-server.mjs --sse
```

Expose via tunnel (e.g., `ssh -R`, `ngrok`, `cloudflared`):

```bash
cloudflared tunnel --url http://localhost:3001
```

Configure in your MCP client:

```json
{
  "mcpServers": {
    "shamrock-docs": {
      "url": "https://<tunnel-url>/sse"
    }
  }
}
```

Available tools: `read_<section_name>` for each doc page.

## License

- Site code: [MIT](LICENSE)
- Documentation text: [CC BY 4.0](LICENSE-text)
