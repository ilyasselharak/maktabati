"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import { ArrowLeft, Check, AlertTriangle, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchCategory = useCallback(async () => {
    try {
      // You would typically have a separate API endpoint to get a single category
      // For now, we'll fetch all categories and find the one we need
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        const category = data.categories.find(
          (cat: Category) => cat._id === categoryId
        );
        if (category) {
          setOriginalData(category);
          setFormData({
            name: category.name,
            description: category.description || "",
          });
        } else {
          setError("الفئة غير موجودة");
        }
      } else {
        setError(data.error || "فشل في تحميل الفئة");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("فشل في تحميل الفئة");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, fetchCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: categoryId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setOriginalData((prev) => (prev ? { ...prev, ...formData } : null));
        setTimeout(() => {
          window.location.href = "/admin/dashboard/categories";
        }, 2000);
      } else {
        setError(data.error || "حدث خطأ أثناء تحديث الفئة");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("حدث خطأ أثناء تحديث الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      formData.name !== originalData.name ||
      formData.description !== (originalData.description || "")
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout title="تحميل...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !originalData) {
    return (
      <DashboardLayout title="خطأ">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              خطأ في تحميل الفئة
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              href="/admin/dashboard/categories"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              العودة إلى الفئات
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (success) {
    return (
      <DashboardLayout title="تم التحديث">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              تم تحديث الفئة بنجاح!
            </h2>
            <p className="text-green-700 mb-4">
              سيتم توجيهك إلى صفحة الفئات خلال ثوانٍ...
            </p>
            <Link
              href="/admin/dashboard/categories"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              العودة إلى الفئات
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="تعديل الفئة">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard/categories"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 ml-2" />
              العودة
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تعديل الفئة</h1>
              <p className="text-gray-600 mt-1">تعديل بيانات الفئة المحددة</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Current Category Info */}
        {originalData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              معلومات الفئة الحالية:
            </h3>
            <div className="text-sm text-blue-800">
              <p>
                <strong>الاسم:</strong> {originalData.name}
              </p>
              <p>
                <strong>الوصف:</strong>{" "}
                {originalData.description || "لا يوجد وصف"}
              </p>
              <p>
                <strong>تاريخ الإنشاء:</strong>{" "}
                {new Date(originalData.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  اسم الفئة *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="مثال: الكتب المدرسية"
                />
                <p className="mt-1 text-sm text-gray-500">
                  أدخل اسم الفئة بشكل واضح ومفهوم
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  وصف الفئة
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="وصف تفصيلي للفئة والمنتجات التي تحتوي عليها..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  وصف اختياري لمساعدة العملاء في فهم محتوى الفئة
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/dashboard/categories"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.name.trim() || !hasChanges()
                  }
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري التحديث..." : "تحديث الفئة"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Changes Summary */}
        {hasChanges() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">
              التغييرات المكتشفة:
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              {formData.name !== originalData?.name && (
                <li>
                  • تم تغيير الاسم من &quot;{originalData?.name}&quot; إلى
                  &quot;{formData.name}&quot;
                </li>
              )}
              {formData.description !== (originalData?.description || "") && (
                <li>• تم تعديل الوصف</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
