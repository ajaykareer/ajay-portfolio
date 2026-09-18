import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

// Serve the real static build for local QA, without the development compiler.
const root = resolve(process.env.PREVIEW_ROOT || 'dist/client');
const port = Number(process.env.PORT || 4173);
const audit = process.argv.includes('--audit');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};
await stat(resolve(root, 'index.html'));
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const file = resolve(
      root,
      '.' + (pathname === '/' ? '/index.html' : pathname),
    );
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    let body = await readFile(file);
    if (audit && pathname === '/' && url.searchParams.has('audit')) {
      const script = await readFile(
        new URL('./qa-metrics.js', import.meta.url),
        'utf8',
      );
      body = Buffer.from(
        body.toString().replace('</head>', `<script>${script}</script></head>`),
      );
    }
    const extension = extname(file);
    response.setHeader(
      'Content-Type',
      types[extension] || 'application/octet-stream',
    );
    response.setHeader('Cache-Control', 'no-cache');
    if (
      /gzip/.test(request.headers['accept-encoding'] || '') &&
      ['.html', '.js', '.css', '.svg', '.json'].includes(extension)
    ) {
      body = gzipSync(body);
      response.setHeader('Content-Encoding', 'gzip');
      response.setHeader('Vary', 'Accept-Encoding');
    }
    response.writeHead(200).end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () =>
  console.log(
    `Production preview: http://localhost:${port}${audit ? '/?audit=1' : '/'}`,
  ),
);
