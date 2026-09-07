import { siteContent } from "@/data/content";

export default function ExperienceSection() {
  const { experience } = siteContent;

  return (
    <section id="trai-nghiem" className="py-20 sm:py-28 relative overflow-hidden bg-[#08111c]">
      {/* Subtle ambient lighting */}
      <div className="ambient-glow w-96 h-96 bg-blue-950/30 top-1/4 -left-48" />
      <div className="ambient-glow w-96 h-96 bg-[#cba864]/5 bottom-10 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Kicker & Headline */}
        <div className="mb-12 sm:mb-16">
          <div className="mb-4">
            <span className="kicker-line">{experience.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] max-w-2xl whitespace-pre-line">
            {experience.headline}
          </h2>
        </div>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Storytelling + Stats Box */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-10">
            <div className="space-y-6 text-slate-300 font-light text-sm sm:text-base leading-relaxed">
              {experience.paragraphs.map((p, idx) => (
                <p key={idx} className="opacity-90">
                  {p}
                </p>
              ))}
            </div>

            {/* 3 Stats Highlights Box */}
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
                  <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#cba864] mb-1.5">
                    {item.title}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-light leading-snug">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3 Luxury Space Cards */}
          <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-5">
            {experience.zones.map((zone, idx) => (
              <div
                key={idx}
                className="luxury-card rounded-md p-6 sm:p-7 border border-white/10 relative group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-[#cba864] uppercase font-sans">
                    {zone.number}
                  </span>
                  {zone.badge && (
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                      {zone.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-white font-medium mb-2 group-hover:text-[#e8d098] transition-colors">
                  {zone.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {zone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
