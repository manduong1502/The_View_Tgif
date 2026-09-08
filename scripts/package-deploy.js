const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('🚀 [THE VIEW] Bắt đầu quy trình đóng gói Triển Khai cPanel Siêu Ổn Định...');

// 1. Build Next.js Static Export
console.log('📦 1. Đang build Next.js (Static Export)...');
execSync('npm run build', { stdio: 'inherit' });

const outDir = path.join(__dirname, '..', 'out');

// 2. Find generated CSS file
console.log('🎨 2. Đang tối ưu hóa và nhúng CSS toàn phần...');
let globalCssContent = '';
const nextDir = path.join(outDir, '_next');
const chunksDir = path.join(nextDir, 'static', 'chunks');

if (fs.existsSync(chunksDir)) {
  const chunkFiles = fs.readdirSync(chunksDir);
  const cssFile = chunkFiles.find(f => f.endsWith('.css'));
  if (cssFile) {
    globalCssContent = fs.readFileSync(path.join(chunksDir, cssFile), 'utf8');
    console.log(`   ✓ Tìm thấy CSS file: ${cssFile} (${(globalCssContent.length / 1024).toFixed(1)} KB)`);
  }
}

// Write standalone style.css in root and css/
if (globalCssContent) {
  fs.writeFileSync(path.join(outDir, 'style.css'), globalCssContent, 'utf8');
  const cssDir = path.join(outDir, 'css');
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
  fs.writeFileSync(path.join(cssDir, 'style.css'), globalCssContent, 'utf8');
  console.log('   ✓ Đã tạo file /style.css và /css/style.css độc lập');
}

// 3. Duplicate _next to next_assets for 100% hosting compatibility
console.log('🔄 3. Đang tạo phiên bản song song _next và next_assets...');
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const nextAssetsDir = path.join(outDir, 'next_assets');
if (fs.existsSync(nextAssetsDir)) {
  fs.rmSync(nextAssetsDir, { recursive: true, force: true });
}
if (fs.existsSync(nextDir)) {
  copyDirRecursive(nextDir, nextAssetsDir);
  console.log('   ✓ Đã đồng bộ tài nguyên sang cả next_assets và _next');
}

// 4. Client-side Vanilla JS fallback & Google Fonts CDN injection
const googleFontsHead = `
  <!-- Google Fonts Direct CDN Fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css">
  <link rel="stylesheet" href="/style.css">
  <style id="the-view-inline-css">${globalCssContent}</style>
`;

const vanillaInteractiveJs = `
<script>
// The View - Core Interactive & Smooth Animation Engine
document.addEventListener('DOMContentLoaded', function() {
  // 1. Reveal Elements on Scroll
  var revealElements = document.querySelectorAll('.reveal-hidden');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(function(el) { observer.observe(el); });
  } else {
    revealElements.forEach(function(el) { el.classList.add('reveal-visible'); });
  }

  // 2. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 3. FAQ Native Fallback Support
  var faqCards = document.querySelectorAll('.luxury-card');
  faqCards.forEach(function(card) {
    var btn = card.querySelector('button');
    var contentGrid = card.querySelector('.grid');
    if (btn && contentGrid) {
      btn.addEventListener('click', function() {
        var isOpen = contentGrid.classList.contains('grid-rows-[1fr]');
        // Close all
        faqCards.forEach(function(c) {
          var g = c.querySelector('.grid');
          var icon = c.querySelector('button span:last-child');
          if (g) {
            g.classList.remove('grid-rows-[1fr]', 'opacity-100');
            g.classList.add('grid-rows-[0fr]', 'opacity-0');
          }
          if (icon && icon.textContent.includes('+')) {
            icon.classList.remove('rotate-45', 'bg-[#cba864]/20', 'text-[#f3e2b8]');
            icon.classList.add('rotate-0');
          }
        });
        if (!isOpen) {
          contentGrid.classList.remove('grid-rows-[0fr]', 'opacity-0');
          contentGrid.classList.add('grid-rows-[1fr]', 'opacity-100');
          var icon = btn.querySelector('span:last-child');
          if (icon) {
            icon.classList.remove('rotate-0');
            icon.classList.add('rotate-45', 'bg-[#cba864]/20', 'text-[#f3e2b8]');
          }
        }
      });
    }
  });
});
</script>
`;

