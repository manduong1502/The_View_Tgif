"use client";

import { useState, useRef } from "react";

/**
 * Upload image to cPanel /api/upload.php or Next.js /api/upload
 */
export async function uploadImageFile(file, adminPassword) {
  const formData = new FormData();
  formData.append("image", file);
  if (adminPassword) {
    formData.append("_adminPassword", adminPassword);
  }

  try {
    const res = await fetch("/api/upload.php", {
      method: "POST",
      headers: {
        "X-Admin-Password": adminPassword || "theview@2026",
      },
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.url) {
      return { success: true, url: data.url, filename: data.filename };
    }
    return { success: false, message: data.message || "Tải ảnh thất bại." };
  } catch (err) {
    return { success: false, message: "Lỗi kết nối tới máy chủ khi tải ảnh." };
  }
}

/**
 * High-performance Image Upload Field for Admin CMS
 */
export default function ImageUploadField({
  label,
  value,
  onChange,
  adminPassword,
  placeholder = "/uploads/ten-anh.jpg",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    const res = await uploadImageFile(file, adminPassword);
    setIsUploading(false);

    if (res.success) {
      onChange(res.url);
    } else {
      setErrorMsg(res.message || "Tải ảnh thất bại. Vui lòng thử lại.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs text-[#cba864] font-semibold block">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Preview Box */}
        <div className="relative w-14 h-14 rounded-lg bg-[#050d18] border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Xem trước"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">Trống</span>
          )}
        </div>

        {/* Input & Action Buttons */}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="admin-input flex-1 min-w-[180px] px-3 py-2 rounded text-xs"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="admin-btn-gold px-3.5 py-2 rounded text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5"
            title="Chọn file ảnh từ máy tính hoặc điện thoại để tải lên"
          >
            {isUploading ? (
              <>
                <span className="w-3 h-3 border-2 border-[#060e18] border-t-transparent rounded-full animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <span>Tải ảnh lên</span>
            )}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-2.5 py-2 text-slate-400 hover:text-rose-400 text-xs rounded border border-white/10 hover:border-rose-500/30 cursor-pointer"
              title="Xóa đường dẫn ảnh"
            >
              ✕
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={handleSelectFile}
            className="hidden"
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-rose-400 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
