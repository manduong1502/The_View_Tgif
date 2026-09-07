"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";
import ScrollReveal from "./ScrollReveal";

const ZONE_IMAGES = [
  "/images/indoor-view.jpg",
  "/images/balcony-view.jpg",
  "/images/vip-view.jpg",
];

export default function ExperienceSection() {
  const { experience } = siteContent;
  const [activeZoneIndex, setActiveZoneIndex] = useState(1); // Default to Balcony view

  return (
    <section id="trai-nghiem" className="py-20 sm:py-32 relative overflow-hidden bg-[#08111c]">
      {/* Subtle ambient lighting */}
      <div className="ambient-glow w-[550px] h-[550px] bg-blue-900/15 top-1/4 -left-48" />
      <div className="ambient-glow w-96 h-96 bg-[#cba864]/8 bottom-10 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Kicker & Headline */}
        <ScrollReveal className="mb-14 sm:mb-20">
          <div className="mb-4">
            <span className="kicker-line">{experience.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] max-w-2xl whitespace-pre-line">
            {experience.headline}
          </h2>
        </ScrollReveal>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Storytelling + Stats Box */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
            <ScrollReveal delay="delay-100" className="space-y-6 text-slate-200 font-light text-sm sm:text-base leading-relaxed">
              {experience.paragraphs.map((p, idx) => (
                <p key={idx} className="opacity-95">
                  {p}
                </p>
              ))}
            </ScrollReveal>

            {/* 3 Stats Highlights Box */}
            <ScrollReveal delay="delay-200">
              <div className="luxury-card rounded-md p-6 sm:p-8 grid grid-cols-3 gap-4 border border-white/10">
                {experience.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      idx < experience.highlights.length - 1
                        ? "border-r border-white/10 pr-3 sm:pr-4"
                        : ""
                    }`}
                  >
                    <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cba864] mb-1.5 transition-colors duration-300 hover:text-[#e8d098]">
                      {item.title}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-light leading-snug">
                      {item.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Live Interactive Photography Preview on Left on larger screens */}
            <ScrollReveal delay="delay-300" className="hidden lg:block">
              <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden luxury-card border border-white/12 shadow-2xl">
                <Image
                  src={ZONE_IMAGES[activeZoneIndex]}
                  alt={experience.zones[activeZoneIndex].title}
                  fill
                  className="object-cover transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08111c]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cba864] animate-ping" />
                    {experience.zones[activeZoneIndex].title}
                  </span>
                  <span className="text-[#cba864] uppercase tracking-wider font-semibold text-[10px]">
                    {experience.zones[activeZoneIndex].number}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 3 Luxury Space Cards */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5">
            {experience.zones.map((zone, idx) => {
              const isActive = activeZoneIndex === idx;
              return (
                <ScrollReveal
                  key={idx}
                  delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
                >
                  <div
                    onMouseEnter={() => setActiveZoneIndex(idx)}
                    onClick={() => setActiveZoneIndex(idx)}
                    className={`luxury-card rounded-md p-6 sm:p-7 border cursor-pointer relative transition-all duration-400 group ${
                      isActive
                        ? "border-[#cba864] bg-[#12243b]/95 shadow-xl shadow-[#cba864]/10 -translate-y-1"
                        : "border-white/10 hover:border-[#cba864]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-[#cba864] uppercase font-sans">
                        {zone.number}
                      </span>
                      {zone.badge && (
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors ${
                          isActive
                            ? "text-[#08111c] bg-[#cba864] border-[#cba864] font-bold"
                            : "text-slate-300 bg-white/5 border-white/10"
                        }`}>
                          {zone.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium mb-2 group-hover:text-[#e8d098] transition-colors duration-300 flex items-center justify-between">
                      <span>{zone.title}</span>
                      <span className={`text-xs transition-transform duration-300 ${isActive ? "text-[#cba864] translate-x-1" : "text-slate-500"}`}>
                        {isActive ? "Đang chọn xem ●" : "Xem góc nhìn →"}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {zone.description}
                    </p>

                    {/* Mobile inline image preview */}
                    <div className="lg:hidden mt-4 relative aspect-[16/9] w-full rounded overflow-hidden">
                      <Image
                        src={ZONE_IMAGES[idx]}
                        alt={zone.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
