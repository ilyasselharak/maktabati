"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Check,
  X,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  FolderOpen,
  Grid3x3,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryStats {
  totalCategories: number;
  totalProducts: number;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
        setStats({ totalCategories: data.categories.length, totalProducts: 0 });
      } else {
        setError(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/categories?id=${deletingCategory._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("تم حذف الفئة بنجاح");
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchCategories();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "حدث خطأ أثناء حذف الفئة");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("حدث خطأ أثناء حذف الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="إدارة الفئات">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">إدارة الفئات</h1>
            <p className="text-slate-500 text-sm mt-1">مراقبة وإدارة فئات المنتجات في المتجر</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/dashboard/categories"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <Grid3x3 className="h-4 w-4" />
              عرض البطاقات
            </Link>
            <Link
              href="/admin/dashboard/categories/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              إضافة فئة
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: "إجمالي الفئات", value: stats?.totalCategories || 0, icon: FolderOpen, gradient: "from-indigo-500 to-violet-400" },
            { title: "إجمالي المنتجات", value: "—", icon: ShoppingBag, gradient: "from-emerald-500 to-teal-400" },
            { title: "متوسط المنتجات/فئة", value: "—", icon: BarChart3, gradient: "from-amber-500 to-orange-400" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في الفئات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-900">جميع الفئات</h3>
            <p className="text-xs text-slate-400 mt-0.5">إدارة فئات المنتجات ومراقبة الأداء</p>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
                <FolderOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{searchTerm ? "لم يتم العثور على فئات" : "لا توجد فئات"}</h3>
              <p className="text-slate-500 text-sm">{searchTerm ? "جرب تعديل كلمات البحث" : "ابدأ بإضافة فئتك الأولى"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">الفئة</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">الوصف</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">المنتجات</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">تاريخ الإنشاء</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 max-w-xs truncate">{category.description || "لا يوجد وصف"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                          0 منتج
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(category.createdAt).toLocaleDateString("ar-MA")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/dashboard/categories/edit/${category._id}`}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => { setDeletingCategory(category); setShowDeleteModal(true); }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-slate-500 mb-6">
                هل أنت متأكد من حذف &quot;{deletingCategory?.name}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
