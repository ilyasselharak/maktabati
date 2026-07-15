"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../components/DashboardLayout";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  X,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  isActive: boolean;
  tags: string[];
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error("فشل في جلب المنتجات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("فشل في جلب الفئات:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من أنك تريد حذف هذا المنتج؟")) return;
    setDeletingId(productId);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (error) {
      console.error("فشل في حذف المنتج:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stockBadge = (stock: number) => {
    if (stock === 0) return { text: "نفد", class: "bg-red-50 text-red-600 border-red-100" };
    if (stock <= 5) return { text: "قليل", class: "bg-amber-50 text-amber-600 border-amber-100" };
    return { text: "متوفر", class: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  };

  if (isLoading) {
    return (
      <DashboardLayout title="المنتجات">
        <div className="flex items-center justify-center py-20">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="المنتجات">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">المنتجات</h2>
            <p className="mt-1 text-sm text-slate-500">
              إدارة مخزون لوازم المدرسة الخاصة بك
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-200 text-sm"
          >
            <Plus className="h-4 w-4" />
            إضافة منتج
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                placeholder="البحث في المنتجات..."
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              >
                <option value="">جميع الفئات</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all ${showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                  مسح الفلاتر
                </button>
              )}
              <span className="text-xs text-slate-400 py-1.5">
                {filteredProducts.length} منتج
              </span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              {searchTerm || selectedCategory
                ? "جرب تعديل معايير البحث"
                : "ابدأ بإضافة منتجك الأول"}
            </p>
            {!searchTerm && !selectedCategory && (
              <Link
                href="/admin/dashboard/products/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                إضافة منتج
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const stock = stockBadge(product.stock);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 group"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    {!product.isActive && (
                      <span className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        غير نشط
                      </span>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${stock.class}`}>
                        {stock.text}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {product.category.name}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-slate-900">
                        {product.price.toFixed(2)}
                        <span className="text-xs font-normal text-slate-400 mr-1">د.م.</span>
                      </span>
                      <span className="text-xs text-slate-400">
                        مخزون: {product.stock}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/dashboard/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        عرض
                      </Link>
                      <Link
                        href={`/admin/dashboard/products/${product._id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        تعديل
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deletingId === product._id}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === product._id ? (
                        <span className="animate-spin h-3.5 w-3.5 border-b-2 border-red-600 rounded-full" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
