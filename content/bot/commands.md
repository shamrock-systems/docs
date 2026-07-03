# Commands Documentation

## Overview

All commands are prefixed with `!` (configurable in `config.json`). Commands support both prefix and mention formats.

---

## Command Reference

### `!lookup` / `!lookup <username|userid>`

Look up a Roblox user's profile information.

**Aliases:** `!search`, `!userinfo`

**Permissions:** Level 1 role required

**Arguments:**
- `username` - Roblox username (case-insensitive)
- `userid` - Roblox user ID (numeric)

**Example:**
```
!lookup Builderman
!lookup 1507572
```

**Response:** Embed with user avatar, display name, username, user ID, account creation date, description, and links to profile/inventory/groups.

---

### `!whois` / `!whois [@user|userid]`

View detailed Discord user information.

**Aliases:** `!user`, `!userinfo`

**Permissions:** Level 1 role required

**Arguments:**
- `@user` - Mention a user (optional, defaults to command author)
- `userid` - Discord user ID (optional)

**Example:**
```
!whois
!whois @User#1234
!whois 123456789012345678
```

**Response:** Embed with user avatar, username, discriminator, ID, account creation date, server join date, roles, badges, and flags.

---

### `!exec` / `!exec <code>`

Execute arbitrary JavaScript code (Developer only).

**Aliases:** `!eval`, `!e`

**Permissions:** Developer only (DevAuth in config.json)

**Arguments:**
- `code` - JavaScript code to execute

**Example:**
```
!exec console.log("Hello World")
```

**Available Variables:**
- `client` - Discord Client instance
- `message` - Message object
- `args` - Command arguments array
- `config` - Configuration object

**Safety:** Code runs in isolated context. Timeout: 5 seconds. Output limited to 1900 characters.

---

### `!say` / `!say <message>`

Send a message as the bot to the current channel.

**Aliases:** `!announce`, `!broadcast`

**Permissions:** Level 1 role required

**Arguments:**
- `message` - Text to send (supports basic markdown)

**Example:**
```
!say Hello everyone!
```

**Note:** Bot must have "Send Messages" permission in the channel.

---

### `!ping`

Check bot latency and API response time.

**Aliases:** `!pong`, `!latency`

**Permissions:** Everyone

**Example:**
```
!ping
```

**Response:** Embed showing:
- Bot Latency (WebSocket heartbeat)
- API Latency (REST API response time)
- Uptime

---

## Permission System

### Level 0 (Everyone)
- `!ping`

### Level 1 (Requires Level1 Role)
- `!lookup`
- `!whois`
- `!say`

### Level 2 (Developer Only)
- `!exec`
