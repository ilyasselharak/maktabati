"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  ArrowUp,
  CreditCard,
  Truck,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden" dir="rtl">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Trust Badges */}
      <div className="relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "توصيل سريع", desc: "لجميع المدن المغربية" },
              { icon: ShieldCheck, title: "دفع آمن", desc: "100% محمي" },
              { icon: Clock, title: "خدمة 24/7", desc: "دعم على مدار الساعة" },
              { icon: CreditCard, title: "الدفع عند الاستلام", desc: "أو تحويل بنكي" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-indigo-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight">مكتبتي</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm max-w-sm">
              شريكك الموثوق للوازم المدرسية عالية الجودة. نوفر كل ما يحتاجه
              الطلاب للنجاح الأكاديمي والإبداعي في رحلتهم التعليمية.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {[
                { icon: MapPin, text: "وزان، المغرب" },
                { icon: Phone, text: "0629504107" },
                { icon: Mail, text: "contact@maktabati.ma" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                    <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="p-2.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-xl transition-all duration-200"
                  aria-label="Social"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-semibold mb-5">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/products", label: "المنتجات" },
                { href: "/categories", label: "الفئات" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "اتصل بنا" },
                { href: "/cart", label: "السلة" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-4">
            <h3 className="text-base font-semibold mb-5">الفئات</h3>
            <ul className="space-y-3">
              {[
                { href: "/categories/textbooks", label: "الكتب المدرسية" },
                { href: "/categories/stationery", label: "أدوات الكتابة" },
                { href: "/categories/art-supplies", label: "لوازم الفنون" },
                { href: "/categories/calculators", label: "الحاسبات" },
                { href: "/categories/backpacks", label: "الحقائب المدرسية" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                اشترك في نشرتنا الإخبارية
              </h4>
              <p className="text-slate-400 text-sm">
                احصل على أحدث العروض والمنتجات الجديدة مباشرة إلى بريدك
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
              />
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg shadow-indigo-600/20">
                اشترك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <span>بنيت بـ</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>للطلاب</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              {["سياسة الشحن", "شروط الاستخدام", "سياسة الخصوصية"].map(
                (label) => (
                  <Link
                    key={label}
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              &copy; {currentYear} مكتبتي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-40 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-110"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
