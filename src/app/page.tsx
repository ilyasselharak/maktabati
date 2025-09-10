"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Palette,
  PenTool,
  Search,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  Package,
  Heart,
  ChevronRight,
  Menu,
  X,
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
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products/featured");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products.slice(0, 6)); // Show first 6 products
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    {
      name: "الكتب المدرسية",
      icon: BookOpen,
      description: "الكتب المدرسية الأكاديمية لجميع المواد",
      color: "bg-blue-500",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    },
    {
      name: "أدوات الكتابة",
      icon: PenTool,
      description: "الأقلام والقلم الرصاص ولوازم الكتابة",
      color: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    },
    {
      name: "لوازم الفنون",
      icon: Palette,
      description: "مواد الرسم والتلوين",
      color: "bg-purple-500",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    },
    {
      name: "الحاسبات",
      icon: Calculator,
      description: "الحاسبات العلمية والرسوم البيانية",
      color: "bg-orange-500",
      image:
        "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400&h=300&fit=crop",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "توصيل مجاني",
      description: "شحن مجاني للطلبات فوق 50 دولار",
    },
    {
      icon: Shield,
      title: "دفع آمن",
      description: "معالجة دفع آمنة 100%",
    },
    {
      icon: Award,
      title: "ضمان الجودة",
      description: "لوازم مدرسية فاخرة عالية الجودة",
    },
    {
      icon: Heart,
      title: "مفضل للطلاب",
      description: "موثوق به من قبل الطلاب في جميع أنحاء البلاد",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">مكتبتي</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-900 hover:text-indigo-600 font-medium"
              >
                الرئيسية
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:text-indigo-600"
              >
                المنتجات
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-indigo-600"
              >
                الفئات
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-indigo-600"
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-indigo-600"
              >
                اتصل بنا
              </Link>
            </nav>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="البحث عن المنتجات..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-indigo-600">
                <ShoppingCart className="h-6 w-6" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-900 hover:text-indigo-600 font-medium px-2 py-1"
                >
                  الرئيسية
                </Link>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-1"
                >
                  المنتجات
                </Link>
                <Link
                  href="/categories"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-1"
                >
                  الفئات
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-1"
                >
                  من نحن
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600 px-2 py-1"
                >
                  اتصل بنا
                </Link>
                <div className="px-2 py-1">
                  <input
                    type="text"
                    placeholder="البحث عن المنتجات..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                متجرك الشامل لـ
                <span className="text-yellow-300">لوازم المدرسة</span>
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                اكتشف الكتب المدرسية الفاخرة، أدوات الكتابة، لوازم الفنون، وكل
                ما يحتاجه الطلاب للنجاح. منتجات عالية الجودة بأسعار معقولة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                >
                  تسوق الآن
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/categories"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200 flex items-center justify-center"
                >
                  تصفح الفئات
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Image
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop"
                  alt="School supplies"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              تسوق حسب الفئة
            </h2>
            <p className="text-xl text-gray-600">
              ابحث عن ما تحتاجه بالضبط من فئاتنا المختارة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={index}
                  href={`/categories/${category.name
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative h-48">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div
                        className={`absolute top-4 left-4 p-2 rounded-lg ${category.color}`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-indigo-600 font-medium">
                        تسوق الآن
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                المنتجات المميزة
              </h2>
              <p className="text-xl text-gray-600">
                اكتشف أكثر لوازم المدرسة شعبية لدينا
              </p>
            </div>
            <Link
              href="/products"
              className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center"
            >
              عرض الكل
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative h-64 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {product.category.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        أضف إلى السلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-200">طالب سعيد</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-indigo-200">منتج متوفر</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">مدرسة شريكة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 order-3 md:order-1">
              <div className="flex items-center justify-end space-x-2 mb-4">
                <span className="text-2xl font-bold">مكتبتي</span>
                <BookOpen className="h-8 w-8 text-indigo-400" />
              </div>
              <p className="text-gray-400 mb-4 text-right">
                شريكك الموثوق للوازم المدرسية عالية الجودة. نحن نوفر كل ما
                يحتاجه الطلاب للنجاح الأكاديمي.
              </p>
              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/auth/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  دخول المدير
                </Link>
              </div>
            </div>

            <div className="order-2 md:order-2">
              <h3 className="text-lg font-semibold mb-4 text-right">
                روابط سريعة
              </h3>
              <ul className="space-y-2">
                <li className="text-right">
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-white"
                  >
                    المنتجات
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/categories"
                    className="text-gray-400 hover:text-white"
                  >
                    الفئات
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    من نحن
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>

            <div className="order-1 md:order-3">
              <h3 className="text-lg font-semibold mb-4 text-right">الفئات</h3>
              <ul className="space-y-2">
                <li className="text-right">
                  <Link
                    href="/categories/textbooks"
                    className="text-gray-400 hover:text-white"
                  >
                    الكتب المدرسية
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/categories/stationery"
                    className="text-gray-400 hover:text-white"
                  >
                    أدوات الكتابة
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/categories/art-supplies"
                    className="text-gray-400 hover:text-white"
                  >
                    لوازم الفنون
                  </Link>
                </li>
                <li className="text-right">
                  <Link
                    href="/categories/calculators"
                    className="text-gray-400 hover:text-white"
                  >
                    الحاسبات
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مكتبتي. جميع الحقوق محفوظة. بنيت بـ ❤️ للطلاب.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
