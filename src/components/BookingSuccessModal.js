"use client";

export default function BookingSuccessModal({ isOpen, onClose, bookingData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1624] border border-[#cba864] rounded-lg max-w-md w-full p-6 sm:p-8 text-center relative shadow-2xl">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#cba864]/20 border border-[#cba864] mx-auto flex items-center justify-center mb-5 text-[#cba864]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-serif text-2xl text-white font-medium mb-2">
          Yêu Cầu Đã Được Gửi!
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
          Cảm ơn quý khách <span className="font-semibold text-[#cba864]">{bookingData?.name || "Quý khách"}</span>. Đội ngũ The View sẽ liên hệ qua số điện thoại <span className="font-semibold text-white">{bookingData?.phone}</span> trong vòng 30 phút để xác nhận bàn.
        </p>

        {/* Booking Details Card */}
        <div className="bg-[#08111c] rounded p-4 text-left text-xs space-y-2 mb-6 border border-white/10">
          <div className="flex justify-between">
            <span className="text-slate-400">Thời gian:</span>
            <span className="text-white font-medium">
              {bookingData?.time || "19:00"} — {bookingData?.date || "Hôm nay"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Số lượng:</span>
            <span className="text-white font-medium">{bookingData?.guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Khu vực / Loại tiệc:</span>
            <span className="text-[#cba864] font-medium">{bookingData?.partyType}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-gold w-full py-3 rounded-sm text-xs font-bold tracking-wider uppercase"
          >
            Đã Hiểu
          </button>
          <a
            href="tel:0898173183"
            className="text-xs text-slate-400 hover:text-white py-1 flex items-center justify-center gap-1.5"
          >
            <span>Cần hỗ trợ khẩn cấp? Gọi Hotline: <strong className="text-white">0898 173 183</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
}
