const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Đang chuẩn bị gói triển khai siêu tốc cho cPanel (theview.tgifgroupvn.com)...');

// 1. Run next build to ensure fresh static export
console.log('📦 Đang xuất bản tĩnh Next.js (Static Export)...');
execSync('npm run build', { stdio: 'inherit' });

const outDir = path.join(__dirname, '..', 'out');

// 2. Generate optimized .htaccess for cPanel
const htaccessContent = `# ==============================================================================
# The View Yacht Restaurant - Optimized Apache/cPanel Configuration
# ==============================================================================

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Set Default Charset
AddDefaultCharset UTF-8

# Compression (Gzip / Deflate)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>

# Browser Caching Headers
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

# Custom 404 Error Page
ErrorDocument 404 /404.html
`;

fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');
console.log('✅ Đã tạo file .htaccess tối ưu cache và HTTPS');

// 3. Compress 'out' folder into theview-deploy.zip
const zipFile = path.join(__dirname, '..', 'theview-deploy.zip');
if (fs.existsSync(zipFile)) {
  try { fs.unlinkSync(zipFile); } catch(e) {}
}

console.log('🗜️ Đang nén thành theview-deploy.zip...');
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
