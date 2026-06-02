# mcp-commons-wikimedia

Wikimedia Commons MCP — Action API for files.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Full-text search across Commons. |
| `file_info` | File metadata (size, mime, license, upload date, thumbnail urls). |
| `file_revisions` | File revision history. |
| `category_members` | Items in a Commons category. |
| `random_image` | Random image (optionally from a category). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "commons-wikimedia": {
      "url": "https://gateway.pipeworx.io/commons-wikimedia/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Commons Wikimedia data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
