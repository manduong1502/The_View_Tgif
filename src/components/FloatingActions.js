"use client";

import { useState, useEffect } from "react";
import { siteContent } from "@/data/content";

export default function FloatingActions() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#08111c]/95 backdrop-blur-lg border-t border-white/10 p-3 sm:hidden flex items-center gap-3">
        <a
          href={`tel:${siteContent.brand.hotline.replace(/\s+/g, "")}`}
          className="flex-1 py-2.5 px-3 rounded-sm border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 bg-white/5 active:bg-white/10"
        >
          <svg className="w-4 h-4 text-[#cba864]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Gọi Hotline</span>
        </a>
        <a
          href="#dat-ban"
          className="flex-1 py-2.5 px-3 rounded-sm btn-gold text-xs font-bold uppercase tracking-wider flex items-center justify-center"
        >
          <span>Đặt Bàn Ngay</span>
        </a>
      </div>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Về đầu trang"
          className="fixed bottom-16 sm:bottom-8 right-5 z-40 w-10 h-10 rounded-full bg-[#102136]/90 border border-[#cba864]/40 text-[#cba864] flex items-center justify-center shadow-lg hover:bg-[#cba864] hover:text-[#08111c] transition-all backdrop-blur-md group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
