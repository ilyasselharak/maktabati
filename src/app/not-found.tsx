"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/banner.png"
            alt="مكتبتي"
            width={200}
            height={50}
            className="mx-auto mb-6 opacity-60"
            priority
          />
          <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            الصفحة غير موجودة
          </h1>
          <p className="text-slate-500 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </button>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <Search className="w-5 h-5" />
            تصفح المنتجات
          </button>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للصفحة السابقة
        </button>
      </div>
    </div>
  );
}
