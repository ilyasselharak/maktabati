"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../../components/DashboardLayout";
import {
  ArrowRight,
  Save,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
  tags: string[];
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    tags: "",
    isActive: true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const fetchProduct = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const p = data.product;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          category: p.category._id,
          stock: p.stock.toString(),
          tags: p.tags?.join(", ") || "",
          isActive: p.isActive,
        });
        setImageUrls(p.images || []);
      }
    } catch (error) {
      console.error("فشل في جلب المنتج:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

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

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [fetchProduct]);

  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    setError("");
    const newImages = Array.from(files);
    const uploadedUrls: string[] = [];

    for (const file of newImages) {
      if (file.size > 10 * 1024 * 1024) continue;
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        const token = localStorage.getItem("adminToken");
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      } catch {
        /* ignore */
      }
    }
    if (uploadedUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    }
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: imageUrls,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
            : [],
        }),
      });

      if (response.ok) {
        setSuccess("تم تحديث المنتج بنجاح!");
        setTimeout(() => router.push("/admin/dashboard/products"), 1500);
      } else {
        const data = await response.json();
        setError(data.error || "فشل في تحديث المنتج");
      }
    } catch {
      setError("خطأ في الشبكة");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout title="تعديل المنتج">
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
    <DashboardLayout title="تعديل المنتج">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/products" className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">تعديل المنتج</h2>
            <p className="text-sm text-slate-500 mt-0.5">تحديث معلومات المنتج</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">المعلومات الأساسية</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">اسم المنتج *</label>
                <input
                  type="text" id="name" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                  placeholder="اسم المنتج"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">الفئة *</label>
                <select
                  id="category" name="category" required
                  value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                >
                  <option value="">اختر فئة</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">الوصف *</label>
              <textarea
                id="description" name="description" required rows={4}
                value={formData.description} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                placeholder="وصف تفصيلي للمنتج..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">السعر (د.م.) *</label>
                <input
                  type="number" id="price" name="price" required min="0" step="0.01"
                  value={formData.price} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                  placeholder="29.99"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-2">المخزون *</label>
                <input
                  type="number" id="stock" name="stock" required min="0"
                  value={formData.stock} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-slate-700 mb-2">العلامات</label>
              <input
                type="text" id="tags" name="tags"
                value={formData.tags} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all"
                placeholder="مدرسة، رياضيات، كتب (افصل بفواصل)"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">المنتج نشط ومتاح للبيع</span>
            </label>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">صور المنتج</h3>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
              <div className="text-center">
                <ImageIcon className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">رفع صور</span>
                  <input
                    id="image-upload" type="file" multiple accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="sr-only"
                    disabled={isUploading}
                  />
                </label>
                <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF حتى 10 ميجابايت</p>
              </div>
            </div>

            {isUploading && (
              <div className="text-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mx-auto" />
                <p className="text-xs text-slate-500 mt-1">جاري رفع الصور...</p>
              </div>
            )}

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 left-1.5 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link
              href="/admin/dashboard/products"
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
