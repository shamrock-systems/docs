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

## License

- Site code: [MIT](LICENSE)
- Documentation text: [CC BY 4.0](LICENSE-text)
