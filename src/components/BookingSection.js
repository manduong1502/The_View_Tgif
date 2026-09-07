"use client";

import { useState } from "react";
import { siteContent } from "@/data/content";
import BookingSuccessModal from "./BookingSuccessModal";
import ScrollReveal from "./ScrollReveal";

export default function BookingSection({ preselectedPartyType }) {
  const { booking } = siteContent;
  const { info } = booking;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: "2 khách",
    partyType: preselectedPartyType || "Bàn ăn tối",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Vui lòng điền họ tên và số điện thoại của quý khách để nhân viên có thể liên hệ xác nhận bàn.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 450);
  };

  return (
    <section id="dat-ban" className="py-20 sm:py-32 relative bg-[#08111c] overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-glow w-[500px] h-[500px] bg-[#cba864]/6 top-1/3 -right-20" />
      <div className="ambient-glow w-96 h-96 bg-blue-900/15 bottom-10 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <ScrollReveal>
              {/* Kicker */}
              <div className="mb-4">
                <span className="kicker-line">{booking.kicker}</span>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] mb-5 whitespace-pre-line">
                {booking.headline}
              </h2>

              {/* Description */}
              <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed mb-10 max-w-md">
                {booking.description}
              </p>
            </ScrollReveal>

            {/* Direct Info List */}
            <ScrollReveal delay="delay-150" className="space-y-6 pt-4 border-t border-white/10">
              {/* Address */}
              <div className="group">
                <span className="text-[11px] font-semibold text-[#cba864] tracking-[0.16em] uppercase block mb-1">
                  {info.addressLabel}
                </span>
                <p className="text-sm font-medium text-white">{info.addressText}</p>
                <p className="text-xs text-slate-400 font-light">{info.addressSub}</p>
              </div>

              {/* Hotline */}
              <div className="group">
                <span className="text-[11px] font-semibold text-[#cba864] tracking-[0.16em] uppercase block mb-1">
                  {info.hotlineLabel}
                </span>
                <a
                  href={`tel:${info.hotlineNumber.replace(/\s+/g, "")}`}
                  className="text-base font-bold text-white hover:text-[#cba864] transition-colors duration-200 inline-block"
                >
                  {info.hotlineNumber}
                </a>
                <p className="text-xs text-slate-400 font-light">{info.hotlineSub}</p>
              </div>

              {/* Opening Hours */}
              <div>
                <span className="text-[11px] font-semibold text-[#cba864] tracking-[0.16em] uppercase block mb-1">
                  {info.hoursLabel}
                </span>
                <p className="text-sm font-medium text-white">{info.hoursTime}</p>
                <p className="text-xs text-slate-400 font-light">{info.hoursDays}</p>
              </div>

              {/* Fanpage */}
              <div>
                <span className="text-[11px] font-semibold text-[#cba864] tracking-[0.16em] uppercase block mb-1">
                  {info.fanpageLabel}
                </span>
                <a
                  href={`https://${info.fanpageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-[#cba864] transition-colors duration-200"
                >
                  {info.fanpageUrl}
                </a>
                <p className="text-xs text-slate-400 font-light">{info.fanpageSub}</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Reservation Form */}
          <div className="lg:col-span-7">
            <ScrollReveal delay="delay-200">
              <div className="luxury-card rounded-md p-6 sm:p-10 border border-white/10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        HỌ VÀ TÊN <span className="text-[#cba864]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        SỐ ĐIỆN THOẠI <span className="text-[#cba864]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        NGÀY ĐẾN
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        GIỜ ĐẾN
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm bg-[#0b1726]"
                      >
                        <option value="17:00">05:00 PM (Hoàng hôn)</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="19:00">07:00 PM (Bữa tối đẹp nhất)</option>
                        <option value="19:30">07:30 PM</option>
                        <option value="20:00">08:00 PM</option>
                        <option value="20:30">08:30 PM (Đón Cầu Rồng 21h)</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="21:30">09:30 PM</option>
                        <option value="22:00">10:00 PM (Cocktail đêm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Guests & Party Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        SỐ KHÁCH
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({ ...formData, guests: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm bg-[#0b1726]"
                      >
                        {booking.guestOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        LOẠI TIỆC
                      </label>
                      <select
                        value={formData.partyType}
                        onChange={(e) =>
                          setFormData({ ...formData, partyType: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-sm luxury-input text-sm bg-[#0b1726]"
                      >
                        {booking.partyTypes.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      GHI CHÚ
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Yêu cầu thêm về vị trí bàn, trang trí..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-sm luxury-input text-sm resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold w-full py-4 rounded-sm text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>
                        {isSubmitting
                          ? "ĐANG XỬ LÝ YÊU CẦU..."
                          : "GỬI YÊU CẦU ĐẶT BÀN"}
                      </span>
                      {!isSubmitting && (
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                          →
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        bookingData={formData}
      />
    </section>
  );
}
