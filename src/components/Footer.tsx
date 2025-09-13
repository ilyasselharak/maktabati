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
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 order-3 md:order-1">
            <div className="flex items-center justify-end space-x-2 mb-4">
              <span className="text-2xl font-bold">مكتبتي</span>
              <BookOpen className="h-8 w-8 text-indigo-400" />
            </div>
            <p className="text-gray-400 mb-6 text-right leading-relaxed">
              شريكك الموثوق للوازم المدرسية عالية الجودة. نحن نوفر كل ما يحتاجه
              الطلاب للنجاح الأكاديمي والإبداعي في رحلتهم التعليمية.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-end space-x-3 text-gray-400">
                <span className="text-sm">وزان، المغرب</span>
                <MapPin className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-center justify-end space-x-3 text-gray-400">
                <span className="text-sm"> 0629504107 </span>
                <Phone className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-center justify-end space-x-3 text-gray-400">
                <span className="text-sm">contact@maktabati.ma</span>
                <Mail className="h-4 w-4 text-indigo-400" />
              </div>
            </div>

            {/* Social Media */}
            <div className="flex justify-end space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="order-2 md:order-2">
            <h3 className="text-lg font-semibold mb-4 text-right">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li className="text-right">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  الرئيسية
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  المنتجات
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  الفئات
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  من نحن
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  اتصل بنا
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/cart"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  السلة
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="order-1 md:order-3">
            <h3 className="text-lg font-semibold mb-4 text-right">الفئات</h3>
            <ul className="space-y-3">
              <li className="text-right">
                <Link
                  href="/categories/textbooks"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  الكتب المدرسية
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/categories/stationery"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  أدوات الكتابة
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/categories/art-supplies"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  لوازم الفنون
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/categories/calculators"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  الحاسبات
                </Link>
              </li>
              <li className="text-right">
                <Link
                  href="/categories/backpacks"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  الحقائب المدرسية
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-right">
              <h4 className="text-xl font-semibold mb-2">
                اشترك في نشرتنا الإخبارية
              </h4>
              <p className="text-gray-400">
                احصل على أحدث العروض والمنتجات الجديدة
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                اشترك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>بنيت بـ</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>للطلاب</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                شروط الاستخدام
              </Link>
              <Link
                href="/shipping"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                سياسة الشحن
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} مكتبتي. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
