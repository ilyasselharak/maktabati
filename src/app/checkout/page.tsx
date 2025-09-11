"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  User,
  MapPin,
  Phone,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  stock: number;
  isActive: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderFormData {
  name: string;
  city: string;
  phone: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    city: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يكون على الأقل حرفين";
    }

    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^0[6-7]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "رقم الهاتف غير صحيح (يجب أن يكون 10 أرقام ويبدأ بـ 06 أو 07)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert("السلة فارغة. يرجى إضافة منتجات أولاً.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: formData.name.trim(),
          city: formData.city.trim(),
          phone: formData.phone.trim(),
        },
        items: cartItems.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        })),
        totalAmount: getTotalPrice(),
        totalItems: getTotalItems(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderId(result.orderId);
        setOrderPlaced(true);

        // Clear cart after successful order
        localStorage.removeItem("maktabati_cart");
        setCartItems([]);
      } else {
        const error = await response.json();
        alert(`حدث خطأ: ${error.message || "فشل في حفظ الطلب"}`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and no order was placed, redirect to products
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header
          cartCount={0}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          currentPage="/checkout"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              السلة فارغة
            </h1>
            <p className="text-gray-600 mb-8">
              لا يمكنك إتمام الطلب بدون منتجات في السلة
            </p>
            <Link
              href="/products"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              تصفح المنتجات
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Success page
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header
          cartCount={0}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          currentPage="/checkout"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                تم تأكيد الطلب بنجاح!
              </h1>
              <p className="text-gray-600 mb-6">
                شكراً لك {formData.name}! تم استلام طلبك بنجاح.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
                <p className="text-sm text-gray-600 mb-1">رقم الطلب:</p>
                <p className="text-lg font-bold text-gray-900">#{orderId}</p>
              </div>

              <p className="text-sm text-gray-600 mb-8">
                سيتم التواصل معك قريباً عبر رقم الهاتف {formData.phone} لتأكيد
                التفاصيل وإتمام عملية التسليم.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  متابعة التسوق
                </Link>
                <Link
                  href="/"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Checkout form
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        cartCount={getTotalItems()}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        currentPage="/checkout"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-indigo-600">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-indigo-600">
            السلة
          </Link>
          <span>/</span>
          <span className="text-gray-900">إتمام الطلب</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                معلومات الطلب
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    المدينة *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="أدخل اسم مدينتك"
                    />
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="06XXXXXXXX أو 07XXXXXXXX"
                    />
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    مثال: 0612345678 أو 0712345678
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      تأكيد الطلب
                      <CheckCircle className="h-5 w-5 mr-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-1 lg:order-2" dir="rtl">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                ملخص الطلب
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-3 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {(item.product.price * item.quantity).toFixed(2)} د.م.
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                    <div className="relative w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-black">
                    {getTotalItems()}
                  </span>
                  <span className="text-gray-600">عدد المنتجات:</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-green-600">مجاني</span>
                  <span className="text-gray-600">الشحن:</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-indigo-600">
                    {getTotalPrice().toFixed(2)} د.م.
                  </span>
                  <span className="text-black">المجموع الكلي:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
