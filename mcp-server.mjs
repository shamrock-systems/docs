import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DOCS_DIR = join(__dirname, 'content');
const mode = process.argv.includes('--sse') ? 'sse' : 'stdio';
const PORT = parseInt(process.env.PORT || '3001', 10);

function getDocFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...getDocFiles(full));
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

const docs = new Map();
for (const file of getDocFiles(DOCS_DIR)) {
  const rel = relative(DOCS_DIR, file);
  const name = rel.replace(/\.md$/, '');
  docs.set(name, { path: file, content: readFileSync(file, 'utf-8') });
}

const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'shamrock-docs', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } },
);

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: Array.from(docs.keys()).map(name => ({
    uri: `docs://${name}`,
    name,
    description: `Shamrock documentation: ${name}`,
    mimeType: 'text/markdown',
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const name = request.params.uri.replace('docs://', '');
  const doc = docs.get(name);
  if (!doc) throw new Error(`Document not found: ${name}`);
  return { contents: [{ uri: request.params.uri, mimeType: 'text/markdown', text: doc.content }] };
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Array.from(docs.keys()).map(name => ({
    name: `read_${name.replace(/[/-]/g, '_')}`,
    description: `Read the ${name} documentation page`,
    inputSchema: { type: 'object', properties: {} },
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name.replace(/^read_/, '').replace(/_/g, '/');
  const doc = docs.get(name);
  if (!doc) throw new Error(`Document not found: ${name}`);
  return { content: [{ type: 'text', text: doc.content }] };
});

if (mode === 'sse') {
  const { SSEServerTransport } = await import('@modelcontextprotocol/sdk/server/sse.js');
  const transports = new Map();

  const app = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/sse') {
      const transport = new SSEServerTransport('/messages', res);
      transports.set(transport.sessionId, transport);
      res.on('close', () => transports.delete(transport.sessionId));
      await server.connect(transport);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/messages') {
      const sessionId = url.searchParams.get('sessionId');
      const transport = transports.get(sessionId);
      if (transport) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => transport.handlePost(req, res, body));
      } else {
        res.writeHead(404);
        res.end('Session not found');
      }
      return;
    }

    res.writeHead(404);
    res.end();
  });

  app.listen(PORT, () => {
    console.error(`Shamrock MCP server (SSE) running on http://localhost:${PORT}/sse`);
  });
} else {
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
