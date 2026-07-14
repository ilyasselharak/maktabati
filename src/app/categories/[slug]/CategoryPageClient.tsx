"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  ChevronLeft,
  Grid3X3,
  List,
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

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name">("newest");

  useEffect(() => {
    fetchCategory();
    loadCart();
  }, [slug]);

  const loadCart = () => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch { /* ignore */ }
    }
  };

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data.category);
        setProducts(data.products || []);
      } else {
        setCategory(null);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategory(null);
    } finally {
      setLoading(false);
    }
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

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name, "ar");
      default: return 0;
    }
  });

  const getCategoryIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      "الكتب المدرسية": "📚",
      "أدوات الكتابة": "✏️",
      "لوازم الفنون": "🎨",
      "الحاسبات": "🧮",
    };
    return iconMap[name] || "📦";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-slate-900">الفئة غير موجودة</h2>
          <p className="text-sm text-slate-500 mt-1">الفئة التي تبحث عنها غير متوفرة</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* ── Category Header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 py-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-3 w-3" />
            <Link href="/products" className="hover:text-indigo-600 transition-colors">المنتجات</Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-slate-900 font-medium">{category.name}</span>
          </nav>

          {/* Category Info */}
          <div className="pb-10 pt-2">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{getCategoryIcon(category.name)}</span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
                {category.description && (
                  <p className="text-slate-500 mt-1">{category.description}</p>
                )}
              </div>
            </div>
            <p className="text-slate-500">
              {products.length} منتج{products.length !== 1 ? "ات" : ""} متاحة في هذه الفئة
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-slate-500">
                {sortedProducts.length} منتج
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-asc">السعر: الأقل</option>
                  <option value="price-desc">السعر: الأعلى</option>
                  <option value="name">الاسم</option>
                </select>
              </div>

              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
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

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              لا توجد منتجات في هذه الفئة
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              لم يتم إضافة منتجات إلى هذه الفئة بعد. تصفح الفئات الأخرى.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              تصفح جميع المنتجات
            </Link>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              : "grid-cols-1 gap-4"
          }`}>
            {sortedProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
