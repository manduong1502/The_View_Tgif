"use client";

import { siteContent } from "@/data/content";
import ScrollReveal from "./ScrollReveal";

export default function EventsSection({ onSelectPartyType }) {
  const { events } = siteContent;

  const handleCardClick = (partyType) => {
    if (onSelectPartyType) {
      onSelectPartyType(partyType);
    }
    const el = document.getElementById("dat-ban");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="su-kien" className="py-20 sm:py-32 relative bg-[#060e18] border-t border-[#cba864]/10">
      {/* Ambient glow */}
      <div className="ambient-glow w-[450px] h-[450px] bg-[#cba864]/6 top-1/2 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="mb-12 sm:mb-16">
          <div className="mb-4">
            <span className="kicker-line">{events.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] max-w-2xl mb-5 whitespace-pre-line">
            {events.headline}
          </h2>
          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed max-w-2xl">
            {events.description}
          </p>
        </ScrollReveal>

        {/* 3 Cards Grid with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {events.cards.map((card, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
              className="h-full"
            >
              <div
                className="luxury-card rounded-xl p-7 sm:p-8 flex flex-col justify-between border border-[#cba864]/20 group cursor-pointer h-full hover:border-[#cba864]/60"
                onClick={() => handleCardClick(card.partyType)}
              >
                <div>
                  {/* Gold Outline Icon with subtle glow on hover */}
                  <div className="w-12 h-12 mb-6 text-[#cba864] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#f3e2b8]">
                    {idx === 0 && (
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-white font-medium mb-3 group-hover:text-[#f3e2b8] transition-colors duration-300">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Link */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#cba864] tracking-wider uppercase inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    <span>{card.cta}</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
