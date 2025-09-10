"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("فشل في جلب الفئات:", error);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    setError("");

    const newImages = Array.from(files);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    // Validate files before upload
    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (newImages.length > maxFiles) {
      setError(`يمكن رفع ${maxFiles} صور كحد أقصى`);
      setIsUploading(false);
      return;
    }

    for (const file of newImages) {
      // Validate file size
      if (file.size > maxFileSize) {
        failedUploads.push(`${file.name}: حجم الملف كبير جداً`);
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        failedUploads.push(`${file.name}: نوع الملف غير مدعوم`);
        continue;
      }

      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const token = localStorage.getItem("adminToken");
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const errorData = await response.json().catch(() => ({}));
          failedUploads.push(`${file.name}: ${errorData.error || "فشل الرفع"}`);
        }
      } catch (error) {
        console.error("Upload error for", file.name, ":", error);
        failedUploads.push(`${file.name}: فشل الرفع`);
      }
    }

    if (uploadedUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setImages((prev) => [
        ...prev,
        ...newImages.slice(0, uploadedUrls.length),
      ]);
    }

    if (failedUploads.length > 0) {
      const errorMessage =
        failedUploads.length === newImages.length
          ? "فشل في رفع جميع الصور:\n" + failedUploads.join("\n")
          : "تم رفع بعض الصور بنجاح، لكن فشل في رفع:\n" +
            failedUploads.join("\n");
      setError(errorMessage);
    } else if (uploadedUrls.length > 0) {
      setSuccess(`تم رفع ${uploadedUrls.length} صورة بنجاح`);
      setTimeout(() => setSuccess(""), 3000);
    }

    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: imageUrls,
        }),
      });

      if (response.ok) {
        setSuccess("تم إنشاء المنتج بنجاح!");
        setTimeout(() => {
          router.push("/admin/dashboard/products");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "فشل في إنشاء المنتج");
      }
    } catch (error) {
      setError("خطأ في الشبكة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout title="إضافة منتج">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            العودة إلى المنتجات
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              إضافة منتج جديد
            </h3>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="كتاب الرياضيات"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    الفئة *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  الوصف *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="وصف تفصيلي للمنتج..."
                />
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    السعر ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    كمية المخزون *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور المنتج *
                </label>

                {/* Image Upload Area */}
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          رفع صور المنتج
                        </span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files && handleImageUpload(e.target.files)
                          }
                          className="sr-only"
                          disabled={isUploading}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF حتى 10 ميجابايت لكل ملف
                      </p>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                      جاري رفع الصور...
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || imageUrls.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري إنشاء المنتج...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      إنشاء المنتج
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
