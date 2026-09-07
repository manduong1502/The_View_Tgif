"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";

export default function MenuSection() {
  const { menu } = siteContent;
  const [selectedDish, setSelectedDish] = useState(null);

  return (
    <section id="thuc-don" className="py-20 sm:py-28 relative bg-[#060d17] border-t border-white/5">
      {/* Ambient glow */}
      <div className="ambient-glow w-96 h-96 bg-[#cba864]/5 top-10 left-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="mb-4">
            <span className="kicker-line">{menu.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] max-w-2xl mb-6 whitespace-pre-line">
            {menu.headline}
          </h2>
          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed max-w-3xl">
            {menu.description}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.dishes.map((dish, idx) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="luxury-card rounded-md overflow-hidden flex flex-col justify-between cursor-pointer group border border-white/10"
            >
              <div>
                {/* Dish Image Container */}
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#0c1827]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1624] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>

                {/* Dish Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium mb-2.5 group-hover:text-[#e8d098] transition-colors leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-4">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Tag / Category at bottom */}
              <div className="px-5 sm:px-6 pb-5 pt-0 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-[#cba864] font-sans font-medium tracking-wide">
                  {dish.tag}
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">
                  Chi tiết →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dish Quick Detail Modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="bg-[#0b1624] border border-[#cba864]/40 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-72 w-full">
              <Image
                src={selectedDish.image}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-semibold text-[#cba864] tracking-wider">
                  {selectedDish.tag}
                </span>
                <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded">
                  {selectedDish.highlight}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white font-medium mb-3">
                {selectedDish.name}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                {selectedDish.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <a
                  href="#dat-ban"
                  onClick={() => setSelectedDish(null)}
                  className="btn-gold w-full text-center py-2.5 rounded-sm text-xs font-bold tracking-wider uppercase"
                >
                  Đặt bàn thưởng thức món này
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
