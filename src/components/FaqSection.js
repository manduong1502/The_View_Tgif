"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const FAQS = [
  {
    q: "Cầu Rồng phun lửa vào những khung giờ và ngày nào trong tuần?",
    a: "Màn trình diễn phun lửa và phun nước của Cầu Rồng diễn ra cố định vào lúc 21:00 tối Thứ Bảy và Chủ Nhật hàng tuần. Quý khách nên đặt bàn lúc 18:30 - 19:30 để thưởng thức bữa tối và ngắm hoàng hôn trước khi chiêm ngưỡng trọn vẹn màn trình diễn ngay trước mắt mà không bị vướng tầm nhìn.",
  },
  {
    q: "Khu vực dãy bàn Hoàng Hôn ngoài trời có cần đặt cọc giữ chỗ trước không?",
    a: "Dãy bàn ngoài trời sát mép sông Hàn ngắm hoàng hôn và view trực diện Cầu Rồng là vị trí được yêu thích nhất. Quý khách nên đặt chỗ trước qua website hoặc liên hệ trực tiếp Hotline 0898 173 183 để được ưu tiên sắp xếp vị trí đẹp nhất.",
  },
  {
    q: "Nhà hàng có hỗ trợ setup tiệc sinh nhật hoặc lễ cầu hôn không?",
    a: "Có, The View cung cấp dịch vụ setup hoa tươi, nến thơm, bánh kem và nhạc theo yêu cầu cho các buổi tiệc kỷ niệm, sinh nhật hoặc lễ cầu hôn lãng mạn bên khung cảnh sông Hàn.",
  },
  {
    q: "Sức chứa tối đa cho các buổi tiệc đoàn và sự kiện công ty là bao nhiêu?",
    a: "The View có thể phục vụ từ nhóm nhỏ 2-4 khách đến các đoàn tiệc lớn 30-80 khách với set menu được thiết kế riêng linh hoạt theo ngân sách.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-20 sm:py-28 relative bg-[#060e18] border-t border-[#cba864]/10 overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-glow w-96 h-96 bg-blue-950/20 bottom-0 right-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-14">
          <div className="mb-3">
            <span className="kicker-line mx-auto justify-center">
              CÂU HỎI THƯỜNG GẶP
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-[1.2]">
            Giải đáp thông tin trải nghiệm
          </h2>
        </ScrollReveal>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <ScrollReveal key={idx} delay={idx === 0 ? "delay-100" : "delay-200"}>
                <div
                  className={`luxury-card rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? "border-[#cba864]/60 bg-[#0f2238]" : "border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg text-white font-medium">
                      {faq.q}
                    </span>
                    <span
                      className={`text-[#cba864] text-xl font-light transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
