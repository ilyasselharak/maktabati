"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Palette,
  PenTool,
  Truck,
  Shield,
  Award,
  Heart,
  ChevronLeft,
  Star,
  ShoppingBag,
  Users,
  School,
  ArrowLeft,
  Headphones,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

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
  tags?: string[];
  slug?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="count-up">
      {count.toLocaleString("ar-MA")}{suffix}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [categories, setCategories] = useState<{ _id: string; name: string; slug?: string }[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
    loadCart();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch { /* ignore */ }
    }
  };

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    const existingItem = cartItems.find((item) => item.product._id === product._id);
    let newItems;
    if (existingItem) {
      newItems = cartItems.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      );
    } else {
      newItems = [...cartItems, { product, quantity: 1 }];
    }
    updateCartInStorage(newItems);
  };

  const updateQuantity = (product: Product, quantity: number) => {
    const newItems = cartItems.map((item) =>
      item.product._id === product._id ? { ...item, quantity } : item
    );
    updateCartInStorage(newItems);
  };

  const removeFromCart = (product: Product) => {
    const newItems = cartItems.filter((item) => item.product._id !== product._id);
    updateCartInStorage(newItems);
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products/featured");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryMeta = (name: string) => {
    const metaMap: Record<string, { icon: typeof BookOpen; color: string; image: string }> = {
      "الكتب المدرسية": { icon: BookOpen, color: "from-blue-500 to-indigo-400", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop" },
      "أدوات الكتابة": { icon: PenTool, color: "from-emerald-500 to-teal-400", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" },
      "لوازم الفنون": { icon: Palette, color: "from-violet-500 to-purple-400", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop" },
      "الحاسبات": { icon: Calculator, color: "from-amber-500 to-orange-400", image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400&h=300&fit=crop" },
    };
    return metaMap[name] || { icon: BookOpen, color: "from-indigo-500 to-purple-400", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop" };
  };

  const features = [
    { icon: Truck, title: "توصيل سريع", description: "شحن مجاني للطلبات فوق 400 د.م." },
    { icon: Shield, title: "دفع آمن", description: "معالجة دفع آمنة 100%" },
    { icon: Award, title: "ضمان الجودة", description: "لوازم مدرسية فاخرة عالية الجودة" },
    { icon: Headphones, title: "دعم 24/7", description: "فريق خدمة العملاء جاهز دائماً" },
  ];

  const stats = [
    { icon: Users, value: 10000, suffix: "+", label: "طالب سعيد" },
    { icon: ShoppingBag, value: 5000, suffix: "+", label: "منتج متوفر" },
    { icon: School, value: 50, suffix: "+", label: "مدرسة شريكة" },
  ];

  const testimonials = [
    {
      name: "أحمد العلوي",
      role: "طالب جامعي",
      text: "أفضل متجر للوازم المدرسية! الأسعار ممتازة والتوصيل سريع جداً. أنصح الجميع بالتسوق من هنا.",
      rating: 5,
    },
    {
      name: "فاطمة الزهراء",
      role: "أم لثلاثة أطفال",
      text: "وفر عليّ الكثير من الوقت والجهد. أجد كل ما أحتاجه لأولادي في مكان واحد وجودة رائعة.",
      rating: 5,
    },
    {
      name: "يوسف بناني",
      role: "مدرس",
      text: "أوصي طلابي دائماً بالتسوق من مكتبتي. منتجات عالية الجودة بأسعار مناسبة للجميع.",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white" dir="rtl">
      {/* ── Banner ── */}
      <section className="w-full">
        {/* Desktop Banner */}
        <Image
          src="/banner.png"
          alt="مكتبتي - لوازم المدرسة"
          width={1440}
          height={400}
          className="w-full h-auto object-cover hidden md:block"
          priority
        />
        {/* Mobile Banner */}
        <Image
          src="/banner-mb.png"
          alt="مكتبتي - لوازم المدرسة"
          width={768}
          height={500}
          className="w-full h-auto object-cover md:hidden"
          priority
        />
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-slate-50 hover:bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 border border-transparent hover:border-slate-100"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 group-hover:bg-indigo-600 rounded-xl mb-4 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
              الفئات
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              تسوق حسب الفئة
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              ابحث عن ما تحتاجه بالضبط من فئاتنا المختارة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length === 0 ? (
              // Loading skeleton for categories
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                  <div className="h-48 bg-slate-100 animate-shimmer" />
                  <div className="p-5">
                    <div className="h-5 bg-slate-100 rounded-lg mb-3 w-2/3 animate-shimmer" />
                    <div className="h-3 bg-slate-100 rounded-lg mb-4 w-full animate-shimmer" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/3 animate-shimmer" />
                  </div>
                </div>
              ))
            ) : (
              categories.map((category) => {
                const meta = getCategoryMeta(category.name);
                const Icon = meta.icon;
                return (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug || category._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={meta.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className={`absolute top-4 start-4 p-2.5 rounded-xl bg-gradient-to-r ${meta.color} shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                          {category.name}
                        </h3>
                        <div className="flex items-center text-indigo-600 font-semibold text-sm group/link">
                          <span>تسوق الآن</span>
                          <ChevronLeft className="me-1 h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
                المنتجات المميزة
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                الأكثر مبيعاً
              </h2>
              <p className="text-lg text-slate-500 mt-2">
                اكتشف أكثر لوازم المدرسة شعبية لدينا
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl"
            >
              عرض الكل
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                >
                  <div className="h-48 bg-slate-100 animate-shimmer" />
                  <div className="p-4">
                    <div className="h-3 bg-slate-100 rounded-lg mb-3 w-1/3 animate-shimmer" />
                    <div className="h-4 bg-slate-100 rounded-lg mb-3 animate-shimmer" />
                    <div className="h-3 bg-slate-100 rounded-lg mb-4 w-3/4 animate-shimmer" />
                    <div className="h-7 bg-slate-100 rounded-lg w-1/4 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  cartItems={cartItems}
                  onAddToCart={addToCart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 group-hover:bg-white/15 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-white/90" />
                  </div>
                  <div className="text-5xl font-bold mb-2 text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-slate-400 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3 block">
              آراء العملاء
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              ما يقوله عملاؤنا
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              نفخر بثقة آلاف الطلاب وأولياء الأمور فينا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 start-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                جاهز للتسوق؟
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-lg mx-auto">
                اكتشف تشكيلتنا الواسعة من لوازم المدرسة وابدأ رحلتك التعليمية بنجاح
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:shadow-lg transition-all duration-300"
              >
                ابدأ التسوق الآن
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
