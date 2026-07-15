"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid,
  List,
  X,
  Filter,
  SlidersHorizontal,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string; slug?: string };
  images: string[];
  stock: number;
  isActive: boolean;
  tags?: string[];
  slug?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Category {
  _id: string;
  name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  // Read category from URL on initial load
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        category: selectedCategory,
        sortBy,
        sortOrder,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      });
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder, minPrice, maxPrice]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (response.ok) setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    const currentCart = JSON.parse(localStorage.getItem("maktabati_cart") || "[]");
    const existingItem = currentCart.find((item: CartItem) => item.product._id === product._id);
    let newItems;
    if (existingItem) {
      newItems = currentCart.map((item: CartItem) =>
        item.product._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    } else {
      newItems = [...currentCart, { product, quantity: 1 }];
    }
    updateCartInStorage(newItems);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== "all" ? "1" : "",
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  const sortOptions = [
    { value: "createdAt-desc", label: "الأحدث" },
    { value: "createdAt-asc", label: "الأقدم" },
    { value: "name-asc", label: "الاسم: أ-ي" },
    { value: "name-desc", label: "الاسم: ي-أ" },
    { value: "price-asc", label: "السعر: الأقل" },
    { value: "price-desc", label: "السعر: الأعلى" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === `${sortBy}-${sortOrder}`)?.label || "الترتيب";

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">جميع المنتجات</h1>
              <p className="text-slate-500 mt-1">اكتشف مجموعتنا الكاملة من لوازم المدرسة</p>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="w-full lg:w-96">
              <div className={`relative transition-all duration-300 ${searchFocused ? "lg:w-[28rem]" : ""}`}>
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full ps-10 pe-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="bg-white border-b border-slate-100 sticky top-[100px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat._id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>فلاتر</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-red-600 bg-red-50 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">مسح الفلاتر</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Results count */}
              <span className="hidden sm:block text-sm text-slate-500">
                {pagination?.totalProducts || 0} منتج
              </span>

              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{currentSortLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <div className="absolute end-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const [sb, so] = option.value.split("-");
                        setSortBy(sb);
                        setSortOrder(so);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                        `${sortBy}-${sortOrder}` === option.value
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-[180px]">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <h3 className="text-base font-bold text-slate-900">الفلاتر</h3>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">الفئة</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedCategory === "all"
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    جميع الفئات
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat._id)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all ${
                        selectedCategory === cat._id
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 my-5" />

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">نطاق السعر</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                    placeholder="من"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                  <span className="text-slate-400 text-sm">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                    placeholder="إلى"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 my-5" />

              {/* Sort */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">الترتيب</h4>
                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const [sb, so] = option.value.split("-");
                        setSortBy(sb);
                        setSortOrder(so);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all ${
                        `${sortBy}-${sortOrder}` === option.value
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <>
                  <div className="border-t border-slate-100 my-5" />
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 font-medium transition-all"
                  >
                    مسح جميع الفلاتر
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Loading Skeleton */}
            {loading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" : "grid-cols-1 gap-4"}`}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="h-44 bg-slate-100 animate-shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-100 rounded w-1/3 animate-shimmer" />
                      <div className="h-4 bg-slate-100 rounded animate-shimmer" />
                      <div className="h-3 bg-slate-100 rounded w-3/4 animate-shimmer" />
                      <div className="h-8 bg-slate-100 rounded w-1/3 animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  جرب تغيير معايير البحث أو الفلاتر لعرض المنتجات
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
                >
                  <X className="h-4 w-4" />
                  مسح الفلاتر
                </button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" : "grid-cols-1 gap-4"}`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      cartItems={cartItems}
                      onAddToCart={addToCart}
                      onUpdateQuantity={(product, quantity) => {
                        const currentCart = JSON.parse(localStorage.getItem("maktabati_cart") || "[]");
                        const newItems = currentCart.map((item: CartItem) =>
                          item.product._id === product._id ? { ...item, quantity } : item
                        );
                        updateCartInStorage(newItems);
                      }}
                      onRemoveFromCart={(product) => {
                        const currentCart = JSON.parse(localStorage.getItem("maktabati_cart") || "[]");
                        const newItems = currentCart.filter((item: CartItem) => item.product._id !== product._id);
                        updateCartInStorage(newItems);
                      }}
                      className={viewMode === "list" ? "flex flex-col sm:flex-row max-w-none" : ""}
                      compact={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 gap-4 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 text-center sm:text-right">
                      صفحة <span className="font-semibold text-slate-900">{currentPage}</span> من{" "}
                      <span className="font-semibold text-slate-900">{pagination.totalPages}</span>{" "}
                      ({pagination.totalProducts} منتج)
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNumber = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                          if (pageNumber > pagination.totalPages) return null;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-9 h-9 rounded-xl font-medium text-sm transition-all ${
                                pageNumber === currentPage
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
                      >
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                        <span>السابق</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Modal ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60]" dir="rtl">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">الفلاتر</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-6 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">الفئة</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    الكل
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat._id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat._id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">نطاق السعر</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                    placeholder="من"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                    placeholder="إلى"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">الترتيب</h4>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const [sb, so] = option.value.split("-");
                        setSortBy(sb);
                        setSortOrder(so);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-center ${
                        `${sortBy}-${sortOrder}` === option.value
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 font-medium transition-all"
                >
                  مسح جميع الفلاتر
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 sticky bottom-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
              >
                عرض النتائج ({pagination?.totalProducts || 0})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
