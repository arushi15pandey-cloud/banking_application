import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BankingProvider } from "../context/BankingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online Banking System",
  description: "Modern banking application with integrated insurance policies, instant transfers, real-time quotes, and claims tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <BankingProvider>
          {children}
        </BankingProvider>
      </body>
    </html>
  );
}
