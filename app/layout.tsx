import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "maaks",
  description: "maaksik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        sm:mx-5 h-screen flex flex-col lg:gap-15 xl:gap-0`}
      >
    <header className="w-full h-[60px] relative z-50">
        <div className="
            w-full max-w-5xl mx-auto
            px-4
            md:px-8
            lg:px-12
            xl:px-16
            2xl:px-0
            flex items-center justify-between h-full
        ">
            <Link href="/" className="text-2xl text-white flex items-center gap-2">
                <span className="font-minecraft">0x06</span>
                <span className={"font-bold"}>maaks.me</span>
            </Link>
            <Link href="/been" className="font-google-sans text-white flex item center text-2xl">been</Link>
        </div>
    </header>
    <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden min-h-0">
        {children}
    </main>
    <footer className="mt-auto flex items-center justify-center h-12 relative z-50">
        <a className={"text-[#9b9c9d]"}>
            &copy; {new Date().getFullYear()} maaks.me
        </a>
    </footer>
      </body>
    </html>
  );
}
