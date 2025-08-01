"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("请输入播客地址");
      return;
    }

    setIsLoading(true);

    try {
      // Extract episode ID from full URL only
      let episodeId = "";

      if (url.includes("xiaoyuzhoufm.com/episode/")) {
        const match = url.match(/episode\/([a-f0-9]{24})/);
        if (match) {
          episodeId = match[1];
        }
      }

      if (!episodeId) {
        setError("请输入有效的小宇宙播客地址");
        return;
      }

      router.push(`/episode/${episodeId}`);
    } catch (error) {
      setError("处理地址时出错，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "小宇宙播客下载器",
              description: "免费下载小宇宙播客，自动解析并生成精美文件名。支持所有小宇宙播客节目，一键下载离线收听。",
              url: "https://xyz.xlab.app",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY"
              },
              creator: {
                "@type": "Organization",
                name: "小宇宙播客下载器"
              },
              featureList: [
                "播客下载",
                "音频解析",
                "文件名美化",
                "一键下载"
              ],
              mainEntity: {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "如何使用小宇宙播客下载器？",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "只需复制小宇宙播客链接，粘贴到输入框中，点击下载按钮即可自动解析并下载音频文件。"
                    }
                  },
                  {
                    "@type": "Question",
                    name: "下载的音频文件是什么格式？",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "下载的音频文件通常是M4A或MP3格式，取决于原始播客文件的编码格式。"
                    }
                  },
                  {
                    "@type": "Question",
                    name: "下载完全免费吗？",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "是的，小宇宙播客下载器完全免费使用，无需注册或登录。"
                    }
                  }
                ]
              }
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-cyan-800 bg-clip-text text-transparent mb-4">
            小宇宙播客下载器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            一键下载小宇宙播客，自动解析并生成
            <span className="font-semibold text-blue-600">精美文件名</span>
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-2">
            文件名格式：播客名_标题.m4a/mp3
          </p>
        </div>

        {/* Main form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-white/95">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="block text-lg font-medium text-gray-800 mb-3"
                >
                  🎙️ 小宇宙播客链接
                </label>
                <div className="relative">
                  <input
                    id="url"
                    name="url"
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.xiaoyuzhoufm.com/episode/6889da698e06fe8de77116a9"
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">粘贴小宇宙播客链接</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    正在解析中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    一键下载
                  </div>
                )}
              </button>
            </form>

            {/* Quick download tip */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">快捷下载</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    地址栏域名替换为：
                  </p>
                  <div className="bg-blue-100 rounded-lg p-3 font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800">www.xiaoyuzhoufm.com</span>
                      <svg
                        className="w-4 h-4 text-blue-600 mx-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <span className="text-blue-800 font-semibold">
                        xyz.xlab.app
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    替换后例如：https://xyz.xlab.app/episode/6889da698e06fe8de77116a9
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
