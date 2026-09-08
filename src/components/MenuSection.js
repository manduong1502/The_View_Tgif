"use client";

import { useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/content";
import ScrollReveal from "./ScrollReveal";

const CATEGORIES = ["Tất cả", "Khai vị", "Món nướng", "Món chính", "Signature"];

export default function MenuSection() {
  const { menu } = siteContent;
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedDish, setSelectedDish] = useState(null);

  const filteredDishes =
    activeTab === "Tất cả"
      ? menu.dishes
      : menu.dishes.filter(
          (d) => d.tag.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <section id="thuc-don" className="py-20 sm:py-32 relative bg-[#060e18] border-t border-[#cba864]/10">
      {/* Ambient glow */}
      <div className="ambient-glow w-[500px] h-[500px] bg-[#cba864]/8 top-10 left-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="mb-12 sm:mb-16">
          <div className="mb-4">
            <span className="kicker-line">{menu.kicker}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] max-w-2xl mb-6 whitespace-pre-line">
            {menu.headline}
          </h2>
          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed max-w-3xl">
            {menu.description}
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-8 pt-2">
            {CATEGORIES.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#cba864] to-[#dfbf78] text-[#060e18] font-bold shadow-lg shadow-[#cba864]/25 scale-105"
                    : "bg-[#0c1c2e] text-slate-300 border border-white/10 hover:border-[#cba864]/50 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid with Staggered Transitions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish, idx) => (
            <ScrollReveal
              key={dish.id}
              delay={
                idx === 0
                  ? "delay-100"
                  : idx === 1
                  ? "delay-200"
                  : idx === 2
                  ? "delay-300"
                  : "delay-400"
              }
            >
              <div
                onClick={() => setSelectedDish(dish)}
                className="luxury-card rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer group border border-[#cba864]/20 h-full hover:border-[#cba864]/60"
              >
                <div>
                  {/* Dish Image Container */}
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#0c1c2e]">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091524] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Tag badge top left */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#060e18] bg-[#cba864] px-2.5 py-1 rounded shadow-md">
                        {dish.tag}
                      </span>
                    </div>

                    {/* Price Tag top right */}
                    {dish.price && (
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-serif font-bold text-[#f3e2b8] bg-[#060e18]/85 px-2.5 py-1 rounded border border-[#cba864]/40 backdrop-blur-md">
                          {dish.price}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dish Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium mb-2 group-hover:text-[#f3e2b8] transition-colors duration-300 leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-4">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-[#f3e2b8] font-light">
                    {dish.highlight}
                  </span>
                  <span className="text-xs text-[#cba864] font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                    Chi tiết →
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Dish Quick Detail Modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="bg-[#0b1a2d] border border-[#cba864]/50 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300"
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
                aria-label="Đóng"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#cba864] hover:text-[#060e18] transition-colors duration-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase font-bold text-[#cba864] tracking-wider">
                  {selectedDish.tag}
                </span>
                {selectedDish.price && (
                  <span className="text-sm font-serif font-bold text-[#f3e2b8] bg-[#060e18] px-3 py-1 rounded border border-[#cba864]/40">
                    {selectedDish.price}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-3">
                {selectedDish.name}
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed mb-6 font-light">
                {selectedDish.description}
              </p>

              {/* Extra Gourmet Culinary Note */}
              <div className="p-3.5 rounded-lg bg-[#060e18] border border-[#cba864]/20 mb-6 text-xs text-slate-300 flex items-center gap-3">
                <span className="text-[#cba864] text-lg">🍷</span>
                <span>
                  <strong>Gợi ý Pairing:</strong> Dùng kèm vang trắng Sauvignon Blanc hoặc rượu Sake thượng hạng ướp lạnh trên du thuyền.
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="#dat-ban"
                  onClick={() => setSelectedDish(null)}
                  className="btn-gold w-full text-center py-3.5 rounded-sm text-xs font-bold tracking-wider uppercase inline-block"
                >
                  Đặt Bàn Thưởng Thức Món Này
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
