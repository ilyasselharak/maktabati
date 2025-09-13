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
  ChevronLeft,
  Package,
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    // Trigger a custom event to notify the header of cart update
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
      newQuantity = product.stock; // Don't allow quantity above stock
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      updateCartInStorage(newItems);
      return newItems;
    });
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => item.product._id !== productId
      );
      updateCartInStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartInStorage([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <div className="bg-gray-50" dir="rtl">
      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-indigo-600">
            الرئيسية
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-gray-900">السلة</span>
        </nav>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              السلة فارغة
            </h1>
            <p className="text-gray-600 mb-8">
              لم تقم بإضافة أي منتجات إلى السلة بعد
            </p>
            <Link
              href="/products"
              className="bg-indigo-600 text-black px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              تصفح المنتجات
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      مسح الكل
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                      السلة ({getTotalItems()} منتج)
                    </h1>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            الفئة: {item.product.category.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            متوفر: {item.product.stock} قطعة
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="p-1 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 px-2 text-center text-black font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="p-1 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-left">
                          <p className="text-lg font-bold text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)}{" "}
                            د.م.
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.product.price.toFixed(2)} د.م. / الوحدة
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between ">
                    <span className="font-medium text-black">
                      {getTotalItems()}
                    </span>
                    <span className="text-gray-600">عدد المنتجات:</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-black">
                      {getTotalPrice().toFixed(2)} د.م.
                    </span>
                    <span className="text-gray-600">المجموع الفرعي:</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-green-600">مجاني</span>
                    <span className="text-gray-600">الشحن:</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-indigo-600">
                        {getTotalPrice().toFixed(2)} د.م.
                      </span>
                      <span className="text-black">المجموع الكلي:</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block text-center"
                  >
                    إتمام الشراء
                  </Link>

                  <Link
                    href="/products"
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block text-center"
                  >
                    متابعة التسوق
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
