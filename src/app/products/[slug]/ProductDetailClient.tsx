"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  Minus,
  Plus,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Package,
  ChevronLeft,
  Store,
  Info,
  CircleCheck,
  ChevronDown,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { _id: string; name: string; slug?: string };
  stock: number;
  isActive: boolean;
  tags?: string[];
  slug?: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { _id: string; name: string; slug?: string };
  stock: number;
  slug?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "delivery" | "returns">("description");
  const [showMobileSticky, setShowMobileSticky] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const images = product?.images?.length ? product.images : [];

  useEffect(() => {
    fetchProduct();
    const handleScroll = () => setShowMobileSticky(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        fetchRelatedProducts(data.product.category._id, data.product._id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string, productId: string) => {
    try {
      const res = await fetch(`/api/products?category=${categoryId}&limit=8`);
      const data = await res.json();
      if (data.products) {
        setRelatedProducts(data.products.filter((p: Product) => p._id !== productId).slice(0, 8));
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const getCart = (): CartItem[] => {
    try {
      const saved = localStorage.getItem("maktabati_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  };

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleAddToCart = () => {
    if (!product || product.stock < 1) {
      showToast("المنتج غير متوفر في المخزون");
      return;
    }
    if (quantity > product.stock) {
      showToast("الكمية تتجاوز المخزون المتاح");
      return;
    }
    const cart = getCart();
    const existing = cart.find((item) => item.product._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({ product, quantity });
    }
    saveCart(cart);
    showToast("تمت الإضافة إلى السلة");
  };

  const handleBuyNow = () => {
    if (!product || product.stock < 1) {
      showToast("المنتج غير متوفر");
      return;
    }
    handleAddToCart();
    router.push("/cart");
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (product && newQty >= 1 && newQty <= Math.min(10, product.stock)) {
      setQuantity(newQty);
    }
  };

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label: "غير متوفر", color: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" };
    if (stock < 5) return { label: "مخزون منخفض", color: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" };
    return { label: "متوفر", color: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product?.name, url: window.location.href }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ الرابط");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Skeleton Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-slate-100 rounded-2xl animate-shimmer" />
              <div className="flex gap-2 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-slate-100 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded-lg w-1/4 animate-shimmer" />
              <div className="h-8 bg-slate-100 rounded-lg animate-shimmer" />
              <div className="h-4 bg-slate-100 rounded-lg w-3/4 animate-shimmer" />
              <div className="h-12 bg-slate-100 rounded-lg w-1/3 animate-shimmer" />
              <div className="h-24 bg-slate-100 rounded-lg animate-shimmer" />
              <div className="h-10 bg-slate-100 rounded-lg animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-slate-900">المنتج غير موجود</h2>
          <p className="text-sm text-slate-500 mt-1">المنتج الذي تبحث عنه غير متوفر</p>
          <button onClick={() => router.push("/")} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const status = stockStatus(product.stock);
  const discountPercent = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-24 end-1/2 translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-sm rounded-xl shadow-lg animate-scale-in">
          {toastMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => router.push("/")} className="hover:text-indigo-600 transition-colors">الرئيسية</button>
          <ChevronLeft className="w-3 h-3 flex-shrink-0" />
          <button onClick={() => router.push(`/categories/${product.category.slug || product.category._id}`)} className="hover:text-indigo-600 transition-colors">{product.category.name}</button>
          <ChevronLeft className="w-3 h-3 flex-shrink-0" />
          <span className="text-slate-900 font-medium truncate max-w-[180px] sm:max-w-[300px]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7 space-y-3">
            <div
              ref={imageRef}
              className="relative aspect-square bg-white rounded-2xl border border-slate-100 overflow-hidden group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 sm:p-8 transition-transform duration-200"
                    style={isZooming ? { transform: `scale(1.5)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                    priority
                  />
                  {/* Zoom hint */}
                  <div className="absolute top-3 end-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    مرر للتكبير
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-20 h-20 text-slate-200" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === i ? "border-indigo-600 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            {/* Category + Stock */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                {product.category.name}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
                {product.stock > 0 && ` — ${product.stock} قطعة`}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">(0 تقييم)</span>
            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
              <span className="text-3xl font-bold text-indigo-600">{product.price.toFixed(2)} د.م.</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">{product.originalPrice.toFixed(2)} د.م.</span>
              )}
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
                  وفر {discountPercent}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{product.description}</p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm font-medium text-slate-700">الكمية:</span>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-4 py-2.5 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={product.stock <= quantity} className="px-4 py-2.5 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                إضافة للسلة
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock < 1}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 text-base"
              >
                <CircleCheck className="w-5 h-5" />
                اشتر الآن
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsFavorite(!isFavorite)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-slate-200 text-slate-600 hover:text-red-500"}`}>
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
                <span className="hidden sm:inline">المفضلة</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 text-sm font-medium transition-all">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">مشاركة</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              {[
                { icon: Truck, text: "توصيل مجاني" },
                { icon: RotateCcw, text: "إرجاع 14 يوم" },
                { icon: Shield, text: "دفع آمن" },
              ].map((f) => (
                <div key={f.text} className="text-center p-3 bg-white rounded-xl border border-slate-100">
                  <f.icon className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Tab Buttons */}
            <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
              {[
                { id: "description" as const, label: "الوصف", icon: Info },
                { id: "delivery" as const, label: "التوصيل", icon: Truck },
                { id: "returns" as const, label: "الإرجاع", icon: RotateCcw },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 sm:px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <Store className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">الفئة</p>
                        <p className="text-xs text-slate-500">{product.category.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <Package className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">المخزون</p>
                        <p className="text-xs text-slate-500">{product.stock} قطعة متوفرة</p>
                      </div>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl sm:col-span-2">
                        <Check className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">العلامات</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {product.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-white text-slate-600 text-xs rounded-md border border-slate-100">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "delivery" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">توصيل سريع</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        نوصل طلباتكم خلال 24-48 ساعة في جميع المدن المغربية. شحن مجاني للطلبات التي تتجاوز 400 درهم.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">تتبع الطلب</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        يمكنك تتبع حالة طلبك في أي وقت. سنتصل بك هاتفياً لتأكيد التوصيل.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "returns" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">سياسة الإرجاع</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام إذا كان غير مستخدم وفي عبوته الأصلية. سيتم استرداد المبلغ كاملاً.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">منتجات مشابهة</h2>
                <p className="text-sm text-slate-500 mt-1">قد تعجبك هذه المنتجات أيضاً</p>
              </div>
              <Link href={`/categories/${product.category.slug || product.category._id}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                عرض الكل <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/products/${rp.slug!}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    {rp.images?.[0] ? (
                      <Image src={rp.images[0]} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    {rp.stock < 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium">غير متوفر</span>
                      </div>
                    )}
                    {rp.originalPrice && (
                      <span className="absolute top-2.5 start-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        وفر {Math.round((1 - rp.price / rp.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <span className="text-[10px] sm:text-xs text-slate-500">{rp.category?.name || "منتج"}</span>
                    <h3 className="font-medium text-slate-900 mt-1 line-clamp-1 text-sm sm:text-base">{rp.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-indigo-600 text-sm sm:text-base">{rp.price.toFixed(2)} د.م.</span>
                      {rp.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">{rp.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Buy Bar */}
      {showMobileSticky && product.stock > 0 && (
        <div className="fixed bottom-0 start-0 end-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-3 sm:hidden" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-2.5 hover:bg-slate-200 disabled:opacity-30 transition-colors">
                <Minus className="w-4 h-4 text-slate-600" />
              </button>
              <span className="w-8 text-center font-bold text-slate-900 text-sm">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={product.stock <= quantity} className="px-3 py-2.5 hover:bg-slate-200 disabled:opacity-30 transition-colors">
                <Plus className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">المجموع</p>
              <p className="text-lg font-bold text-slate-900">{(product.price * quantity).toFixed(2)} د.م.</p>
            </div>
            <button onClick={handleAddToCart} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
              <ShoppingCart className="w-4 h-4" />
              أضف للسلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
