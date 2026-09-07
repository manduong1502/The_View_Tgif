"use client";

import Image from "next/image";
import { siteContent } from "@/data/content";

export default function HeroSection() {
  const { hero } = siteContent;

  return (
    <section className="relative min-h-[94vh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 overflow-hidden">
      {/* Background Image with Cinematic Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="The View Yacht Restaurant River Dining"
          fill
          priority
          className="object-cover object-center scale-[1.03] transform transition-transform duration-1000 ease-out"
          quality={92}
        />
        {/* Multi-layered luxury navy vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08111c]/95 via-[#08111c]/80 to-[#08111c]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111c] via-[#08111c]/30 to-[#08111c]/75" />
        <div className="absolute inset-0 bg-[#08111c]/35 backdrop-brightness-95" />
      </div>

      {/* Main Content Container with Staggered Fade-in */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Kicker Line */}
          <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="kicker-line text-xs sm:text-sm tracking-[0.2em]">
              {hero.kicker}
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.18] sm:leading-[1.15] mb-5 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {hero.titleLine1}{" "}
            <br />
            <span className="italic font-serif font-light text-[#f6eee0] drop-shadow-sm">
              {hero.titleLine2Highlight}
            </span>{" "}
            {hero.titleLine2Rest}
          </h1>

          {/* Subtitle description */}
          <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-8 sm:mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            {hero.description}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <a
              href="#dat-ban"
              className="btn-gold px-7 py-3.5 rounded-sm text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-2.5 group"
            >
              <span>{hero.ctaPrimary}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </a>
            <a
              href="#thuc-don"
              className="btn-glass px-7 py-3.5 rounded-sm text-xs sm:text-sm font-medium tracking-wider uppercase"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Stats / Key Highlights Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-400">
        <div className="pt-8 border-t border-white/12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {hero.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col group transition-all duration-300 hover:translate-x-1"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#cba864] tracking-wide mb-1 transition-colors group-hover:text-[#e8d098]">
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
