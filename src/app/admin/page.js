"use client";

import { useState, useEffect } from "react";
import { useContent } from "@/context/ContentContext";
import Link from "next/link";
import Image from "next/image";
import ImageUploadField, { uploadImageFile } from "@/components/admin/ImageUploadField";

export default function AdminDashboard() {
  const {
    content,
    updateContent,
    saveToServer,
    resetToDefault,
    exportJson,
    importJson,
    isLoaded,
  } = useContent();

  // Local draft state for editing
  const [formData, setFormData] = useState(content);
  const [activeTab, setActiveTab] = useState("brand");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [saveStatus, setSaveStatus] = useState({ state: "idle", message: "" });
  const [adminPassChange, setAdminPassChange] = useState({ current: "", newPass: "", confirm: "" });
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryUploadStatus, setGalleryUploadStatus] = useState("");

  const loadGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const res = await fetch("/api/upload.php?action=list");
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setGalleryImages(data.files);
      }
    } catch (e) {
      console.error("Gallery fetch error:", e);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (activeTab === "gallery") {
      loadGalleryImages();
    }
  }, [activeTab]);

  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryUploadStatus(`Đang tải lên 0/${files.length} ảnh...`);
    const currentPass = formData?.admin?.passwordHash || "theview@2026";
    let count = 0;
    for (const f of files) {
      const res = await uploadImageFile(f, currentPass);
      if (res.success) {
        count++;
        setGalleryUploadStatus(`Đang tải lên ${count}/${files.length} ảnh...`);
      }
    }
    setGalleryUploadStatus(`Hoàn tất! Đã tải lên ${count} ảnh vào thư mục /uploads/.`);
    await loadGalleryImages();
    setTimeout(() => setGalleryUploadStatus(""), 4000);
  };

  // Sync draft whenever context finishes initial loading
  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  // Check login session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("theview_admin_session");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = formData?.admin?.passwordHash || "theview@2026";
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("theview_admin_session", "true");
      setAuthError("");
    } else {
      setAuthError("Mật khẩu không chính xác! Vui lòng thử lại.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("theview_admin_session");
  };

  // Helper to update deeply nested keys in formData
  const handleFieldChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Helper for simple root-level sub-objects
  const handleNestedFieldChange = (section, subSection, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section]?.[subSection],
          [key]: value,
        },
      },
    }));
  };

  // Save changes
  const handleSave = async () => {
    setSaveStatus({ state: "saving", message: "Đang lưu lên máy chủ..." });
    const currentPass = formData?.admin?.passwordHash || "theview@2026";

    // 1. Update Context state
    updateContent(formData);

    // 2. Call Save to Server / LocalStorage
    const res = await saveToServer(currentPass);
    if (res.success) {
      setSaveStatus({
        state: "success",
        message: res.message || "Đã lưu thay đổi thành công!",
      });
      setTimeout(() => {
        setSaveStatus({ state: "idle", message: "" });
      }, 4000);
    } else {
      setSaveStatus({
        state: "error",
        message: res.message || "Lỗi lưu dữ liệu. Vui lòng kiểm tra lại kết nối mạng!",
      });
    }
  };

  // Dish management
  const handleDishChange = (index, field, value) => {
    setFormData((prev) => {
      const dishes = [...(prev.menu?.dishes || [])];
      dishes[index] = { ...dishes[index], [field]: value };
      return {
        ...prev,
        menu: { ...prev.menu, dishes },
      };
    });
  };

  const handleAddDish = () => {
    setFormData((prev) => {
      const dishes = [...(prev.menu?.dishes || [])];
      dishes.push({
        id: `dish-${Date.now()}`,
        name: "Món ăn mới",
        description: "Mô tả nguyên liệu và hương vị...",
        tag: "Món chính",
        image: "/images/sashimi.jpg",
        highlight: "Chef's Special",
        price: "350.000đ",
      });
      return {
        ...prev,
        menu: { ...prev.menu, dishes },
      };
    });
  };

  const handleDeleteDish = (index) => {
    if (!confirm("Bạn có chắc chắn muốn xóa món này không?")) return;
    setFormData((prev) => {
      const dishes = [...(prev.menu?.dishes || [])];
      dishes.splice(index, 1);
      return {
        ...prev,
        menu: { ...prev.menu, dishes },
      };
    });
  };

  // Review management
  const handleReviewChange = (index, field, value) => {
    setFormData((prev) => {
      const items = [...(prev.reviews?.items || [])];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        reviews: { ...prev.reviews, items },
      };
    });
  };

  const handleAddReview = () => {
    setFormData((prev) => {
      const items = [...(prev.reviews?.items || [])];
      items.push({
        quote: "Trải nghiệm tuyệt vời bên sông Hàn, không gian rất lãng mạn.",
        author: "Khách hàng thân thiết",
        role: "Thực khách tiệc tối",
        rating: 5,
      });
      return {
        ...prev,
        reviews: { ...prev.reviews, items },
      };
    });
  };

  const handleDeleteReview = (index) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
    setFormData((prev) => {
      const items = [...(prev.reviews?.items || [])];
      items.splice(index, 1);
      return {
        ...prev,
        reviews: { ...prev.reviews, items },
      };
    });
  };

  // FAQ management
  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const items = [...(prev.faqs?.items || [])];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        faqs: { ...prev.faqs, items },
      };
    });
  };

  const handleAddFaq = () => {
    setFormData((prev) => {
      const items = [...(prev.faqs?.items || [])];
      items.push({
        q: "Câu hỏi mới cần giải đáp?",
        a: "Nội dung trả lời chi tiết cho khách hàng...",
      });
      return {
        ...prev,
        faqs: { ...prev.faqs, items },
      };
    });
  };

  const handleDeleteFaq = (index) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) return;
    setFormData((prev) => {
      const items = [...(prev.faqs?.items || [])];
      items.splice(index, 1);
      return {
        ...prev,
        faqs: { ...prev.faqs, items },
      };
    });
  };

  // Import JSON handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const contentStr = event.target?.result;
      if (typeof contentStr === "string") {
        const res = importJson(contentStr);
        if (res.success) {
          alert("Đã khôi phục dữ liệu từ bản sao lưu thành công!");
        } else {
          alert("Lỗi: " + res.error);
        }
      }
    };
    reader.readAsText(file);
  };

  // Password change handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    const currentStoredPass = formData?.admin?.passwordHash || "theview@2026";
    if (adminPassChange.current !== currentStoredPass) {
      alert("Mật khẩu hiện tại không đúng!");
      return;
    }
    if (!adminPassChange.newPass || adminPassChange.newPass.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (adminPassChange.newPass !== adminPassChange.confirm) {
      alert("Xác nhận mật khẩu mới không khớp!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        passwordHash: adminPassChange.newPass,
      },
    }));
    alert("Đã đổi mật khẩu admin thành công! Hãy bấm 'LƯU TẤT CẢ THAY ĐỔI' phía trên để áp dụng.");
    setAdminPassChange({ current: "", newPass: "", confirm: "" });
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060e18] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="ambient-glow w-[500px] h-[500px] bg-[#cba864]/10 top-1/4 left-1/4" />

        <div className="admin-card max-w-md w-full rounded-2xl p-8 sm:p-10 border border-[#cba864]/40 shadow-2xl relative z-10 text-center">
          <div className="relative h-12 w-44 mx-auto mb-6">
            <Image
              src={formData?.brand?.logoHorizontal || "/images/logo/TheView-HorizontalLogo-01.png"}
              alt="The View"
              fill
              className="object-contain"
            />
          </div>

          <span className="kicker-line justify-center mb-3">HỆ THỐNG QUẢN TRỊ</span>
          <h1 className="font-serif text-2xl text-white font-normal mb-2">Đăng Nhập Quản Trị</h1>
          <p className="text-xs text-slate-300 font-light mb-6">
            Nhập mật khẩu để tùy chỉnh nội dung toàn diện website The View.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Nhập mật khẩu quản trị..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="admin-input w-full px-4 py-3 rounded-md text-sm text-center"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="admin-btn-gold w-full py-3 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Vào Bảng Điều Khiển →
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-[#cba864] transition-colors"
            >
              ← Quay lại trang chủ The View
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD RENDER
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#060e18] text-slate-100 flex flex-col font-sans selection:bg-[#cba864] selection:text-[#060e18]">
      {/* TOP NOTIFICATION / SAVE STATUS BANNER */}
      {saveStatus.state !== "idle" && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 border text-xs font-semibold backdrop-blur-md animate-in slide-in-from-top-4 duration-300 ${
            saveStatus.state === "saving"
              ? "bg-blue-950/90 border-blue-500/40 text-blue-200"
              : saveStatus.state === "success"
              ? "bg-emerald-950/95 border-emerald-500/50 text-emerald-200 shadow-emerald-900/40"
              : "bg-rose-950/95 border-rose-500/50 text-rose-200"
          }`}
        >
          {saveStatus.state === "saving" && (
            <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
          {saveStatus.state === "success" && <span className="font-bold">✓</span>}
          {saveStatus.state === "error" && <span className="font-bold">!</span>}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#071322]/95 backdrop-blur-xl border-b border-[#cba864]/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 group" title="Xem website">
            <div className="relative h-8 w-28 sm:w-36">
              <Image
                src={formData?.brand?.logoHorizontal || "/images/logo/TheView-HorizontalLogo-01.png"}
                alt="The View"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="text-[10px] bg-[#cba864]/15 text-[#f3e2b8] px-2.5 py-0.5 rounded tracking-widest font-semibold border border-[#cba864]/30 uppercase hidden sm:inline-block">
              Quản Trị CMS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="admin-btn-secondary px-3 sm:px-4 py-2 rounded text-xs font-medium flex items-center gap-1.5"
          >
            <span>Xem website ↗</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus.state === "saving"}
            className="admin-btn-gold px-4 sm:px-6 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#cba864]/20 cursor-pointer"
          >
            <span>{saveStatus.state === "saving" ? "Đang lưu..." : "Lưu tất cả"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 text-slate-400 hover:text-rose-400 text-xs rounded border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER: SIDEBAR TABS + CONTENT FORM */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-3 space-y-1.5 sticky top-24">
          {[
            { id: "brand", label: "Thương hiệu & Hotline", num: "01" },
            { id: "hero", label: "Hero Banner", num: "02" },
            { id: "moments", label: "3 Thời khắc đón khách", num: "03" },
            { id: "experience", label: "Không gian & Khu vực", num: "04" },
            { id: "menu", label: "Thực đơn & Món ăn", num: "05" },
            { id: "nightlife", label: "Về đêm & Cầu Rồng", num: "06" },
            { id: "events", label: "Tiệc riêng & Sự kiện", num: "07" },
            { id: "reviews", label: "Đánh giá thực khách", num: "08" },
            { id: "faqs", label: "Câu hỏi thường gặp", num: "09" },
            { id: "booking", label: "Đặt bàn & Chân trang", num: "10" },
            { id: "settings", label: "Cài đặt & Mật khẩu", num: "11" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors duration-100 flex items-center justify-between cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#cba864] text-[#060e18] font-bold shadow-md shadow-[#cba864]/20"
                  : "bg-[#091524] text-slate-300 hover:bg-[#0f2137] hover:text-white border border-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    activeTab === tab.id
                      ? "bg-[#060e18]/20 text-[#060e18] font-bold"
                      : "bg-white/5 text-[#cba864]"
                  }`}
                >
                  {tab.num}
                </span>
                <span>{tab.label}</span>
              </span>
              <span className="text-[11px] opacity-40">→</span>
            </button>
          ))}
        </div>

        {/* MAIN EDITING FORM PANEL */}
        <div className="lg:col-span-9 admin-card rounded-2xl p-6 sm:p-8 border border-[#cba864]/25 shadow-2xl">
          {/* TAB 1: BRAND */}
          {activeTab === "brand" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Thương Hiệu & Thông Tin Liên Hệ</h2>
                <p className="text-xs text-slate-300 mt-1">Thông tin cơ bản hiển thị trên Navbar, Footer và các mục liên hệ.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tên thương hiệu</label>
                  <input
                    type="text"
                    value={formData.brand?.name || ""}
                    onChange={(e) => handleFieldChange("brand", "name", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Slogan / Tagline</label>
                  <input
                    type="text"
                    value={formData.brand?.tagline || ""}
                    onChange={(e) => handleFieldChange("brand", "tagline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Hotline đặt bàn</label>
                  <input
                    type="text"
                    value={formData.brand?.hotline || ""}
                    onChange={(e) => handleFieldChange("brand", "hotline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Hotline hiển thị</label>
                  <input
                    type="text"
                    value={formData.brand?.hotlineDisplay || ""}
                    onChange={(e) => handleFieldChange("brand", "hotlineDisplay", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.brand?.address || ""}
                    onChange={(e) => handleFieldChange("brand", "address", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Mô tả vị trí (Phụ)</label>
                  <input
                    type="text"
                    value={formData.brand?.addressDetail || ""}
                    onChange={(e) => handleFieldChange("brand", "addressDetail", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Khung giờ hoạt động</label>
                  <input
                    type="text"
                    value={formData.brand?.hours || ""}
                    onChange={(e) => handleFieldChange("brand", "hours", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Ngày phục vụ</label>
                  <input
                    type="text"
                    value={formData.brand?.days || ""}
                    onChange={(e) => handleFieldChange("brand", "days", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Link Facebook Fanpage</label>
                  <input
                    type="text"
                    value={formData.brand?.fanpageUrl || ""}
                    onChange={(e) => handleFieldChange("brand", "fanpageUrl", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Link Google Maps</label>
                  <input
                    type="text"
                    value={formData.brand?.mapUrl || ""}
                    onChange={(e) => handleFieldChange("brand", "mapUrl", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Đường dẫn Logo Ngang (Header)</label>
                  <input
                    type="text"
                    value={formData.brand?.logoHorizontal || ""}
                    onChange={(e) => handleFieldChange("brand", "logoHorizontal", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Đường dẫn Logo Vuông (Favicon/Icon)</label>
                  <input
                    type="text"
                    value={formData.brand?.logoSquare || ""}
                    onChange={(e) => handleFieldChange("brand", "logoSquare", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Hero Banner (Đầu Trang)</h2>
                <p className="text-xs text-slate-300 mt-1">Nội dung tiêu đề lớn, đoạn mở đầu và các nút kêu gọi hành động.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Kicker (Dòng chữ nhỏ trên cùng)</label>
                  <input
                    type="text"
                    value={formData.hero?.kicker || ""}
                    onChange={(e) => handleFieldChange("hero", "kicker", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tiêu đề Dòng 1</label>
                    <input
                      type="text"
                      value={formData.hero?.titleLine1 || ""}
                      onChange={(e) => handleFieldChange("hero", "titleLine1", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Dòng 2 Nổi Bật (Màu vàng)</label>
                    <input
                      type="text"
                      value={formData.hero?.titleLine2Highlight || ""}
                      onChange={(e) => handleFieldChange("hero", "titleLine2Highlight", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm text-[#cba864] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Dòng 2 Phần Còn Lại</label>
                    <input
                      type="text"
                      value={formData.hero?.titleLine2Rest || ""}
                      onChange={(e) => handleFieldChange("hero", "titleLine2Rest", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Đoạn văn giới thiệu chính</label>
                  <textarea
                    rows={3}
                    value={formData.hero?.description || ""}
                    onChange={(e) => handleFieldChange("hero", "description", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Nút CTA Chính (Màu Vàng)</label>
                    <input
                      type="text"
                      value={formData.hero?.ctaPrimary || ""}
                      onChange={(e) => handleFieldChange("hero", "ctaPrimary", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Nút CTA Phụ (Thực đơn)</label>
                    <input
                      type="text"
                      value={formData.hero?.ctaSecondary || ""}
                      onChange={(e) => handleFieldChange("hero", "ctaSecondary", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>
                </div>

                {/* 3 Stats */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs text-[#cba864] font-semibold block mb-3">3 Thẻ Thống Kê Dưới Banner</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(formData.hero?.stats || []).map((stat, idx) => (
                      <div key={idx} className="p-3 bg-[#081524] rounded-lg border border-white/5 space-y-2">
                        <label className="text-[11px] text-slate-400">Thẻ {idx + 1}</label>
                        <input
                          type="text"
                          placeholder="Chỉ số (vd: TẦNG TRỆT)"
                          value={stat.value}
                          onChange={(e) => {
                            const stats = [...(formData.hero?.stats || [])];
                            stats[idx] = { ...stats[idx], value: e.target.value };
                            handleFieldChange("hero", "stats", stats);
                          }}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs text-[#cba864] font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả"
                          value={stat.label}
                          onChange={(e) => {
                            const stats = [...(formData.hero?.stats || [])];
                            stats[idx] = { ...stats[idx], label: e.target.value };
                            handleFieldChange("hero", "stats", stats);
                          }}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOMENTS */}
          {activeTab === "moments" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">3 Khoảnh Khắc Thực Tế (Moments)</h2>
                <p className="text-xs text-slate-300 mt-1">Chỉnh sửa 3 mốc Hoàng Hôn, Về Đêm và Ban Ngày chuyển đổi ảnh trên Hero.</p>
              </div>

              <div className="space-y-6">
                {(formData.moments || []).map((moment, idx) => (
                  <div key={moment.id} className="p-4 sm:p-5 bg-[#091626] rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#cba864] uppercase tracking-wider">
                        Khoảnh Khắc {idx + 1}: {moment.shortLabel} ({moment.id})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Tên nhãn dài</label>
                        <input
                          type="text"
                          value={moment.label}
                          onChange={(e) => {
                            const moments = [...(formData.moments || [])];
                            moments[idx] = { ...moments[idx], label: e.target.value };
                            setFormData((prev) => ({ ...prev, moments }));
                          }}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Tên nút chọn ngắn</label>
                        <input
                          type="text"
                          value={moment.shortLabel}
                          onChange={(e) => {
                            const moments = [...(formData.moments || [])];
                            moments[idx] = { ...moments[idx], shortLabel: e.target.value };
                            setFormData((prev) => ({ ...prev, moments }));
                          }}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Huy hiệu Badge</label>
                        <input
                          type="text"
                          value={moment.badge}
                          onChange={(e) => {
                            const moments = [...(formData.moments || [])];
                            moments[idx] = { ...moments[idx], badge: e.target.value };
                            setFormData((prev) => ({ ...prev, moments }));
                          }}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Tiêu đề khoảnh khắc</label>
                        <input
                          type="text"
                          value={moment.headline}
                          onChange={(e) => {
                            const moments = [...(formData.moments || [])];
                            moments[idx] = { ...moments[idx], headline: e.target.value };
                            setFormData((prev) => ({ ...prev, moments }));
                          }}
                          className="admin-input w-full px-3 py-2 rounded text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Đường dẫn hình ảnh thực tế</label>
                        <input
                          type="text"
                          value={moment.image}
                          onChange={(e) => {
                            const moments = [...(formData.moments || [])];
                            moments[idx] = { ...moments[idx], image: e.target.value };
                            setFormData((prev) => ({ ...prev, moments }));
                          }}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Mô tả trải nghiệm</label>
                      <textarea
                        rows={2}
                        value={moment.description}
                        onChange={(e) => {
                          const moments = [...(formData.moments || [])];
                          moments[idx] = { ...moments[idx], description: e.target.value };
                          setFormData((prev) => ({ ...prev, moments }));
                        }}
                        className="admin-input w-full px-3 py-2 rounded text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Không Gian & Khu Vực (Experience)</h2>
                <p className="text-xs text-slate-300 mt-1">Chỉnh sửa nội dung phần giới thiệu không gian thực tế du thuyền và các khu vực.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Kicker</label>
                  <input
                    type="text"
                    value={formData.experience?.kicker || ""}
                    onChange={(e) => handleFieldChange("experience", "kicker", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tiêu đề lớn</label>
                  <textarea
                    rows={2}
                    value={formData.experience?.headline || ""}
                    onChange={(e) => handleFieldChange("experience", "headline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm font-serif"
                  />
                </div>

                {/* 3 Zones */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <span className="text-xs text-[#cba864] font-semibold block">3 Khu Vực Chỗ Ngồi (Zones)</span>
                  {(formData.experience?.zones || []).map((zone, idx) => (
                    <div key={zone.id} className="p-4 bg-[#081524] rounded-xl border border-white/5 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Mã không gian</label>
                          <input
                            type="text"
                            value={zone.number}
                            onChange={(e) => {
                              const zones = [...(formData.experience?.zones || [])];
                              zones[idx] = { ...zones[idx], number: e.target.value };
                              handleFieldChange("experience", "zones", zones);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs text-[#cba864]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Tên khu vực</label>
                          <input
                            type="text"
                            value={zone.title}
                            onChange={(e) => {
                              const zones = [...(formData.experience?.zones || [])];
                              zones[idx] = { ...zones[idx], title: e.target.value };
                              handleFieldChange("experience", "zones", zones);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Sức chứa</label>
                          <input
                            type="text"
                            value={zone.capacity}
                            onChange={(e) => {
                              const zones = [...(formData.experience?.zones || [])];
                              zones[idx] = { ...zones[idx], capacity: e.target.value };
                              handleFieldChange("experience", "zones", zones);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Huy hiệu</label>
                          <input
                            type="text"
                            value={zone.badge}
                            onChange={(e) => {
                              const zones = [...(formData.experience?.zones || [])];
                              zones[idx] = { ...zones[idx], badge: e.target.value };
                              handleFieldChange("experience", "zones", zones);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Đường dẫn ảnh</label>
                          <input
                            type="text"
                            value={zone.image}
                            onChange={(e) => {
                              const zones = [...(formData.experience?.zones || [])];
                              zones[idx] = { ...zones[idx], image: e.target.value };
                              handleFieldChange("experience", "zones", zones);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Mô tả khu vực</label>
                        <textarea
                          rows={2}
                          value={zone.description}
                          onChange={(e) => {
                            const zones = [...(formData.experience?.zones || [])];
                            zones[idx] = { ...zones[idx], description: e.target.value };
                            handleFieldChange("experience", "zones", zones);
                          }}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MENU & DISHES */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-white">Thực Đơn Tuyển Chọn (Menu)</h2>
                  <p className="text-xs text-slate-300 mt-1">Thêm, sửa, xóa các món ăn nổi bật và phân loại.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDish}
                  className="admin-btn-gold px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Thêm món mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tiêu đề mục Menu</label>
                  <input
                    type="text"
                    value={formData.menu?.headline || ""}
                    onChange={(e) => handleFieldChange("menu", "headline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm font-serif"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Mô tả ngắn</label>
                  <input
                    type="text"
                    value={formData.menu?.description || ""}
                    onChange={(e) => handleFieldChange("menu", "description", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>
              </div>

              {/* Dish List */}
              <div className="space-y-4 pt-2">
                {(formData.menu?.dishes || []).map((dish, idx) => (
                  <div
                    key={dish.id || idx}
                    className="p-4 sm:p-5 bg-[#091728] rounded-xl border border-white/10 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-[#cba864]">
                        Món #{idx + 1}: {dish.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/40 cursor-pointer"
                      >
                        Xóa món
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Tên món ăn</label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => handleDishChange(idx, "name", e.target.value)}
                          className="admin-input w-full px-3 py-2 rounded text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Giá bán</label>
                        <input
                          type="text"
                          value={dish.price}
                          onChange={(e) => handleDishChange(idx, "price", e.target.value)}
                          className="admin-input w-full px-3 py-2 rounded text-xs text-[#cba864] font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Phân loại (Tag)</label>
                        <input
                          type="text"
                          placeholder="vd: Khai vị, Món chính, Signature"
                          value={dish.tag}
                          onChange={(e) => handleDishChange(idx, "tag", e.target.value)}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Nhãn Highlight (Badge)</label>
                        <input
                          type="text"
                          placeholder="vd: Chef's Special, Tươi sống 100%"
                          value={dish.highlight}
                          onChange={(e) => handleDishChange(idx, "highlight", e.target.value)}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Đường dẫn hình ảnh</label>
                        <input
                          type="text"
                          value={dish.image}
                          onChange={(e) => handleDishChange(idx, "image", e.target.value)}
                          className="admin-input w-full px-3 py-2 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Mô tả món ăn & hương vị</label>
                      <textarea
                        rows={2}
                        value={dish.description}
                        onChange={(e) => handleDishChange(idx, "description", e.target.value)}
                        className="admin-input w-full px-3 py-2 rounded text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NIGHTLIFE */}
          {activeTab === "nightlife" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Về Đêm & Cầu Rồng (Nightlife)</h2>
                <p className="text-xs text-slate-300 mt-1">Nội dung trải nghiệm ngắm Cầu Rồng phun lửa, pháo hoa và cocktail.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tiêu đề lớn</label>
                  <textarea
                    rows={2}
                    value={formData.nightlife?.headline || ""}
                    onChange={(e) => handleFieldChange("nightlife", "headline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm font-serif"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Đoạn văn giới thiệu</label>
                  <textarea
                    rows={2}
                    value={formData.nightlife?.description || ""}
                    onChange={(e) => handleFieldChange("nightlife", "description", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 space-y-4">
                  <span className="text-xs text-[#cba864] font-semibold block">3 Mốc Trải Nghiệm Về Đêm</span>
                  {(formData.nightlife?.items || []).map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#081524] rounded-xl border border-white/5 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Thời gian (vd: T7 & CN, 21:00)</label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => {
                              const items = [...(formData.nightlife?.items || [])];
                              items[idx] = { ...items[idx], time: e.target.value };
                              handleFieldChange("nightlife", "items", items);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs text-[#cba864] font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Tiêu đề mốc</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const items = [...(formData.nightlife?.items || [])];
                              items[idx] = { ...items[idx], title: e.target.value };
                              handleFieldChange("nightlife", "items", items);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Mô tả trải nghiệm</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const items = [...(formData.nightlife?.items || [])];
                            items[idx] = { ...items[idx], description: e.target.value };
                            handleFieldChange("nightlife", "items", items);
                          }}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Tiệc Riêng & Sự Kiện (Events)</h2>
                <p className="text-xs text-slate-300 mt-1">3 gói sự kiện: Tiệc lãng mạn, Tiệc doanh nghiệp và Set menu đoàn.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Tiêu đề lớn</label>
                  <textarea
                    rows={2}
                    value={formData.events?.headline || ""}
                    onChange={(e) => handleFieldChange("events", "headline", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm font-serif"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 space-y-4">
                  {(formData.events?.cards || []).map((card, idx) => (
                    <div key={idx} className="p-4 bg-[#081524] rounded-xl border border-white/5 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Tên gói sự kiện</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const cards = [...(formData.events?.cards || [])];
                              cards[idx] = { ...cards[idx], title: e.target.value };
                              handleFieldChange("events", "cards", cards);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Nút bấm CTA</label>
                          <input
                            type="text"
                            value={card.cta}
                            onChange={(e) => {
                              const cards = [...(formData.events?.cards || [])];
                              cards[idx] = { ...cards[idx], cta: e.target.value };
                              handleFieldChange("events", "cards", cards);
                            }}
                            className="admin-input w-full px-3 py-1.5 rounded text-xs text-[#cba864]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Mô tả chi tiết</label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => {
                            const cards = [...(formData.events?.cards || [])];
                            cards[idx] = { ...cards[idx], description: e.target.value };
                            handleFieldChange("events", "cards", cards);
                          }}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-white">Đánh Giá Thực Khách (Reviews)</h2>
                  <p className="text-xs text-slate-300 mt-1">Thêm / sửa / xóa các phản hồi, lời khen từ thực khách.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddReview}
                  className="admin-btn-gold px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Thêm đánh giá</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.reviews?.items || []).map((rev, idx) => (
                  <div key={idx} className="p-4 bg-[#081524] rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-[#cba864]">Đánh giá #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/40 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Tên khách hàng</label>
                        <input
                          type="text"
                          value={rev.author}
                          onChange={(e) => handleReviewChange(idx, "author", e.target.value)}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Vai trò / Dịp tiệc</label>
                        <input
                          type="text"
                          value={rev.role}
                          onChange={(e) => handleReviewChange(idx, "role", e.target.value)}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Số sao (1 - 5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={rev.rating || 5}
                          onChange={(e) => handleReviewChange(idx, "rating", parseInt(e.target.value) || 5)}
                          className="admin-input w-full px-3 py-1.5 rounded text-xs text-[#cba864] font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Nội dung đánh giá</label>
                      <textarea
                        rows={3}
                        value={rev.quote}
                        onChange={(e) => handleReviewChange(idx, "quote", e.target.value)}
                        className="admin-input w-full px-3 py-2 rounded text-xs leading-relaxed italic"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-white">Câu Hỏi Thường Gặp (FAQ)</h2>
                  <p className="text-xs text-slate-300 mt-1">Thêm / sửa / xóa các câu hỏi giải đáp thông tin trải nghiệm.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="admin-btn-gold px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Thêm câu hỏi</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.faqs?.items || []).map((faq, idx) => (
                  <div key={idx} className="p-4 bg-[#081524] rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-[#cba864]">Câu hỏi #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/40 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Câu hỏi (Q)</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                        className="admin-input w-full px-3 py-2 rounded text-xs font-semibold text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Câu trả lời (A)</label>
                      <textarea
                        rows={3}
                        value={faq.a}
                        onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                        className="admin-input w-full px-3 py-2 rounded text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: BOOKING & FOOTER */}
          {activeTab === "booking" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Đặt Bàn & Chân Trang (Footer)</h2>
                <p className="text-xs text-slate-300 mt-1">Cấu hình danh sách số lượng khách, loại tiệc và thông tin bản quyền.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Giới thiệu ngắn Chân trang (Footer About)</label>
                  <textarea
                    rows={2}
                    value={formData.footer?.about || ""}
                    onChange={(e) => handleFieldChange("footer", "about", e.target.value)}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Dòng bản quyền Copyright</label>
                    <input
                      type="text"
                      value={formData.footer?.copyright || ""}
                      onChange={(e) => handleFieldChange("footer", "copyright", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#cba864] font-semibold block mb-1.5">Subtext chân trang</label>
                    <input
                      type="text"
                      value={formData.footer?.subtext || ""}
                      onChange={(e) => handleFieldChange("footer", "subtext", e.target.value)}
                      className="admin-input w-full px-3.5 py-2.5 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <label className="text-xs text-[#cba864] font-semibold block mb-2">Tùy chọn số lượng khách (Mỗi dòng 1 mục)</label>
                  <textarea
                    rows={4}
                    value={(formData.booking?.guestOptions || []).join("\n")}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                      handleFieldChange("booking", "guestOptions", lines);
                    }}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#cba864] font-semibold block mb-2">Tùy chọn loại bàn / sự kiện (Mỗi dòng 1 mục)</label>
                  <textarea
                    rows={4}
                    value={(formData.booking?.partyTypes || []).join("\n")}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                      handleFieldChange("booking", "partyTypes", lines);
                    }}
                    className="admin-input w-full px-3.5 py-2.5 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

                    {/* TAB 11: GALLERY & UPLOADS */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-white">Thư Viện Hình Ảnh</h2>
                  <p className="text-xs text-slate-300 mt-1">Quản lý và tải ảnh trực tiếp từ thiết bị vào thư mục uploads của hệ thống.</p>
                </div>

                <div>
                  <label className="admin-btn-gold px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2">
                    <span>Tải ảnh mới vào thư viện ↑</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBatchUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {galleryUploadStatus && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-medium">
                  {galleryUploadStatus}
                </div>
              )}

              {/* Image Grid */}
              {isLoadingGallery ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Đang tải danh sách ảnh...
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="py-12 px-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-3">
                  <p className="text-sm text-slate-300 font-medium">Chưa có ảnh nào trong thư mục tải lên</p>
                  <p className="text-xs text-slate-400">Bấm nút &quot;Tải ảnh mới vào thư viện&quot; phía trên hoặc tải ảnh trực tiếp ở các mục thực đơn/khu vực để đưa ảnh vào hệ thống.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#091728] rounded-xl border border-white/10 space-y-2"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#050d18]">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-200 font-medium truncate" title={img.name}>
                          {img.name}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{(img.size / 1024).toFixed(0)} KB</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(img.url);
                              alert("Đã sao chép đường dẫn: " + img.url);
                            }}
                            className="text-[#cba864] hover:underline cursor-pointer font-semibold"
                          >
                            Sao chép link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 11: SETTINGS & BACKUP */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl text-white">Cài Đặt Hệ Thống & Mật Khẩu</h2>
                <p className="text-xs text-slate-300 mt-1">Đổi mật khẩu tài khoản quản trị và các tùy chọn sao lưu an toàn.</p>
              </div>

              {/* CHANGE PASSWORD */}
              <div className="p-5 bg-[#091728] rounded-xl border border-white/10 space-y-4">
                <h3 className="font-serif text-base text-[#cba864] font-medium">Đổi Mật Khẩu Quản Trị</h3>
                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      required
                      value={adminPassChange.current}
                      onChange={(e) => setAdminPassChange((p) => ({ ...p, current: e.target.value }))}
                      className="admin-input w-full px-3 py-2 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                    <input
                      type="password"
                      required
                      value={adminPassChange.newPass}
                      onChange={(e) => setAdminPassChange((p) => ({ ...p, newPass: e.target.value }))}
                      className="admin-input w-full px-3 py-2 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Nhập lại mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={adminPassChange.confirm}
                      onChange={(e) => setAdminPassChange((p) => ({ ...p, confirm: e.target.value }))}
                      className="admin-input w-full px-3 py-2 rounded text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="admin-btn-gold px-4 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cập Nhật Mật Khẩu
                  </button>
                </form>
              </div>

              {/* BACKUP & RESTORE */}
              <div className="p-5 bg-[#091728] rounded-xl border border-white/10 space-y-4">
                <h3 className="font-serif text-base text-[#cba864] font-medium">Sao Lưu & Khôi Phục Dữ Liệu</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bạn có thể tải về bản sao lưu toàn bộ nội dung website về máy tính cá nhân để lưu trữ an toàn, hoặc tải lên bản sao lưu đã lưu trước đó để phục hồi nội dung bất cứ lúc nào.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={exportJson}
                    className="admin-btn-gold px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Tải bản sao lưu về máy
                  </button>

                  <label className="admin-btn-secondary px-4 py-2.5 rounded text-xs font-medium cursor-pointer hover:border-[#cba864]">
                    Khôi phục từ bản sao lưu
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* FACTORY RESET */}
              <div className="p-5 bg-rose-950/20 rounded-xl border border-rose-800/30 space-y-3">
                <h3 className="font-serif text-base text-rose-400 font-medium">Khôi Phục Mặc Định Ban Đầu</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Thao tác này sẽ xóa tất cả các thay đổi tùy chỉnh và đưa nội dung website quay về bản thiết kế gốc ban đầu.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về mặc định ban đầu không? Mọi nội dung đã chỉnh sửa sẽ bị xóa.")) {
                      resetToDefault();
                      alert("Đã khôi phục dữ liệu gốc thành công!");
                    }
                  }}
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 cursor-pointer transition-colors"
                >
                  Khôi Phục Mặc Định Ban Đầu
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM QUICK SAVE ACTION BUTTON */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Nhấn <strong className="text-[#cba864]">LƯU TẤT CẢ THAY ĐỔI</strong> để áp dụng ngay lên website.
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus.state === "saving"}
              className="admin-btn-gold px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#cba864]/25 cursor-pointer"
            >
              <span>{saveStatus.state === "saving" ? "Đang lưu lên máy chủ..." : "LƯU TẤT CẢ THAY ĐỔI"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
