interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Wikimedia Commons MCP — Action API for files.
 */


const BASE = 'https://commons.wikimedia.org/w/api.php';
const UA = 'pipeworx-mcp-commons-wikimedia/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Full-text search across Commons.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        namespace: { type: 'number', description: '0 (article) | 6 (file, default) | 14 (category)' },
        limit: { type: 'number', description: '1-500 (default 20).' },
        offset: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'file_info',
    description: 'File metadata (size, mime, license, upload date, thumbnail urls).',
    inputSchema: {
      type: 'object',
      properties: { title: { type: 'string', description: 'e.g. "File:Cat.jpg"' } },
      required: ['title'],
    },
  },
  {
    name: 'file_revisions',
    description: 'File revision history.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        limit: { type: 'number' },
      },
      required: ['title'],
    },
  },
  {
    name: 'category_members',
    description: 'Items in a Commons category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'e.g. "Category:Cats"' },
        limit: { type: 'number' },
        cmcontinue: { type: 'string' },
      },
      required: ['category'],
    },
  },
  {
    name: 'random_image',
    description: 'Random image (optionally from a category).',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string' } },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const p = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: reqStr(args, 'query', '"sunset beach"'),
        srnamespace: String((args.namespace as number) ?? 6),
        srlimit: String(Math.min(500, Math.max(1, (args.limit as number) ?? 20))),
        sroffset: String(Math.max(0, (args.offset as number) ?? 0)),
        format: 'json', formatversion: '2', origin: '*',
      });
      return cmGet(p);
    }
    case 'file_info': {
      const p = new URLSearchParams({
        action: 'query',
        prop: 'imageinfo',
        iiprop: 'url|size|mime|user|timestamp|sha1|metadata|extmetadata|thumbmime',
        titles: reqStr(args, 'title', '"File:Cat.jpg"'),
        format: 'json', formatversion: '2', origin: '*',
      });
      return cmGet(p);
    }
    case 'file_revisions': {
      const p = new URLSearchParams({
        action: 'query',
        prop: 'imageinfo',
        iiprop: 'timestamp|user|comment|url|size|sha1',
        iilimit: String(Math.min(500, Math.max(1, (args.limit as number) ?? 20))),
        titles: reqStr(args, 'title', '"File:Cat.jpg"'),
        format: 'json', formatversion: '2', origin: '*',
      });
      return cmGet(p);
    }
    case 'category_members': {
      const p = new URLSearchParams({
        action: 'query',
        list: 'categorymembers',
        cmtitle: reqStr(args, 'category', '"Category:Cats"'),
        cmlimit: String(Math.min(500, Math.max(1, (args.limit as number) ?? 50))),
        format: 'json', formatversion: '2', origin: '*',
      });
      if (args.cmcontinue) p.set('cmcontinue', String(args.cmcontinue));
      return cmGet(p);
    }
    case 'random_image': {
      const p = new URLSearchParams({
        action: 'query',
        generator: 'random',
        grnnamespace: '6',
        grnlimit: '1',
        prop: 'imageinfo',
        iiprop: 'url|size|mime',
        format: 'json', formatversion: '2', origin: '*',
      });
      if (args.category) {
        // Random within a category via 'list=categorymembers' is not directly supported; fall back to first member.
        const params2 = new URLSearchParams({
          action: 'query',
          list: 'categorymembers',
          cmtitle: String(args.category),
          cmtype: 'file',
          cmlimit: '1',
          format: 'json', formatversion: '2', origin: '*',
        });
        return cmGet(params2);
      }
      return cmGet(p);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function cmGet(params: URLSearchParams): Promise<unknown> {
  const res = await fetch(`${BASE}?${params}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
