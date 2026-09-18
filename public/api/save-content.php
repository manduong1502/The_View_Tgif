<?php
/**
 * The View Yacht Restaurant - Content Management Save Endpoint
 * Handles secure saving of content.json on cPanel / Apache hosting
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Password');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Phương thức không được hỗ trợ (chỉ chấp nhận POST).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Read input payload
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Dữ liệu gửi lên trống.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = json_decode($rawInput, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Định dạng JSON không hợp lệ.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Extract content and password
$submittedPassword = isset($payload['_adminPassword']) ? trim($payload['_adminPassword']) : '';
if (empty($submittedPassword) && isset($_SERVER['HTTP_X_ADMIN_PASSWORD'])) {
    $submittedPassword = trim($_SERVER['HTTP_X_ADMIN_PASSWORD']);
}

// Target content.json path (one level up from /api/)
$contentFilePath = dirname(__DIR__) . '/content.json';
$backupFilePath = dirname(__DIR__) . '/content.backup.json';

// Read existing content to verify password if set
$expectedPassword = 'theview@2026';
if (file_exists($contentFilePath)) {
    $existingRaw = file_get_contents($contentFilePath);
    $existingData = json_decode($existingRaw, true);
    if (isset($existingData['admin']['passwordHash']) && !empty($existingData['admin']['passwordHash'])) {
        $expectedPassword = $existingData['admin']['passwordHash'];
    }
}

// Password verification
if (!empty($expectedPassword) && $submittedPassword !== $expectedPassword) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Mật khẩu quản trị không chính xác.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Clean internal payload fields before saving
unset($payload['_adminPassword']);

// Ensure timestamp is recorded
if (!isset($payload['admin'])) {
    $payload['admin'] = [];
}
$payload['admin']['updatedAt'] = date('c');

$encodedJson = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($encodedJson === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi mã hóa dữ liệu JSON.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Create backup of current file
if (file_exists($contentFilePath)) {
    @copy($contentFilePath, $backupFilePath);
}

// Write to content.json
$writeResult = @file_put_contents($contentFilePath, $encodedJson);

if ($writeResult === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Không thể ghi file content.json. Vui lòng kiểm tra quyền ghi (CHMOD 644/666 hoặc 777) của thư mục hoặc file.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Đã lưu thay đổi thành công!',
    'bytesWritten' => $writeResult,
    'updatedAt' => $payload['admin']['updatedAt']
], JSON_UNESCAPED_UNICODE);
?>
