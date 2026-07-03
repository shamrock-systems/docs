<div class="hero">
  <div class="hero-icon">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 38.5A5 5 0 0 1 13 33h26"/>
      <path d="M13 4h26v40H13a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5z"/>
      <path d="M20 14h12M20 22h8" stroke-width="2"/>
    </svg>
  </div>
  <h1>Shamrock</h1>
  <p class="hero-subtitle"><strong>Shamrock</strong> is a robust Discord-to-Roblox management integration designed to streamline server administration, user verification, and cross-platform synchronization.</p>
</div>

> **Info:** Status: Currently in active development. Access is limited to select servers at this time.

## Overview

Shamrock bridges the gap between your Discord community and your Roblox experience. By providing automated tools for identity verification and management, it allows server administrators to focus on growing their community rather than manual user tracking.

## Features

- **Secure Account Linking:** Seamlessly link Discord accounts to Roblox profiles.
- **Verification Systems:** Automated role assignment based on Roblox group ranks or in-game statistics.
- **Administrative Tools:** Integrated commands to manage user permissions and access across both platforms.
- **Performance Focused:** Built for stability and speed, ensuring reliable synchronization.

## Getting Started

As Shamrock is currently in a closed-access phase, it is not yet available for public installation. If you are a developer looking to contribute or an administrator interested in early access, please reach out via [our Discord server](https://discord.gg/rP3ErqExPj).

## Built With

- [Discord.js](https://discord.js.org/) - The library used for Discord bot interactions.
- [Roblox API](https://create.roblox.com/docs/cloud/reference) - The interface for managing Roblox user/group data.
- [Node.js](https://nodejs.org/) - The runtime environment for the backend.

## Roadmap

- Implement OAuth2 for Roblox verification.
- Develop a user-friendly dashboard for permission management.
- Expand documentation and public API endpoints.
- Finalize Beta release for wider community testing.

## MCP Access

This documentation is available via [Model Context Protocol (MCP)](https://modelcontextprotocol.io) for AI assistants.

### Local

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

### Remote (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shamrock-systems/docs)

```json
{
  "mcpServers": {
    "shamrock-docs": {
      "url": "https://<your-service>.onrender.com/sse"
    }
  }
}
```

## Contributing

We appreciate your interest in Shamrock! Please note that as this project is in early development, we are not currently accepting public pull requests. Please check back for updates on how to contribute once we move to a public beta.

## License

This project is **Proprietary** unless repos are using a different license (e.g GPL 3.0 or MIT). All rights reserved. Unauthorized copying, distribution, or use of this software is strictly prohibited.
