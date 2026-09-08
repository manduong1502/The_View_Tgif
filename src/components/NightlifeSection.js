"use client";

import Image from "next/image";
import { siteContent } from "@/data/content";
import ScrollReveal from "./ScrollReveal";

export default function NightlifeSection() {
  const { nightlife } = siteContent;

  return (
    <section id="ve-dem" className="py-20 sm:py-32 relative bg-[#060e18] overflow-hidden">
      {/* Ambient lighting glow */}
      <div className="ambient-glow w-[550px] h-[550px] bg-[#cba864]/10 -top-20 -right-20" />
      <div className="ambient-glow w-96 h-96 bg-blue-950/20 bottom-0 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & 3 Events */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ScrollReveal>
              {/* Kicker */}
              <div className="mb-4">
                <span className="kicker-line">{nightlife.kicker}</span>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] mb-5 whitespace-pre-line">
                {nightlife.headline}
              </h2>

              {/* Description */}
              <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed mb-10 sm:mb-12 max-w-xl">
                {nightlife.description}
              </p>
            </ScrollReveal>

            {/* 3 Event Highlights Grid with Stagger */}
            <div className="pt-8 border-t border-[#cba864]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6">
              {nightlife.items.map((item, idx) => (
                <ScrollReveal
                  key={idx}
                  delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
                  className="flex flex-col space-y-2 group"
                >
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#cba864] uppercase">
                    {item.time}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium group-hover:text-[#f3e2b8] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {item.description}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Column: Real Nightlife Photography */}
          <div className="lg:col-span-6">
            <ScrollReveal delay="delay-200">
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-xl overflow-hidden luxury-card border border-[#cba864]/30 shadow-2xl group">
                <Image
                  src={nightlife.image}
                  alt="The View Nightlife Celebration Da Nang"
                  fill
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e18]/80 via-transparent to-transparent" />
                
                {/* Floating caption badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="text-xs text-white bg-[#060e18]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#cba864]/30 font-medium">
                    🔥 Hàng ghế đầu ngắm Cầu Rồng phun lửa
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
