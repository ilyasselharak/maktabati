"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Package,
  Calendar,
  Tag,
  Eye,
  EyeOff,
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
  createdAt: string;
  updatedAt: string;
}

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else if (response.status === 401) {
        router.push("/admin/auth/login");
      } else {
        console.error("فشل في جلب المنتج");
      }
    } catch (error) {
      console.error("فشل في جلب المنتج:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (
      !confirm(
        "هل أنت متأكد من أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/admin/dashboard/products");
      } else {
        alert("فشل في حذف المنتج. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("فشل في حذف المنتج:", error);
      alert("حدث خطأ أثناء حذف المنتج.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !product?.isActive,
        }),
      });

      if (response.ok) {
        setProduct((prev) =>
          prev ? { ...prev, isActive: !prev.isActive } : null
        );
      } else {
        alert("فشل في تحديث حالة المنتج.");
      }
    } catch (error) {
      console.error("فشل في تحديث حالة المنتج:", error);
      alert("حدث خطأ أثناء تحديث حالة المنتج.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="عرض المنتج">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout title="عرض المنتج">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            المنتج غير موجود
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            المنتج المطلوب غير موجود أو تم حذفه.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/dashboard/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              العودة للمنتجات
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="عرض المنتج">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Link
              href="/admin/dashboard/products"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-gray-600">عرض تفاصيل المنتج</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                product.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {product.isActive ? (
                <>
                  <EyeOff className="h-5 w-5 mr-2" />
                  إلغاء التفعيل
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 mr-2" />
                  تفعيل
                </>
              )}
            </button>
            <Link
              href={`/admin/dashboard/products/${product._id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-5 w-5 mr-2" />
              تعديل
            </Link>
            <button
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  صور المنتج
                </h3>
              </div>
              <div className="p-4">
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`${product.name} - صورة ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <Package className="h-12 w-12 text-gray-400" />
                    <span className="ml-2 text-gray-500">لا توجد صور</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  معلومات أساسية
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    الاسم
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    الوصف
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    السعر
                  </label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {product.price.toFixed(2)} ريال
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    الفئة
                  </label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {product.category.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock & Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  المخزون والحالة
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    المخزون
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.stock} قطعة
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    الحالة
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    تاريخ الإنشاء
                  </label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(product.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                {product.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      تاريخ آخر تحديث
                    </label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(product.updatedAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
