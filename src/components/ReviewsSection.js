"use client";

import ScrollReveal from "./ScrollReveal";

const REVIEWS = [
  {
    quote:
      "Góc nhìn trực diện Cầu Rồng từ ngay mực nước sông Hàn quá đẹp. Sashimi tươi giòn ngọt và không gian du thuyền rất lãng mạn.",
    author: "Anh Minh Hoàng",
    role: "Thực khách tiệc tối cuối tuần",
    rating: 5,
  },
  {
    quote:
      "Bữa tiệc sinh nhật của gia đình ở phòng VIP được chuẩn bị chu đáo từ ánh sáng dịu nhẹ đến âm nhạc. Rất xứng đáng cho những dịp đặc biệt.",
    author: "Chị Thu Trang",
    role: "Tiệc sinh nhật riêng tư",
    rating: 5,
  },
  {
    quote:
      "Ngồi ban công tầng trệt đón gió sông Hàn lúc 21h xem Cầu Rồng phun lửa là trải nghiệm nhất định phải thử khi đến Đà Nẵng.",
    author: "Tạp chí Gourmet Vietnam",
    role: "Chuyên mục Ẩm thực & Điểm đến",
    rating: 5,
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 sm:py-28 relative bg-[#070f19] border-t border-white/5 overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-glow w-80 h-80 bg-[#cba864]/5 top-1/2 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="mb-3">
            <span className="kicker-line mx-auto justify-center">
              TRẢI NGHIỆM THỰC KHÁCH
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-[1.2]">
            Những đêm khó quên trên sông Hàn
          </h2>
        </ScrollReveal>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.map((rev, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
              className="h-full"
            >
              <div className="luxury-card rounded-md p-7 sm:p-8 flex flex-col justify-between border border-white/10 h-full">
                {/* Stars */}
                <div>
                  <div className="flex items-center gap-1 text-[#cba864] mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed italic mb-6">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-serif text-base text-white font-medium">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-[#cba864] font-light">
                    {rev.role}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
