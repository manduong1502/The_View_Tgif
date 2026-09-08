const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Đang chuẩn bị gói triển khai cPanel hoàn hảo (theview.tgifgroupvn.com)...');

// 1. Run next build to export static site
console.log('📦 Đang xuất bản tĩnh Next.js (Static Export)...');
execSync('npm run build', { stdio: 'inherit' });

const outDir = path.join(__dirname, '..', 'out');

// 2. Fix cPanel / Apache underscore-blocking by renaming _next to next_assets
console.log('🔄 Đang tối ưu đường dẫn tài nguyên (chuyển _next -> next_assets để tương thích 100% cPanel/Apache)...');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (/\.(html|js|css|json|txt)$/i.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('_next/')) {
        content = content.replaceAll('/_next/', '/next_assets/').replaceAll('_next/', 'next_assets/');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

if (fs.existsSync(path.join(outDir, '_next'))) {
  replaceInDir(outDir);
  const nextAssetsDir = path.join(outDir, 'next_assets');
  if (fs.existsSync(nextAssetsDir)) {
    fs.rmSync(nextAssetsDir, { recursive: true, force: true });
  }
  fs.renameSync(path.join(outDir, '_next'), nextAssetsDir);
  console.log('✅ Đã đổi tên thư mục _next -> next_assets');
}

// 3. Generate optimal .htaccess for cPanel & Apache
const htaccessContent = `# ==============================================================================
# The View Yacht Restaurant - Apache & cPanel Deployment Configuration
# ==============================================================================

RewriteEngine On

# 1. Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Correct MIME Types
<IfModule mod_mime.c>
  AddType text/css .css
  AddType application/javascript .js
  AddType font/woff2 .woff2
  AddType font/woff .woff
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType image/jpeg .jpg .jpeg
  AddType image/png .png
</IfModule>

# 3. Default Charset
AddDefaultCharset UTF-8

# 4. Gzip / Deflate Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff2
</IfModule>

# 5. Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
</IfModule>

# 6. Fallback routing for SPA / 404
ErrorDocument 404 /404.html
`;

fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');
console.log('✅ Đã tạo file .htaccess chuẩn MIME types và HTTPS');

// 4. Compress out directory into theview-deploy.zip
const zipFile = path.join(__dirname, '..', 'theview-deploy.zip');
if (fs.existsSync(zipFile)) {
  try { fs.unlinkSync(zipFile); } catch(e) {}
}

console.log('🗜️ Đang tạo file theview-deploy.zip...');
try {
  execSync(`powershell -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
} catch (err) {
  console.error('Lỗi khi nén bằng PowerShell:', err.message);
}

if (fs.existsSync(zipFile)) {
  const stat = fs.statSync(zipFile);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
  console.log('\n======================================================');
  console.log(`🎉 ĐÓNG GÓI THÀNH CÔNG: theview-deploy.zip (${sizeMB} MB)`);
  console.log('📍 Đường dẫn file nén:');
  console.log(`   ${zipFile}`);
  console.log('======================================================');
}
