"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  BookOpen,
  Menu,
  X,
  Home,
  Package,
  Info,
  Phone,
  User,
  Heart,
  Settings,
} from "lucide-react";

interface HeaderProps {
  cartCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  currentPage?: string;
}

export default function Header({
  cartCount,
  mobileMenuOpen,
  onToggleMobileMenu,
  currentPage = "",
}: HeaderProps) {
  const getNavLinkClasses = (href: string) => {
    const isActive =
      currentPage === href || (currentPage === "" && href === "/");
    return isActive
      ? "text-gray-900 hover:text-indigo-600 font-medium"
      : "text-gray-600 hover:text-indigo-600";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-indigo-600 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن المنتجات..."
                  className="w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={getNavLinkClasses("/")}>
              الرئيسية
            </Link>
            <Link href="/products" className={getNavLinkClasses("/products")}>
              المنتجات
            </Link>
            <Link href="/about" className={getNavLinkClasses("/about")}>
              من نحن
            </Link>
            <Link href="/contact" className={getNavLinkClasses("/contact")}>
              اتصل بنا
            </Link>
            <Link href="/cart" className={getNavLinkClasses("/cart")}>
              السلة
            </Link>
          </nav>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">مكتبتي</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            {/* Mobile Menu Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">مرحباً بك</p>
                    <p className="text-xs opacity-90">في متجر مكتبتي</p>
                  </div>
                </div>
                <button
                  onClick={onToggleMobileMenu}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={onToggleMobileMenu}
                  className="flex items-center justify-center space-x-reverse space-x-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <ShoppingCart className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">السلة</span>
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button className="flex items-center justify-center space-x-reverse space-x-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">المفضلة</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث عن المنتجات..."
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                />
                <button className="absolute left-3 top-3 p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="px-4 py-2">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={onToggleMobileMenu}
                  className={`flex items-center space-x-reverse space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    currentPage === "/"
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">الرئيسية</span>
                </Link>

                <Link
                  href="/products"
                  onClick={onToggleMobileMenu}
                  className={`flex items-center space-x-reverse space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    currentPage === "/products"
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium">المنتجات</span>
                </Link>

                <Link
                  href="/about"
                  onClick={onToggleMobileMenu}
                  className={`flex items-center space-x-reverse space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    currentPage === "/about"
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Info className="h-5 w-5" />
                  <span className="font-medium">من نحن</span>
                </Link>

                <Link
                  href="/contact"
                  onClick={onToggleMobileMenu}
                  className={`flex items-center space-x-reverse space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    currentPage === "/contact"
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">اتصل بنا</span>
                </Link>
              </div>
            </nav>

            {/* Footer Actions */}
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-reverse space-x-2 text-gray-600 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-white transition-colors">
                  <User className="h-4 w-4" />
                  <span className="text-sm">تسجيل الدخول</span>
                </button>
                <button className="flex items-center justify-center space-x-reverse space-x-2 text-gray-600 hover:text-indigo-600 py-2 px-3 rounded-lg hover:bg-white transition-colors">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">الإعدادات</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
