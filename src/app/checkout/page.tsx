"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Check,
  Truck,
  Shield,
  CreditCard,
  User,
  MapPin,
  Phone,
  Package,
  ChevronLeft,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface FormData {
  name: string;
  city: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", city: "", phone: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderId, setOrderId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch { /* ignore */ }
    }
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 400 ? 0 : 40;
  const total = subtotal + shipping;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const validate = () => {
    const errs: Partial<FormData> = {};
    if (!formData.name.trim()) errs.name = "الاسم مطلوب";
    if (!formData.city.trim()) errs.city = "المدينة مطلوبة";
    if (!formData.phone.trim()) errs.phone = "رقم الهاتف مطلوب";
    else if (!/^0[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) errs.phone = "رقم الهاتف غير صحيح";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearCart = () => {
    localStorage.setItem("maktabati_cart", JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) {
      showToast("السلة فارغة");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
          },
          items: cartItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            total: item.product.price * item.quantity,
          })),
          totalAmount: total,
          totalItems,
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        setOrderId(data.orderId);
        setIsSuccess(true);
        clearCart();
      } else {
        showToast(data.error || "فشل في إتمام الطلب");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("فشل في إتمام الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-slate-900">السلة فارغة</h2>
          <p className="text-sm text-slate-500 mt-1">أضف منتجات إلى السلة للمتابعة</p>
          <button onClick={() => router.push("/products")} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {toastMsg && (
        <div className="fixed top-20 end-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-sm rounded-xl shadow-lg">
          {toastMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <button onClick={() => router.push("/")} className="hover:text-indigo-600 transition-colors">الرئيسية</button>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/cart" className="hover:text-indigo-600 transition-colors">السلة</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-slate-900 font-medium">إتمام الشراء</span>
        </nav>

        {!isSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">معلومات الشحن</h2>
                    <p className="text-sm text-slate-500">أدخل بياناتك لإتمام الطلب</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full pe-10 ps-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.name ? "border-red-300 bg-red-50/30" : "border-slate-200"}`} placeholder="أدخل اسمك الكامل" />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">المدينة</label>
                    <div className="relative">
                      <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={`w-full pe-10 ps-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.city ? "border-red-300 bg-red-50/30" : "border-slate-200"}`} placeholder="أدخل مدينتك" />
                    </div>
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`w-full pe-10 ps-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.phone ? "border-red-300 bg-red-50/30" : "border-slate-200"}`} placeholder="مثال: 0612345678" />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" /> تأكيد الطلب
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="lg:sticky lg:top-6 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-900 mb-4">ملخص الطلب</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="flex gap-3 p-2 rounded-xl bg-slate-50">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-slate-200">
                              <Package className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-slate-500">الكمية: {item.quantity}</p>
                          <p className="text-sm font-bold text-indigo-600">{(item.product.price * item.quantity).toFixed(2)} د.م.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>المجموع الفرعي ({totalItems} منتج)</span>
                      <span>{subtotal.toFixed(2)} د.م.</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> الشحن</span>
                      <span>{shipping === 0 ? "مجاني" : `${shipping.toFixed(2)} د.م.`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>المجموع الكلي</span>
                      <span className="text-indigo-600">{total.toFixed(2)} د.م.</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" /> دفع آمن
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" /> توصيل مجاني للطلبات فوق 400 د.م.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">تم تأكيد طلبك بنجاح</h2>
            <p className="text-slate-500 mb-2">شكراً لشرائك</p>
            {orderId && <p className="text-sm font-medium text-indigo-600 mb-6">رقم الطلب: #{orderId}</p>}
            <p className="text-sm text-slate-500 mb-6">سنقوم بالاتصال بك قريباً لتأكيد تفاصيل التوصيل</p>
            <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">
              <ArrowRight className="w-4 h-4" /> العودة للتسوق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
