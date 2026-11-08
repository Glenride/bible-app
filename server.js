const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');
const DB_PATH = path.join(__dirname, 'assets', 'bible.db');

// Open SQLite database
if (!fs.existsSync(DB_PATH)) {
  console.error(`Error: Database file not found at ${DB_PATH}`);
  process.exit(1);
}
const db = new DatabaseSync(DB_PATH);
const getBooksStmt = db.prepare('SELECT book_id, book_name, chapter_count, verse_count, short_name FROM books ORDER BY book_id ASC');
const getVersesStmt = db.prepare('SELECT id, book_id, chapter, verse, text FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse ASC');
const getChapterCountStmt = db.prepare('SELECT chapter_count FROM books WHERE book_id = ?');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.db': 'application/octet-stream',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendJson(res, statusCode, data) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=60',
  });
  res.end(json);
}

function serveStaticFile(req, res, pathname) {
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  // Check if file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // If not found and not an API call, fallback to index.html for SPA routing
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // Health check
  if (pathname === '/health') {
    return sendJson(res, 200, { status: 'healthy', app: 'bible-app', uptime: process.uptime() });
  }

  // API: Get all books
  if (pathname === '/api/books') {
    try {
      const books = getBooksStmt.all();
      return sendJson(res, 200, books);
    } catch (err) {
      console.error('Error fetching books:', err);
      return sendJson(res, 500, { error: 'Failed to fetch books' });
    }
  }

  // API: Get verses for a book and chapter
  if (pathname === '/api/verses') {
    const bookId = parseInt(reqUrl.searchParams.get('bookId'), 10);
    const chapter = parseInt(reqUrl.searchParams.get('chapter'), 10);

    if (isNaN(bookId) || isNaN(chapter)) {
      return sendJson(res, 400, { error: 'Missing or invalid bookId or chapter parameter' });
    }

    try {
      const verses = getVersesStmt.all(bookId, chapter);
      return sendJson(res, 200, verses);
    } catch (err) {
      console.error('Error fetching verses:', err);
      return sendJson(res, 500, { error: 'Failed to fetch verses' });
    }
  }

  // API: Get chapter count
  if (pathname === '/api/chapter-count') {
    const bookId = parseInt(reqUrl.searchParams.get('bookId'), 10);
    if (isNaN(bookId)) {
      return sendJson(res, 400, { error: 'Missing or invalid bookId' });
    }
    try {
      const result = getChapterCountStmt.get(bookId);
      return sendJson(res, 200, result || { chapter_count: 0 });
    } catch (err) {
      console.error('Error fetching chapter count:', err);
      return sendJson(res, 500, { error: 'Failed to fetch chapter count' });
    }
  }

  // Fallback to static files
  serveStaticFile(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`[bible-app] Production server running at http://${HOST}:${PORT}`);
});
