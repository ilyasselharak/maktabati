"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  ChevronRight,
  Package,
  Grid,
  List,
  X,
  Check,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

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
  tags?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Category {
  _id: string;
  name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart and settings from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("maktabati_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        const totalCount = parsedCart.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("maktabati_cart", JSON.stringify(items));
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        sortBy,
        sortOrder,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategories,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    searchTerm,
    selectedCategories,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    fetchProducts,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product._id === product._id
      );

      let newItems;
      if (existingItem) {
        // Increase quantity if item already exists
        newItems = prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        newItems = [...prevItems, { product, quantity: 1 }];
      }

      // Update localStorage and cart count
      updateCartInStorage(newItems);

      return newItems;
    });

    // Show success feedback (you could add a toast notification here)
    console.log(`تم إضافة ${product.name} إلى السلة`);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Site Header */}
      <Header
        cartCount={cartCount}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        currentPage="/products"
      />

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                جميع المنتجات
              </h1>
              <p className="text-gray-600">
                اكتشف مجموعتنا الكاملة من لوازم المدرسة
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="البحث في الاسم أو العلامات أو الوصف..."
                  className="w-full pr-10 pl-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                  dir="rtl"
                />
                <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Sort and Clear Filters */}
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="createdAt-desc">الأحدث</option>
                <option value="createdAt-asc">الأقدم</option>
                <option value="name-asc">الاسم أ-ي</option>
                <option value="name-desc">الاسم ي-أ</option>
                <option value="price-asc">السعر من الأقل</option>
                <option value="price-desc">السعر من الأعلى</option>
              </select>

              {(searchTerm || selectedCategories.length > 0 || minPrice || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                  <span>مسح الكل</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Categories Sidebar */}
          

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-gray-500">جرب تغيير معايير البحث أو الفلاتر</p>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`${viewMode === "list" ? "w-48 h-48" : "h-48"} relative`}>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">نفذ المخزون</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="mb-2 text-right">
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            {product.category.name}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 text-right">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 text-right">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            {product.price} ر.س
                          </span>
                          <span className="text-xs text-gray-500">
                            متوفر: {product.stock}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {product.stock === 0 ? "نفذ المخزون" : "أضف للسلة"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-4">
                    <div className="text-sm text-gray-700 text-center sm:text-right">
                      عرض {products.length} من أصل {pagination.totalProducts} منتج
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-black" />
                        <span className="hidden sm:inline text-black">السابق</span>
                      </button>

                      <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm">
                        {pagination.currentPage} من {pagination.totalPages}
                      </span>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <span className="hidden sm:inline text-black">التالي</span>
                        <ChevronRight className="h-4 w-4 rotate-180 text-black" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">الفئات</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 text-right">نطاق السعر</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="الحد الأدنى"
                    className="w-full p-2 text-sm text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                    dir="rtl"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="الحد الأعلى"
                    className="w-full p-2 text-sm text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center space-x-reverse space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 text-right flex-1">{category.name}</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                          selectedCategories.includes(category._id)
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCategories.includes(category._id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Clear Filters */}
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-4 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-center"
                >
                  مسح الفلاتر
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
