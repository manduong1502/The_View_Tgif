import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://theview.tgif.vn"),
  title: "THE VIEW | Du Thuyền Nhà Hàng Sông Hàn Đà Nẵng",
  description:
    "Trải nghiệm ẩm thực hải sản thượng hạng & tinh hoa Nhật Bản ngay tầng trệt du thuyền sông Hàn, ngắm trọn vẹn Cầu Rồng phun lửa mỗi cuối tuần.",
  keywords: [
    "The View",
    "Du thuyền Đà Nẵng",
    "Nhà hàng du thuyền Sông Hàn",
    "Fine dining Đà Nẵng",
    "Cầu Rồng phun lửa",
    "Happy Yacht Đà Nẵng",
    "Đặt bàn The View",
  ],
  openGraph: {
    title: "THE VIEW | Du Thuyền Nhà Hàng Sông Hàn Đà Nẵng",
    description:
      "Một bữa tối ngay tầng trệt du thuyền, mặt nước sông Hàn — ngắm trọn Cầu Rồng và thưởng thức hải sản cao cấp.",
    url: "https://theview.tgif.vn",
    siteName: "The View Yacht Restaurant",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "The View Yacht Restaurant Da Nang",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/images/logo/TheView-LogoSymbol.png",
    shortcut: "/images/logo/TheView-LogoSymbol.png",
    apple: "/images/logo/TheView-LogoSymbol.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="min-h-screen bg-[#08111c] text-slate-100 font-sans selection:bg-[#cba864] selection:text-[#08111c] antialiased">
        {children}
      </body>
    </html>
  );
}
