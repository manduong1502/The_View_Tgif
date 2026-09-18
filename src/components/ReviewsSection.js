import { useContent } from "@/context/ContentContext";
import ScrollReveal from "./ScrollReveal";

export default function ReviewsSection() {
  const { content } = useContent();
  const reviews = content?.reviews || {};
  const reviewItems = reviews.items || [];

  return (
    <section id="danh-gia" className="py-20 sm:py-28 relative bg-[#060e18] border-t border-[#cba864]/10 overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-glow w-80 h-80 bg-[#cba864]/6 top-1/2 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="mb-3">
            <span className="kicker-line mx-auto justify-center">
              {reviews.kicker || "TRẢI NGHIỆM THỰC KHÁCH"}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-[1.2]">
            {reviews.headline || "Những đêm khó quên trên sông Hàn"}
          </h2>
        </ScrollReveal>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviewItems.map((rev, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300"}
              className="h-full"
            >
              <div className="luxury-card rounded-xl p-7 sm:p-8 flex flex-col justify-between border border-[#cba864]/20 h-full hover:border-[#cba864]/60">
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

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-serif text-base text-white font-medium">
                    {rev.author}
                  </h3>
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
