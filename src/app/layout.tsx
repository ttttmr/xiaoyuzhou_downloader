import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xyz.xlab.app'),
  title: "小宇宙播客下载器 - 一键下载小宇宙播客音频",
  description: "免费下载小宇宙播客，自动解析并生成精美文件名。支持所有小宇宙播客节目，一键下载离线收听。",
  keywords: "小宇宙播客下载, podcast downloader, 播客下载器, 小宇宙, 音频下载, 离线收听",
  authors: [{ name: "小宇宙播客下载器" }],
  creator: "小宇宙播客下载器",
  publisher: "小宇宙播客下载器",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "小宇宙播客下载器 - 一键下载小宇宙播客音频",
    description: "免费下载小宇宙播客，自动解析并生成精美文件名。支持所有小宇宙播客节目，一键下载离线收听。",
    url: "https://xyz.xlab.app",
    siteName: "小宇宙播客下载器",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "小宇宙播客下载器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "小宇宙播客下载器 - 一键下载小宇宙播客音频",
    description: "免费下载小宇宙播客，自动解析并生成精美文件名。",
    images: ["/og-image.jpg"],
    creator: "@xiaoyuzhou_downloader",
  },
  alternates: {
    canonical: "https://xyz.xlab.app",
  },
  other: {
    "baidu-site-verification": "codeva-your-verification-code",
    "google-site-verification": "google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
