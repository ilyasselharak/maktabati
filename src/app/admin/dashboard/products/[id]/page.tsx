"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ArrowRight,
  Edit,
  Trash2,
  Package,
  Tag,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Calendar,
  Layers,
  AlertTriangle,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: { _id: string; name: string };
  stock: number;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else if (response.status === 401) {
        router.push("/admin/auth/login");
      }
    } catch (error) {
      console.error("فشل في جلب المنتج:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) fetchProduct();
  }, [params.id, fetchProduct]);

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        router.push("/admin/dashboard/products");
      } else {
        alert("فشل في حذف المنتج");
      }
    } catch {
      alert("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !product?.isActive }),
      });
      if (response.ok) {
        setProduct((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
      }
    } catch (error) {
      console.error("فشل في تحديث الحالة:", error);
    }
  };

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label: "نفد المخزون", class: "bg-red-50 text-red-600 border-red-100", icon: XCircle };
    if (stock <= 5) return { label: "كمية محدودة", class: "bg-amber-50 text-amber-600 border-amber-100", icon: AlertTriangle };
    return { label: "متوفر", class: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 };
  };

  if (isLoading) {
    return (
      <DashboardLayout title="عرض المنتج">
        <div className="flex items-center justify-center py-20">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout title="عرض المنتج">
        <div className="text-center py-20">
          <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">المنتج غير موجود</h3>
          <p className="text-slate-500 text-sm mb-6">المنتج المطلوب غير موجود أو تم حذفه</p>
          <Link href="/admin/dashboard/products" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">
            <ArrowRight className="h-5 w-5" />
            العودة للمنتجات
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const s = stockStatus(product.stock);
  const StatusIcon = s.icon;

  return (
    <DashboardLayout title="عرض المنتج">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard/products" className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">عرض تفاصيل المنتج</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                product.isActive
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {product.isActive ? "إلغاء التفعيل" : "تفعيل"}
            </button>
            <Link
              href={`/admin/dashboard/products/${product._id}/edit`}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50">
                <h3 className="text-base font-bold text-slate-900">صور المنتج</h3>
              </div>
              <div className="p-5">
                {product.images && product.images.length > 0 ? (
                  <>
                    <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={product.images[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div className="flex gap-3">
                        {product.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                              selectedImage === i ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent hover:border-slate-300"
                            }`}
                          >
                            <Image src={img} alt="" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl">
                    <Package className="h-12 w-12 text-slate-300" />
                    <span className="mr-2 text-slate-400 text-sm">لا توجد صور</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">الوصف</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3">العلامات</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-5">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">الحالة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">حالة المنتج</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                    product.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {product.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">حالة المخزون</span>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${s.class}`}>
                    <StatusIcon className="h-3 w-3" />
                    {s.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">التسعير</h3>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-slate-900">{product.price.toFixed(2)}</p>
                <p className="text-sm text-slate-400 mt-1">درهم مغربي</p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">التفاصيل</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">الفئة</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Tag className="h-3.5 w-3.5 text-indigo-500" />
                    {product.category.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">المخزون</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    {product.stock} قطعة
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">الرقم التعريفي</span>
                  <span className="text-xs text-slate-400 font-mono">{product._id.slice(-8)}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">التواريخ</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">تاريخ الإنشاء</span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(product.createdAt).toLocaleDateString("ar-MA")}
                  </span>
                </div>
                {product.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">آخر تحديث</span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(product.updatedAt).toLocaleDateString("ar-MA")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                هل أنت متأكد من حذف &quot;{product.name}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting && <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />}
                  حذف المنتج
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
