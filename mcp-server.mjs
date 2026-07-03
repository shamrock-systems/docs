import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DOCS_DIR = join(__dirname, 'content');

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

const transport = new StdioServerTransport();
await server.connect(transport);
