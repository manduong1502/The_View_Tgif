import Image from "next/image";
import { siteContent } from "@/data/content";

export default function HeroSection() {
  const { hero } = siteContent;

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 overflow-hidden">
      {/* Background Image with Cinematic Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="The View Yacht Restaurant River Dining"
          fill
          priority
          className="object-cover object-center scale-[1.02] transform"
          quality={90}
        />
        {/* Deep luxury navy & vignette gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08111c]/95 via-[#08111c]/80 to-[#08111c]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111c] via-transparent to-[#08111c]/70" />
        <div className="absolute inset-0 bg-[#08111c]/30 backdrop-brightness-90" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Kicker Line */}
          <div className="mb-4 sm:mb-6">
            <span className="kicker-line text-xs sm:text-sm tracking-[0.2em]">
              {hero.kicker}
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.18] sm:leading-[1.15] mb-5 tracking-tight">
            {hero.titleLine1}{" "}
            <br />
            <span className="italic font-serif font-light text-[#f6eee0] drop-shadow-sm">
              {hero.titleLine2Highlight}
            </span>{" "}
            {hero.titleLine2Rest}
          </h1>

          {/* Subtitle description */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-8 sm:mb-10 max-w-xl">
            {hero.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <a
              href="#dat-ban"
              className="btn-gold px-7 py-3.5 rounded-sm text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center gap-2 group"
            >
              <span>{hero.ctaPrimary}</span>
              <span className="transition-transform group-hover:translate-x-1">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16">
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {hero.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col group transition-all duration-300"
            >
              <span className="font-serif text-lg sm:text-xl font-bold text-[#cba864] tracking-wide mb-1">
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
