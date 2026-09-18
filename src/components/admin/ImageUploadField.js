"use client";

import { useState, useRef } from "react";
import MediaLibraryModal from "./MediaLibraryModal";

/**
 * Upload image to cPanel /api/upload.php
 */
export async function uploadImageFile(file, adminPassword) {
  // 1. Read file as base64 first (guarantees local availability)
  const fileBase64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

  // 2. Try PHP cPanel endpoint if in production
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (adminPassword) {
      formData.append("_adminPassword", adminPassword);
    }

    const res = await fetch("/api/upload.php", {
      method: "POST",
      headers: {
        "X-Admin-Password": adminPassword || "theview@2026",
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("json")) {
      const data = await res.json();
      if (data.success && data.url) {
        return { success: true, url: data.url, filename: data.filename };
      }
    }
  } catch (err) {
    // Continue to local dev upload
  }

  // 3. Try local dev upload server (port 3002) to save directly into /public/uploads/ on disk
  if (fileBase64) {
    try {
      const resDev = await fetch("http://localhost:3002/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, data: fileBase64 }),
      });
      if (resDev.ok) {
        const dataDev = await resDev.json();
        if (dataDev.success && dataDev.url) {
          return { success: true, url: dataDev.url, filename: dataDev.filename };
        }
      }
    } catch (e) {
      // Dev server on port 3002 not available
    }
  }

  // 4. Guaranteed local fallback: use base64 data URL
  if (fileBase64) {
    try {
      const existing = JSON.parse(localStorage.getItem("theview_local_uploads") || "[]");
      existing.unshift({
        name: file.name,
        url: fileBase64,
        size: file.size,
        time: Math.floor(Date.now() / 1000),
        category: "upload",
      });
      localStorage.setItem("theview_local_uploads", JSON.stringify(existing.slice(0, 30)));
    } catch (e) {}

    return {
      success: true,
      url: fileBase64,
      filename: file.name,
    };
  }

  return { success: false, message: "Không thể đọc file ảnh từ thiết bị." };
}

/**
 * Foolproof Image Field for Admin CMS:
 * Users can either pick from the full visual Media Library OR upload directly.
 */
export default function ImageUploadField({
  label,
  value,
  onChange,
  adminPassword,
  placeholder = "Chưa có ảnh",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleDirectUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    const res = await uploadImageFile(file, adminPassword);
    setIsUploading(false);

    if (res.success && res.url) {
      onChange(res.url);
    } else {
      setErrorMsg(res.message || "Tải ảnh thất bại. Vui lòng thử lại.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs text-[#cba864] font-semibold block">
          {label}
        </label>
      )}

      <div className="p-3 bg-[#060e18] border border-white/10 rounded-xl flex items-center gap-3">
        {/* Thumbnail Preview (Clickable to open library) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#0a1728] border border-white/15 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group hover:border-[#cba864] transition-colors"
          title="Click để chọn ảnh từ thư viện"
        >
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
            <div className="text-center p-1">
              <span className="text-xs text-[#cba864] block font-bold">+</span>
              <span className="text-[9px] text-slate-400 block">Chọn ảnh</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-medium transition-opacity">
            Đổi ảnh
          </div>
        </button>

        {/* Info & Action Buttons */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs text-slate-300 font-medium truncate block"
              title={value || placeholder}
            >
              {value ? value : <span className="text-slate-500 italic">{placeholder}</span>}
            </span>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[11px] text-slate-400 hover:text-rose-400 cursor-pointer shrink-0"
                title="Gỡ ảnh này"
              >
                Gỡ ảnh
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="admin-btn-gold px-3 py-1.5 rounded text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <span>🖼️ Chọn từ thư viện ảnh</span>
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn-secondary px-3 py-1.5 rounded text-xs font-medium cursor-pointer flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <span>Tải ảnh mới từ máy ↑</span>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleDirectUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-rose-400 font-medium">{errorMsg}</p>
      )}

      {/* Media Library Modal */}
      {isModalOpen && (
        <MediaLibraryModal
          currentValue={value}
          onSelect={(url) => {
            onChange(url);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          adminPassword={adminPassword}
          title={label || "Chọn hình ảnh"}
        />
      )}
    </div>
  );
}
