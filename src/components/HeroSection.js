"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";

export default function HeroSection() {
  const { hero, moments } = siteContent;
  const [activeMomentId, setActiveMomentId] = useState("sunset");

  const currentMoment =
    moments.find((m) => m.id === activeMomentId) || moments[0];

  return (
    <section className="relative min-h-[96vh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-10 overflow-hidden">
      {/* Background Images with Cross-fade & Luxury Dark Navy Overlays */}
      <div className="absolute inset-0 z-0">
        {moments.map((moment) => (
          <div
            key={moment.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              moment.id === activeMomentId ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            } transform transition-transform duration-1000`}
          >
            <Image
              src={moment.image}
              alt={`${siteContent.brand.name} - ${moment.headline}`}
              fill
              priority={moment.id === "sunset"}
              className="object-cover object-center"
              quality={95}
            />
          </div>
        ))}

        {/* Multi-layered Deep Navy & Champagne Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e18]/95 via-[#060e18]/80 to-[#060e18]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e18] via-[#060e18]/30 to-[#060e18]/80" />
        <div className="absolute inset-0 bg-[#060e18]/30 backdrop-brightness-95" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-8 max-w-2xl">
            {/* Kicker Line */}
            <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span className="kicker-line text-xs sm:text-sm tracking-[0.22em]">
                {hero.kicker}
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.18] sm:leading-[1.12] mb-5 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {hero.titleLine1} <br />
              <span className="italic font-serif text-gold-gradient font-light drop-shadow-md">
                {hero.titleLine2Highlight}
              </span>{" "}
              {hero.titleLine2Rest}
            </h1>

            {/* Subtitle description */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-7 sm:mb-9 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              {hero.description}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <a
                href="#dat-ban"
                className="btn-gold px-8 py-4 rounded-sm text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-3 group"
              >
                <span>{hero.ctaPrimary}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                  →
                </span>
              </a>
              <a
                href="#thuc-don"
                className="btn-glass px-7 py-4 rounded-sm text-xs sm:text-sm font-medium tracking-wider uppercase"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Real Experience Time Switcher Card */}
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <div className="luxury-card rounded-xl p-5 sm:p-6 border border-[#cba864]/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-widest text-[#f3e2b8] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#cba864] animate-ping" />
                  Góc Nhìn Thực Tế
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {currentMoment.badge}
                </span>
              </div>

              <h2 className="font-serif text-lg text-white font-medium mb-2">
                {currentMoment.headline}
              </h2>
              <p className="text-xs text-slate-300 font-light leading-relaxed mb-5">
                {currentMoment.description}
              </p>

              {/* Moment Switcher Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#060e18]/80 rounded-lg border border-white/10">
                {moments.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMomentId(m.id)}
                    className={`py-2 px-1 text-center rounded text-[11px] font-medium transition-all duration-300 cursor-pointer ${
                      activeMomentId === m.id
                        ? "bg-gradient-to-r from-[#cba864] to-[#dfbf78] text-[#060e18] font-bold shadow-md scale-[1.02]"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {m.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats / Key Highlights Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 sm:mt-12 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-400">
        <div className="pt-6 sm:pt-8 border-t border-[#cba864]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {hero.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col group transition-all duration-300 hover:translate-x-1"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-gold-gradient tracking-wide mb-1">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-light">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
