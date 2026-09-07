import Link from "next/link";
import { siteContent } from "@/data/content";

export default function Footer() {
  const { footer } = siteContent;

  return (
    <footer className="bg-[#050c14] border-t border-white/10 pt-16 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wider text-white">
              THE VIEW
            </h3>
            <p className="text-xs sm:text-sm font-light text-slate-400 leading-relaxed max-w-sm">
              {footer.about}
            </p>
          </div>

          {/* Col 2: Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-[#cba864] tracking-[0.18em] uppercase">
              {footer.columns.contact.title}
            </h4>
            <div className="space-y-1.5 text-xs sm:text-sm font-light text-slate-300">
              <p>{footer.columns.contact.lines[0]}</p>
              <p>{footer.columns.contact.lines[1]}</p>
              <p>
                <a
                  href="tel:0898173183"
                  className="hover:text-white transition-colors"
                >
                  {footer.columns.contact.lines[2]}
                </a>
              </p>
              <p>
                <a
                  href="#dat-ban"
                  className="hover:text-[#cba864] transition-colors"
                >
                  {footer.columns.contact.lines[3]}
                </a>
              </p>
            </div>
          </div>

          {/* Col 3: Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-[#cba864] tracking-[0.18em] uppercase">
              {footer.columns.hours.title}
            </h4>
            <div className="space-y-1.5 text-xs sm:text-sm font-light text-slate-300">
              {footer.columns.hours.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          {/* Col 4: Social */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-[#cba864] tracking-[0.18em] uppercase">
              {footer.columns.social.title}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-light">
              {footer.columns.social.links.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#cba864] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light">
          <p>{footer.copyright}</p>
          <p className="text-slate-400">{footer.subtext}</p>
        </div>
      </div>
    </footer>
  );
}
