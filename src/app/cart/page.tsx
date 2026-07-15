"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Package,
  Gift,
  ShieldCheck,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug?: string;
  };
  images: string[];
  stock: number;
  isActive: boolean;
  slug?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }

    // Listen to cart updates from other pages/components
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem("maktabati_cart");
      if (updatedCart) {
        try {
          setCartItems(JSON.parse(updatedCart));
        } catch (error) {
          console.error("Error updating cart from event:", error);
        }
      } else {
        setCartItems([]);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    const product = cartItems.find(
      (item) => item.product._id === productId
    )?.product;
    if (product && newQuantity > product.stock) {
      newQuantity = product.stock;
    }
    const currentCart = JSON.parse(localStorage.getItem("maktabati_cart") || "[]");
    const newItems = currentCart.map((item: CartItem) =>
      item.product._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCartInStorage(newItems);
  };

  const removeItem = (productId: string) => {
    const currentCart = JSON.parse(localStorage.getItem("maktabati_cart") || "[]");
    const newItems = currentCart.filter(
      (item: CartItem) => item.product._id !== productId
    );
    updateCartInStorage(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartInStorage([]);
  };

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  const getShippingCost = () => (getTotalPrice() > 400 ? 0 : 40);

  return (
    <div className="bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-slate-900 font-medium">السلة</span>
        </nav>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-20">
            <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              السلة فارغة
            </h1>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              لم تقم بإضافة أي منتجات إلى السلة بعد. ابدأ التسوق واكتشف منتجاتنا المميزة
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300"
            >
              تصفح المنتجات
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h1 className="text-xl font-bold text-slate-900">
                    السلة ({getTotalItems()} منتج)
                  </h1>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    مسح الكل
                  </button>
                </div>

                <div className="divide-y divide-slate-50">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug!}`}
                            className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-slate-500 mt-1">
                            {item.product.category.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            متوفر: {item.product.stock} قطعة
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-left min-w-[90px]">
                          <p className="text-lg font-bold text-slate-900">
                            {(item.product.price * item.quantity).toFixed(2)} د.م.
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.product.price.toFixed(2)} د.م. / الوحدة
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          aria-label="إزالة"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-6 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                متابعة التسوق
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">عدد المنتجات</span>
                    <span className="font-bold text-slate-900">
                      {getTotalItems()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">المجموع الفرعي</span>
                    <span className="font-bold text-slate-900">
                      {getTotalPrice().toFixed(2)} د.م.
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">الشحن</span>
                    <span className={`font-bold ${getShippingCost() === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                      {getShippingCost() === 0 ? "مجاني" : `${getShippingCost().toFixed(2)} د.م.`}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-slate-900">المجموع الكلي</span>
                      <span className="text-indigo-600">
                        {(getTotalPrice() + getShippingCost()).toFixed(2)} د.م.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 inline-block text-center"
                  >
                    إتمام الشراء
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>دفع آمن 100%</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Gift className="h-4 w-4 text-indigo-500" />
                    <span>توصيل مجاني للطلبات فوق 400 د.م.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>ضمان استرجاع خلال 14 يوماً</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
