const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // GET /list
  if (req.method === 'GET' && req.url.startsWith('/list')) {
    const files = [];
    if (fs.existsSync(uploadsDir)) {
      const all = fs.readdirSync(uploadsDir);
      all.forEach(f => {
        if (f.startsWith('.')) return;
        const full = path.join(uploadsDir, f);
        const stat = fs.statSync(full);
        if (stat.isFile()) {
          files.push({
            name: f,
            url: '/uploads/' + f,
            size: stat.size,
            time: Math.floor(stat.mtimeMs / 1000),
            category: 'upload'
          });
        }
      });
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, files }));
  }

  // POST /upload
  if (req.method === 'POST' && req.url === '/upload') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const origName = payload.name || 'image.jpg';
        const ext = path.extname(origName).replace('.', '').toLowerCase() || 'jpg';
        const base = path.basename(origName, path.extname(origName)).replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 30);
        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
        const rand = Math.random().toString(36).substring(2, 7);
        const newFilename = `theview_${timestamp}_${base || 'img'}_${rand}.${ext}`;

        const base64Data = payload.data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(path.join(uploadsDir, newFilename), buffer);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          url: '/uploads/' + newFilename,
          filename: newFilename,
          size: buffer.length
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[The View] Dev Upload Server running on http://localhost:${PORT}`);
});
