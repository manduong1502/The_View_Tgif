"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";
import ScrollReveal from "./ScrollReveal";

export default function ExperienceSection() {
  const { experience } = siteContent;
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);

  const activeZone = experience.zones[activeZoneIndex];

  return (
    <section id="khong-gian" className="py-20 sm:py-32 relative overflow-hidden bg-[#060e18]">
      {/* Subtle atmospheric ambient glow */}
      <div className="ambient-glow w-[550px] h-[550px] bg-blue-950/20 top-1/4 -left-48" />
      <div className="ambient-glow w-96 h-96 bg-[#cba864]/10 bottom-10 right-0" />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Live Dynamic Preview Image & Highlights */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <ScrollReveal delay="delay-100">
              <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden luxury-card border border-[#cba864]/30 shadow-2xl group">
                <Image
                  src={activeZone.image}
                  alt={activeZone.title}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e18]/90 via-[#060e18]/20 to-transparent" />
                
                {/* Overlay Details */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#f3e2b8] tracking-widest uppercase font-semibold">
                      {activeZone.number}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                      {activeZone.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-[#cba864] text-[#060e18] font-bold px-3 py-1 rounded-full shadow-lg">
                    {activeZone.capacity}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* 3 Stats Highlights Box */}
            <ScrollReveal delay="delay-200">
              <div className="luxury-card rounded-xl p-6 sm:p-7 grid grid-cols-3 gap-4 border border-white/10">
                {experience.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      idx < experience.highlights.length - 1
                        ? "border-r border-white/10 pr-3 sm:pr-4"
                        : ""
                    }`}
                  >
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient mb-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-light leading-snug">
                      {item.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative + 3 Space Selection Cards */}
          <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-5">
            <ScrollReveal delay="delay-100" className="space-y-4 text-slate-300 font-light text-sm sm:text-base leading-relaxed mb-4">
              {experience.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </ScrollReveal>

            {experience.zones.map((zone, idx) => {
              const isActive = activeZoneIndex === idx;
              return (
                <ScrollReveal
                  key={zone.id}
                  delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
                >
                  <div
                    onMouseEnter={() => setActiveZoneIndex(idx)}
                    onClick={() => setActiveZoneIndex(idx)}
                    className={`luxury-card rounded-xl p-5 sm:p-6 border cursor-pointer relative transition-all duration-400 group ${
                      isActive
                        ? "border-[#cba864] bg-[#0f2238]/95 shadow-xl shadow-[#cba864]/10 -translate-y-1"
                        : "border-white/10 hover:border-[#cba864]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-[#cba864] uppercase font-sans">
                        {zone.number}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors ${
                          isActive
                            ? "text-[#060e18] bg-[#cba864] border-[#cba864] font-bold"
                            : "text-slate-300 bg-white/5 border-white/10"
                        }`}
                      >
                        {zone.badge}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg sm:text-xl text-white font-medium mb-1.5 group-hover:text-[#f3e2b8] transition-colors duration-300 flex items-center justify-between">
                      <span>{zone.title}</span>
                      <span
                        className={`text-xs transition-transform duration-300 ${
                          isActive ? "text-[#cba864] translate-x-1" : "text-slate-500"
                        }`}
                      >
                        {isActive ? "● Đang xem" : "Xem ảnh →"}
                      </span>
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {zone.description}
                    </p>
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
