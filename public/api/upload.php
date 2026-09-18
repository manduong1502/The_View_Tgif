<?php
/**
 * The View Yacht Restaurant - Secure Image Upload Endpoint
 * Saves uploaded images to the /uploads/ folder on cPanel / Apache hosting.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Password');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uploadDir = dirname(__DIR__) . '/uploads/';

// Ensure uploads directory exists
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

// -------------------------------------------------------------
// GET / POST ?action=list -> List existing uploaded and system images
// -------------------------------------------------------------
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
if ($action === 'list') {
    $files = [];
    $validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico'];

    // 1. Scan uploads directory
    if (is_dir($uploadDir)) {
        $scanned = scandir($uploadDir);
        foreach ($scanned as $f) {
            if ($f === '.' || $f === '..' || $f === '.gitkeep') continue;
            $full = $uploadDir . $f;
            if (is_file($full)) {
                $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                if (in_array($ext, $validExts)) {
                    $files[] = [
                        'name' => $f,
                        'url' => '/uploads/' . $f,
                        'size' => filesize($full),
                        'time' => filemtime($full),
                        'category' => 'upload'
                    ];
                }
            }
        }
    }

    // 2. Scan standard images directory
    $imagesDir = dirname(__DIR__) . '/images/';
    if (is_dir($imagesDir)) {
        $scannedImg = scandir($imagesDir);
        foreach ($scannedImg as $f) {
            if ($f === '.' || $f === '..' || $f === 'logo') continue;
            $full = $imagesDir . $f;
            if (is_file($full)) {
                $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                if (in_array($ext, $validExts)) {
                    $files[] = [
                        'name' => $f,
                        'url' => '/images/' . $f,
                        'size' => filesize($full),
                        'time' => filemtime($full),
                        'category' => 'system'
                    ];
                }
            }
        }
        // Also scan logo subdirectory
        $logoDir = $imagesDir . 'logo/';
        if (is_dir($logoDir)) {
            $scannedLogo = scandir($logoDir);
            foreach ($scannedLogo as $f) {
                if ($f === '.' || $f === '..') continue;
                $full = $logoDir . $f;
                if (is_file($full)) {
                    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                    if (in_array($ext, $validExts)) {
                        $files[] = [
                            'name' => $f,
                            'url' => '/images/logo/' . $f,
                            'size' => filesize($full),
                            'time' => filemtime($full),
                            'category' => 'logo'
                        ];
                    }
                }
            }
        }
    }

    // Sort: uploads first (newest), then system images
    usort($files, function($a, $b) {
        if ($a['category'] === 'upload' && $b['category'] !== 'upload') return -1;
        if ($a['category'] !== 'upload' && $b['category'] === 'upload') return 1;
        return $b['time'] - $a['time'];
    });

    echo json_encode([
        'success' => true,
        'files' => $files
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// -------------------------------------------------------------
// POST -> Upload Image File
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Chỉ chấp nhận yêu cầu POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Check admin password
$submittedPassword = '';
if (isset($_POST['_adminPassword'])) {
    $submittedPassword = trim($_POST['_adminPassword']);
} elseif (isset($_SERVER['HTTP_X_ADMIN_PASSWORD'])) {
    $submittedPassword = trim($_SERVER['HTTP_X_ADMIN_PASSWORD']);
}

$contentFilePath = dirname(__DIR__) . '/content.json';
$expectedPassword = 'theview@2026';
if (file_exists($contentFilePath)) {
    $existingRaw = @file_get_contents($contentFilePath);
    $existingData = json_decode($existingRaw, true);
    if (isset($existingData['admin']['passwordHash']) && !empty($existingData['admin']['passwordHash'])) {
        $expectedPassword = $existingData['admin']['passwordHash'];
    }
}

if (!empty($expectedPassword) && $submittedPassword !== $expectedPassword) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Mật khẩu quản trị không chính xác.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Check uploaded file
$fileKey = isset($_FILES['image']) ? 'image' : (isset($_FILES['file']) ? 'file' : null);
if (!$fileKey || !isset($_FILES[$fileKey])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Không tìm thấy file tải lên (chưa chọn file).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES[$fileKey];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE   => 'Kích thước file vượt quá cấu hình của máy chủ (upload_max_filesize).',
        UPLOAD_ERR_FORM_SIZE  => 'Kích thước file vượt quá giới hạn form.',
        UPLOAD_ERR_PARTIAL    => 'File chỉ mới được tải lên một phần.',
        UPLOAD_ERR_NO_FILE    => 'Không có file nào được tải lên.',
        UPLOAD_ERR_NO_TMP_DIR => 'Thiếu thư mục tạm trên máy chủ.',
        UPLOAD_ERR_CANT_WRITE => 'Không thể ghi file vào ổ cứng máy chủ.',
        UPLOAD_ERR_EXTENSION  => 'Quá trình tải file bị chặn bởi tiện ích PHP.',
    ];
    $errMsg = isset($errorMessages[$file['error']]) ? $errorMessages[$file['error']] : 'Lỗi không xác định khi tải file lên.';
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $errMsg], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validate file extension
$origName = $file['name'];
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico'];

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Định dạng file không được hỗ trợ. Vui lòng chỉ tải các định dạng: ' . implode(', ', $allowedExts)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Limit size (max 20MB)
if ($file['size'] > 20 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Dung lượng ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 20MB.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Generate clean unique filename: theview_YYYYMMDD_HHMMSS_[random].[ext]
$baseName = pathinfo($origName, PATHINFO_FILENAME);
$cleanBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $baseName);
$cleanBase = substr(trim($cleanBase, '_'), 0, 30);
if (empty($cleanBase)) $cleanBase = 'img';

$timestamp = date('Ymd_His');
$randomSuffix = substr(md5(uniqid((string)mt_rand(), true)), 0, 6);
$newFilename = "theview_{$timestamp}_{$cleanBase}_{$randomSuffix}.{$ext}";
$targetDestination = $uploadDir . $newFilename;

if (!move_uploaded_file($file['tmp_name'], $targetDestination)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Không thể lưu file vào thư mục /uploads/. Vui lòng kiểm tra quyền ghi thư mục (chmod 755).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Success!
chmod($targetDestination, 0644);
$publicUrl = '/uploads/' . $newFilename;

echo json_encode([
    'success' => true,
    'message' => 'Tải ảnh lên thành công!',
    'url' => $publicUrl,
    'filename' => $newFilename,
    'size' => filesize($targetDestination)
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
