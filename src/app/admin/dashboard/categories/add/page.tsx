"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/DashboardLayout";
import { ArrowLeft, Check, AlertTriangle } from "lucide-react";

export default function AddCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", description: "" });
        setTimeout(() => {
          window.location.href = "/admin/dashboard/categories";
        }, 2000);
      } else {
        setError(data.error || "حدث خطأ أثناء إضافة الفئة");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError("حدث خطأ أثناء إضافة الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-900 mb-2">
            تم إضافة الفئة بنجاح!
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
    );
  }

  return (
    <DashboardLayout title="إضافة فئة جديدة">
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
              <h1 className="text-2xl font-bold text-gray-900">
                إضافة فئة جديدة
              </h1>
              <p className="text-gray-600 mt-1">
                أضف فئة منتج جديدة إلى المتجر
              </p>
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
                  disabled={isSubmitting || !formData.name.trim()}
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإضافة..." : "إضافة الفئة"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            نصائح لإنشاء فئات فعالة:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• استخدم أسماء واضحة ومفهومة للعملاء</li>
            <li>• تجنب الأسماء الطويلة جداً</li>
            <li>• أضف وصف مفيد للمساعدة في البحث</li>
            <li>• تأكد من عدم تكرار الأسماء الموجودة</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
