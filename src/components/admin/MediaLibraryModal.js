"use client";

import { useState, useEffect, useRef } from "react";
import { uploadImageFile } from "./ImageUploadField";

export const DEFAULT_RESTAURANT_IMAGES = [
  { name: "the-view-sunset.jpg", title: "Hoàng Hôn Sông Hàn (Sunset)", url: "/images/the-view-sunset.jpg", category: "system" },
  { name: "the-view-night.jpg", title: "Đêm Tiệc & Cầu Rồng (Night)", url: "/images/the-view-night.jpg", category: "system" },
  { name: "the-view-daylight.jpg", title: "Khoáng Đạt Sông Hàn (Daylight)", url: "/images/the-view-daylight.jpg", category: "system" },
  { name: "sashimi.jpg", title: "Sashimi Thượng Hạng", url: "/images/sashimi.jpg", category: "system" },
  { name: "grilled-scallops.jpg", title: "Sò Điệp Nướng Bơ Tỏi", url: "/images/grilled-scallops.jpg", category: "system" },
  { name: "golden-prawns.jpg", title: "Tôm Sú Hoàng Kim", url: "/images/golden-prawns.jpg", category: "system" },
  { name: "nigiri.jpg", title: "Nigiri Master Set", url: "/images/nigiri.jpg", category: "system" },
  { name: "TheView-HorizontalLogo-01.png", title: "Logo Ngang Vàng Header", url: "/images/logo/TheView-HorizontalLogo-01.png", category: "logo" },
  { name: "TheView-Logo-White.png", title: "Logo Ngang Trắng", url: "/images/logo/TheView-Logo-White.png", category: "logo" },
  { name: "TheView-LogoSymbol.png", title: "Biểu Tượng Symbol", url: "/images/logo/TheView-LogoSymbol.png", category: "logo" },
  { name: "logo_vuong.png", title: "Logo Vuông Favicon", url: "/images/logo_vuong.png", category: "logo" },
];

export default function MediaLibraryModal({
  currentValue,
  onSelect,
  onClose,
  adminPassword,
  title = "Chọn hình ảnh",
}) {
  const [images, setImages] = useState(DEFAULT_RESTAURANT_IMAGES);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'uploads' | 'system'
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Fetch all images from API
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/upload.php?action=list");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.files) && data.files.length > 0) {
          // Merge API images with default list avoiding duplicates by url
          const map = new Map();
          // Put API files first
          data.files.forEach((f) => map.set(f.url, f));
          // Put default images if not in map
          DEFAULT_RESTAURANT_IMAGES.forEach((d) => {
            if (!map.has(d.url)) map.set(d.url, d);
          });
          setImages(Array.from(map.values()));
        }
      }
    } catch (err) {
      console.error("Fetch media library error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload handler
  const handleUploadNew = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const res = await uploadImageFile(file, adminPassword);
    setIsUploading(false);

    if (res.success && res.url) {
      // Auto select the newly uploaded image!
      onSelect(res.url);
    } else {
      setUploadError(res.message || "Tải ảnh thất bại. Vui lòng thử lại.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter images by active tab
  const filteredImages = images.filter((img) => {
    if (filterTab === "uploads") return img.category === "upload" || img.url.startsWith("/uploads/");
    if (filterTab === "system") return img.category !== "upload" && !img.url.startsWith("/uploads/");
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-[#081424] border border-[#cba864]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#0a1728]">
          <div>
            <span className="text-[10px] text-[#cba864] uppercase tracking-widest font-bold block">
              Thư Viện Hình Ảnh
            </span>
            <h3 className="font-serif text-lg text-white font-medium">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn-gold px-3.5 py-2 rounded text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-[#060e18] border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                <span>+ Tải ảnh mới từ máy</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              title="Đóng"
            >
              ✕
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleUploadNew}
              className="hidden"
            />
          </div>
        </div>

        {/* TAB FILTER & STATUS */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-white/10 bg-[#060e18] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                filterTab === "all"
                  ? "bg-[#cba864] text-[#060e18] font-bold"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Tất cả ảnh ({images.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterTab("uploads")}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                filterTab === "uploads"
                  ? "bg-[#cba864] text-[#060e18] font-bold"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Đã tải lên (/uploads/)
            </button>

            <button
              type="button"
              onClick={() => setFilterTab("system")}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                filterTab === "system"
                  ? "bg-[#cba864] text-[#060e18] font-bold"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Ảnh mẫu nhà hàng ({DEFAULT_RESTAURANT_IMAGES.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Click vào ảnh bất kỳ để chọn ngay
          </span>
        </div>

        {uploadError && (
          <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-500/40 text-rose-200 text-xs font-medium">
            {uploadError}
          </div>
        )}

        {/* IMAGE GRID */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto min-h-[300px]">
          {isLoading && images.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Đang tải danh sách ảnh...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <p className="text-sm text-slate-300">Chưa có ảnh nào trong mục này</p>
              <p className="text-xs text-slate-500">
                Bấm nút &quot;+ Tải ảnh mới từ máy&quot; phía trên để thêm ảnh vào hệ thống.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredImages.map((img, idx) => {
                const isSelected = currentValue === img.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelect(img.url)}
                    className={`group text-left p-2 rounded-xl border transition-all cursor-pointer relative flex flex-col ${
                      isSelected
                        ? "bg-[#cba864]/15 border-[#cba864] ring-2 ring-[#cba864]/50"
                        : "bg-[#060e18] border-white/10 hover:border-[#cba864]/60 hover:bg-[#0c1a2d]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video sm:aspect-square w-full rounded-lg overflow-hidden bg-[#040810] mb-2 flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={img.title || img.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#cba864] text-[#060e18] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Image Name & Badge */}
                    <div className="w-full">
                      <p
                        className="text-[11px] text-slate-200 font-medium truncate group-hover:text-[#cba864]"
                        title={img.title || img.name}
                      >
                        {img.title || img.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                        <span className="truncate">
                          {img.url.startsWith("/uploads/") ? "Tải lên" : "Mẫu sẵn"}
                        </span>
                        <span className="text-[#cba864] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Chọn →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#060e18] flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 truncate">
            {currentValue ? (
              <span>
                Đang chọn: <span className="text-[#cba864] font-mono text-[11px]">{currentValue}</span>
              </span>
            ) : (
              <span>Chưa có ảnh nào được chọn</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentValue && (
              <button
                type="button"
                onClick={() => onSelect("")}
                className="px-3 py-1.5 text-rose-400 hover:text-rose-300 rounded border border-rose-800/40 hover:bg-rose-950/40 cursor-pointer"
              >
                Gỡ bỏ ảnh
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary px-4 py-1.5 rounded text-xs font-medium cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
