import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

const notoSans = Noto_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "ArtHub - Digital Art & Creative Platform",
  description: "Explore, share, and connect with artists on ArtHub.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSans.className} antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-[#030712] text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}