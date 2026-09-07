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
    <section id="su-kien" className="py-20 sm:py-32 relative bg-[#060d17] border-t border-white/5">
      {/* Ambient glow */}
      <div className="ambient-glow w-[450px] h-[450px] bg-[#cba864]/5 top-1/2 right-10" />

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
                className="luxury-card rounded-md p-7 sm:p-8 flex flex-col justify-between border border-white/10 group cursor-pointer h-full"
                onClick={() => handleCardClick(card.partyType)}
              >
                <div>
                  {/* Gold Outline Icon with subtle glow on hover */}
                  <div className="w-12 h-12 mb-6 text-[#cba864] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#e8d098]">
                    {idx === 0 && (
                      <svg
                        className="w-9 h-9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg
                        className="w-9 h-9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg
                        className="w-9 h-9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-white font-medium mb-3 group-hover:text-[#e8d098] transition-colors duration-300">
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
