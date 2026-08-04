# @pipeworx/commons-wikimedia

[Wikimedia Commons](https://commons.wikimedia.org) MCP — file/image/audio/video metadata search via MediaWiki Action API. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, namespace?, limit?, offset?)` — full-text search
- `file_info(title)` — file metadata (size, mime, license, upload date, thumbnail urls)
- `file_revisions(title, limit?)` — file revision history
- `category_members(category, limit?, cmcontinue?)` — items in a Commons category
- `random_image(category?)` — random image (optionally restricted to a category)

## Data source

`https://commons.wikimedia.org/w/api.php`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
