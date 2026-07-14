"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Home,
  Package,
  Info,
  Phone,
  User,
  Heart,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";

interface HeaderProps {
  cartCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  currentPage?: string;
}

interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: { name: string };
  slug?: string;
}

const navLinks = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/products", label: "المنتجات", icon: Package },
  { href: "/about", label: "من نحن", icon: Info },
  { href: "/contact", label: "اتصل بنا", icon: Phone },
];

export default function Header({
  cartCount,
  mobileMenuOpen,
  onToggleMobileMenu,
  currentPage = "",
}: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuClosing, setMenuClosing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=5`);
      const data = await res.json();
      if (data.products) {
        setSearchResults(data.products.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setHighlightedIndex(-1);
    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchResults([]);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults([]);
      inputRef.current?.blur();
    }
  };

  const handleSelectProduct = (productSlug: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/products/${productSlug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        const p = searchResults[highlightedIndex];
        handleSelectProduct(p.slug || p._id);
      } else {
        handleSearchSubmit(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleCloseMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuClosing(false);
      onToggleMobileMenu();
    }, 200);
  };

  const isActive = (href: string) =>
    currentPage === href || (currentPage === "" && href === "/");

  return (
    <>
      <header
        dir="rtl"
        className={`fixed w-full top-0 start-0 end-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/30 border-b border-slate-100"
            : "bg-white border-b border-slate-100/60"
        }`}
      >
        {/* Top Bar */}
        <div className="w-full bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-9">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span className="font-medium">شحن مجاني للطلبات فوق 400 د.م.</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <Link href="/contact" className="hover:text-indigo-200 transition-colors">المساعدة</Link>
                <span className="text-indigo-400">|</span>
                <Link href="/contact" className="hover:text-indigo-200 transition-colors">اتصل بنا</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all duration-300 group-hover:scale-105">
                  <Image src="/logo.png" alt="مكتبتي" width={40} height={40} className="object-cover w-full h-full" />
                </div>
                
              </Link>

              {/* Center: Search Bar with Suggestions */}
              <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <div className="relative">
                    <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="ابحث عن منتج..."
                      className="w-full ps-10 pe-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all text-sm text-slate-900 placeholder:text-slate-400"
                      autoComplete="off"
                    />
                    {searchLoading && (
                      <Loader2 className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
                    )}
                    {!searchLoading && searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setShowSuggestions(false);
                          inputRef.current?.focus();
                        }}
                        className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 start-0 end-0 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden z-50">
                    {searchLoading && searchResults.length === 0 ? (
                      <div className="p-6 text-center">
                        <Loader2 className="h-5 w-5 text-slate-400 animate-spin mx-auto" />
                        <p className="text-sm text-slate-400 mt-2">جاري البحث...</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-5 text-center">
                        <p className="text-sm text-slate-500">لا توجد نتائج</p>
                        <p className="text-xs text-slate-400 mt-1">جرب كلمة بحث مختلفة</p>
                      </div>
                    ) : (
                      <div>
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">الاقتراحات</span>
                          <button
                            onClick={() => {
                              setShowSuggestions(false);
                              router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            عرض الكل
                          </button>
                        </div>
                        <div className="py-1">
                          {searchResults.map((product, index) => (
                            <button
                              key={product._id}
                              onClick={() => handleSelectProduct(product.slug || product._id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-start transition-all ${
                                index === highlightedIndex
                                  ? "bg-indigo-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <Package className="h-4 w-4 text-slate-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {product.category?.name || "منتج"}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-indigo-600 shrink-0">
                                {product.price.toFixed(2)} د.م.
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full text-center text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                          >
                            البحث عن &quot;{searchQuery}&quot; في جميع المنتجات
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Nav + Cart + Menu */}
              <div className="flex items-center gap-1">
                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-0.5 ms-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-slate-200 mx-1" />

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -start-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm animate-scale-in">
                        {cartCount > 99 ? "99" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">السلة</span>
                </Link>

                {/* Mobile Search */}
                <button
                  onClick={() => router.push("/products")}
                  className="md:hidden p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Mobile Menu */}
                <button
                  onClick={onToggleMobileMenu}
                  className="lg:hidden p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header + top bar */}
      <div className="h-[100px]" />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]" dir="rtl">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseMenu}
          />
          <div
            className={`absolute top-0 start-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col ${
              menuClosing ? "animate-slide-to-right" : "animate-slide-from-right"
            }`}
          >
            {/* Drawer Header */}
            <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center backdrop-blur-sm bg-white/20">
                  <Image src="/logo.png" alt="مكتبتي" width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="text-base font-bold">مكتبتي</p>
                  <p className="text-xs text-indigo-200">لوازم المدرسة</p>
                </div>
              </div>
              <button
                onClick={handleCloseMenu}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Search */}
              <div className="px-4 mb-5">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="البحث عن منتجات..."
                    className="w-full ps-12 pe-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                  <button className="absolute end-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              {/* Quick Actions */}
              <div className="px-4 mb-5">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={handleCloseMenu}
                    className="flex items-center justify-center gap-2 bg-indigo-50 p-3 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all"
                  >
                    <ShoppingCart className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-700">السلة</span>
                    {cartCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-slate-700">المفضلة</span>
                  </button>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="px-4 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleCloseMenu}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          active ? "bg-indigo-100" : "bg-slate-100"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            active ? "text-indigo-600" : "text-slate-500"
                          }`}
                        />
                      </div>
                      <span className="text-sm">{item.label}</span>
                      <ChevronLeft
                        className={`h-4 w-4 ms-auto transition-transform ${
                          active ? "text-indigo-400" : "text-slate-300"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="mx-4 my-5 border-t border-slate-100" />

              {/* Extra */}
              <div className="px-4 space-y-1">
                <Link
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-sm">تسجيل الدخول</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>تشكيلة جديدة متوفرة الآن — شحن مجاني للطلبات فوق 400 د.م.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