// Inject into HTML files
['index.html', '404.html', '_not-found.html'].forEach(fileName => {
  const filePath = path.join(outDir, fileName);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Inject CSS in head
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${googleFontsHead}\n</head>`);
    }

    // Inject JS before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${vanillaInteractiveJs}\n</body>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`   ✓ Đã nhúng Inline CSS + Fonts CDN + Interactive Engine vào ${fileName}`);
  }
});

// 5. Generate Bulletproof .htaccess
console.log('🛡️ 5. Đang tạo cấu hình máy chủ Apache (.htaccess)...');
const htaccessContent = `# ==============================================================================
# The View Yacht Restaurant - High-Performance cPanel / Apache Config
# ==============================================================================

RewriteEngine On

# 1. Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Prevent rewrite loop on existing static files
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 3. MIME Types Configuration
<IfModule mod_mime.c>
  AddType text/html .html .htm
  AddType text/css .css
  AddType application/javascript .js
  AddType application/json .json
  AddType font/woff2 .woff2
  AddType font/woff .woff
  AddType font/ttf .ttf
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType image/jpeg .jpg .jpeg
  AddType image/png .png
  AddType image/x-icon .ico
</IfModule>

# 4. UTF-8 Default Charset
AddDefaultCharset UTF-8

# 5. Gzip / Deflate Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff2
</IfModule>

# 6. Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# 7. Error Document
ErrorDocument 404 /404.html
`;

fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent, 'utf8');
console.log('   ✓ Đã tạo .htaccess hoàn chỉnh với MIME types & caching');

// 6. Create 1-click PHP Unpacker (unzip.php)
const unzipPhpContent = `<?php
/**
 * The View - 1-Click Fast Unpacker for cPanel / Web Hosting
 * Usage: Place this file and theview-deploy.zip in your web root, then visit:
 * https://theview.tgifgroupvn.com/unzip.php
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

$zipFile = __DIR__ . '/theview-deploy.zip';

if (!file_exists($zipFile)) {
    die('<div style="font-family:sans-serif;padding:40px;text-align:center;color:#e11d48"><h2>❌ Không tìm thấy file theview-deploy.zip trong thư mục này!</h2><p>Vui lòng upload theview-deploy.zip lên cùng thư mục với unzip.php.</p></div>');
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);
if ($res === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    echo '<div style="font-family:sans-serif;padding:50px;text-align:center;background:#060e18;color:#cba864;min-height:100vh;">';
    echo '<h1 style="color:#ffffff;">🎉 GIẢI NÉN THÀNH CÔNG 100%!</h1>';
    echo '<p style="color:#cbd5e1;font-size:18px;">Toàn bộ website THE VIEW đã được giải nén hoàn chỉnh vào hosting.</p>';
    echo '<p><a href="/" style="display:inline-block;padding:14px 28px;background:#cba864;color:#060e18;text-decoration:none;font-weight:bold;border-radius:4px;margin-top:20px;">XEM TRANG CHỦ THE VIEW NGAY ➔</a></p>';
    echo '<p style="color:#64748b;font-size:12px;margin-top:30px;">(Bạn có thể xóa file unzip.php này sau khi giải nén xong)</p>';
    echo '</div>';
} else {
    echo '<div style="font-family:sans-serif;padding:40px;text-align:center;color:#e11d48"><h2>❌ Lỗi giải nén: Mã lỗi ' . $res . '</h2></div>';
}
?>`;

fs.writeFileSync(path.join(outDir, 'unzip.php'), unzipPhpContent, 'utf8');
console.log('   ✓ Đã tạo công cụ giải nén 1-click unzip.php');

// 7. Create Zip Archive via Archiver
const finalZipPath = path.join(__dirname, '..', 'theview-deploy.zip');

function createZip() {
  return new Promise((resolve, reject) => {
    console.log('🗜️ 6. Đang nén file theview-deploy.zip chuẩn POSIX (Archiver)...');
    
    if (fs.existsSync(finalZipPath)) {
      try { fs.unlinkSync(finalZipPath); } catch(e) {}
    }

    const output = fs.createWriteStream(finalZipPath);
    const archive = new archiver.ZipArchive({
      zlib: { level: 9 }
    });

    output.on('close', function() {
      const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
      console.log('\n======================================================');
      console.log(`🎉 ĐÓNG GÓI HOÀN TẤT: theview-deploy.zip (${sizeMB} MB)`);
      console.log('📍 File nén nằm tại:');
      console.log(`   ${finalZipPath}`);
      console.log('======================================================');
      resolve();
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.pipe(output);

    // Add all files and directories from outDir with clean relative paths
    archive.directory(outDir, false);

    archive.finalize();
  });
}

createZip().catch(err => {
  console.error('❌ Lỗi đóng gói zip:', err);
});
