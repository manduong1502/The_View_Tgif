"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060e18]/95 backdrop-blur-md border-b border-[#cba864]/20 shadow-2xl py-3"
          : "bg-gradient-to-b from-[#060e18]/90 via-[#060e18]/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:opacity-95"
          >
            <div className="relative h-10 sm:h-12 w-36 sm:w-44">
              <Image
                src={siteContent.brand.logoHorizontal}
                alt={siteContent.brand.name}
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteContent.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-200 hover:text-[#f3e2b8] transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#cba864] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTA Hotline & Button */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href={`tel:${siteContent.brand.hotline.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#cba864] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{siteContent.brand.hotlineDisplay}</span>
            </a>
            <a
              href="#dat-ban"
              className="btn-gold px-5 py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
            >
              {siteContent.hero.ctaPrimary}
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#dat-ban"
              className="btn-gold px-3.5 py-1.5 rounded-sm text-[11px] font-bold tracking-wide uppercase"
            >
              Đặt bàn
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#cba864]"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1625]/98 border-b border-[#cba864]/20 px-6 pt-4 pb-6 space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {siteContent.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-[#cba864] py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="#dat-ban"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-gold w-full text-center py-3 rounded-sm text-xs font-bold tracking-wider uppercase"
            >
              {siteContent.hero.ctaPrimary}
            </a>
            <a
              href={`tel:${siteContent.brand.hotline.replace(/\s+/g, "")}`}
              className="text-center text-xs text-slate-300 hover:text-[#cba864] py-1 flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Hotline giữ bàn: {siteContent.brand.hotline}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
