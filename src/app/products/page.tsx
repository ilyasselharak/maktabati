"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Package,
  Grid,
  List,
  X,
  Filter,
  Menu,
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // New state for modern design
  const [activeCategory, setActiveCategory] = useState("all");
  const [categorySliderScroll, setCategorySliderScroll] = useState(0);
  const categorySliderRef = useRef<HTMLDivElement>(null);

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileFiltersOpen]);

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
        category: selectedCategory,
        sortBy,
        sortOrder,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
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
    selectedCategory,
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
    selectedCategory,
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
    setSelectedCategory("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  // Category slider functions
  const scrollCategories = (direction: "left" | "right") => {
    if (categorySliderRef.current) {
      const scrollAmount = 280; // Increased for bigger circles (128px + 32px gap)
      const newScroll =
        direction === "left"
          ? Math.max(0, categorySliderScroll - scrollAmount)
          : categorySliderScroll + scrollAmount;

      categorySliderRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
      setCategorySliderScroll(newScroll);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedCategory(categoryId);
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
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      dir="rtl"
    >
      
      {/* Modern Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              جميع المنتجات
            </h1>
            <p className="text-xl text-indigo-100 mb-8 drop-shadow">
              اكتشف مجموعتنا الكاملة من لوازم المدرسة
            </p>
          </div>

          {/* Modern Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الاسم أو العلامات أو الوصف..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl focus:ring-4 focus:ring-white/50 focus:outline-none transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </form>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-lg scale-105"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-lg scale-105"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Category Slider */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-gray-900">الفئات</h2>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCategories("left")}
                className="p-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCategories("right")}
                className="p-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="relative">
             <div
               ref={categorySliderRef}
               className="category-slider flex gap-8 overflow-x-auto scrollbar-hide px-4 py-4"
               style={{ scrollBehavior: "smooth" }}
             >
              {/* All Categories Button */}
              <button
                onClick={() => handleCategorySelect("all")}
                className={`category-circle flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-full transition-all duration-300 border-4 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white scale-110 border-indigo-300"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:scale-105 border-gray-200 hover:border-indigo-200"
                }`}
              >
                <Package className="h-10 w-10 mb-2" />
                <span className="text-sm font-semibold text-center leading-tight">
                  الكل
                </span>
              </button>

              {/* Dynamic Categories */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategorySelect(category._id)}
                  className={`category-circle flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-full transition-all duration-300 border-4 ${
                    activeCategory === category._id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white scale-110 border-indigo-300"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:scale-105 border-gray-200 hover:border-indigo-200"
                  }`}
                >
                  <span className="text-sm font-semibold text-center leading-tight px-1">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

       {/* Sort and Filter Bar */}
       <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex items-center gap-4">
               {/* Desktop Filter Button */}
               <button
                 onClick={() => setShowFilters(!showFilters)}
                 className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
               >
                 <Filter className="h-4 w-4 text-gray-700" />
                 <span className="text-gray-700">الفلاتر</span>
                 <ChevronDown
                   className={`h-4 w-4 text-gray-700 transition-transform ${
                     showFilters ? "rotate-180" : ""
                   }`}
                 />
               </button>

               {/* Mobile Filter Button */}
               <button
                 onClick={() => setMobileFiltersOpen(true)}
                 className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
               >
                 <Filter className="h-4 w-4" />
                 <span>الفلاتر</span>
               </button>

               {(searchTerm ||
                 selectedCategory !== "all" ||
                 minPrice ||
                 maxPrice) && (
                 <button
                   onClick={clearFilters}
                   className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                 >
                   <X className="h-4 w-4" />
                   <span>مسح الكل</span>
                 </button>
               )}
             </div>

             <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                 <span>
                   عرض {products.length} من {pagination?.totalProducts || 0} منتج
                 </span>
               </div>

               <select
                 value={`${sortBy}-${sortOrder}`}
                 onChange={(e) => {
                   const [newSortBy, newSortOrder] = e.target.value.split('-');
                   setSortBy(newSortBy);
                   setSortOrder(newSortOrder);
                   setCurrentPage(1);
                 }}
                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
               >
                 <option value="createdAt-desc">الأحدث</option>
                 <option value="createdAt-asc">الأقدم</option>
                 <option value="name-asc">الاسم أ-ي</option>
                 <option value="name-desc">الاسم ي-أ</option>
                 <option value="price-asc">السعر من الأقل</option>
                 <option value="price-desc">السعر من الأعلى</option>
               </select>
             </div>
           </div>
         </div>
       </div>

       {/* Main Content with Sidebar */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex gap-8">
           {/* Desktop Filters Sidebar */}
           <div className="hidden lg:block w-80 flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">الفلاتر</h3>
               
               {/* Category Filter */}
               <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-800 mb-3 text-right">الفئة</h4>
                 <select
                   value={selectedCategory}
                   onChange={(e) => {
                     setSelectedCategory(e.target.value);
                     setCurrentPage(1);
                   }}
                   className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                 >
                   <option value="all">جميع الفئات</option>
                   {categories.map((category) => (
                     <option key={category._id} value={category._id}>
                       {category.name}
                     </option>
                   ))}
                 </select>
               </div>

               {/* Price Range */}
               <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-800 mb-3 text-right">نطاق السعر</h4>
                 <div className="space-y-3">
                   <input
                     type="number"
                     value={minPrice}
                     onChange={(e) => {
                       setMinPrice(e.target.value);
                       setCurrentPage(1);
                     }}
                     placeholder="الحد الأدنى"
                     className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                   />
                   <input
                     type="number"
                     value={maxPrice}
                     onChange={(e) => {
                       setMaxPrice(e.target.value);
                       setCurrentPage(1);
                     }}
                     placeholder="الحد الأعلى"
                     className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                   />
                 </div>
               </div>

               {/* Clear Filters */}
               {(searchTerm ||
                 selectedCategory !== "all" ||
                 minPrice ||
                 maxPrice) && (
                 <button
                   onClick={clearFilters}
                   className="w-full px-4 py-3 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 text-center font-medium transition-colors"
                 >
                   مسح الفلاتر
                 </button>
               )}
             </div>
           </div>

           {/* Products Grid */}
           <div className="flex-1 w-full lg:w-auto">
             {loading ? (
               <div
                 className={`grid mobile-product-grid ${
                   viewMode === "grid"
                     ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                     : "grid-cols-1 gap-4"
                 }`}
               >
                 {[...Array(20)].map((_, index) => (
                   <div
                     key={index}
                     className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100"
                   >
                     <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                     <div className="p-3">
                       <div className="h-3 bg-gray-200 rounded mb-2"></div>
                       <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                       <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : products.length === 0 ? (
               <div className="text-center py-20">
                 <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                   <Package className="h-10 w-10 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-4">
                   لا توجد منتجات
                 </h3>
                 <p className="text-gray-600 mb-8">
                   جرب تغيير معايير البحث أو الفلاتر
                 </p>
                 <button
                   onClick={clearFilters}
                   className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                 >
                   مسح الفلاتر
                 </button>
               </div>
             ) : (
               <>
               <div
                 className={`grid mobile-product-grid ${
                   viewMode === "grid"
                     ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                     : "grid-cols-1 gap-4"
                 }`}
               >
                   {products.map((product) => (
                     <div
                       key={product._id}
                       className="transform hover:scale-105 transition-transform duration-300 mobile-product-card"
                     >
                       <ProductCard
                         product={product}
                         cartItems={cartItems}
                         onAddToCart={addToCart}
                         onUpdateQuantity={(product, quantity) => {
                           // Update quantity in cart
                           setCartItems((prevItems) => {
                             const newItems = prevItems.map((item) =>
                               item.product._id === product._id
                                 ? { ...item, quantity }
                                 : item
                             );
                             updateCartInStorage(newItems);
                             return newItems;
                           });
                         }}
                         onRemoveFromCart={(product) => {
                           // Remove from cart
                           setCartItems((prevItems) => {
                             const newItems = prevItems.filter(
                               (item) => item.product._id !== product._id
                             );
                             updateCartInStorage(newItems);
                             return newItems;
                           });
                         }}
                         className={
                           viewMode === "list"
                             ? "flex flex-col sm:flex-row max-w-none shadow-lg rounded-xl"
                             : "shadow-lg rounded-xl border border-gray-100"
                         }
                         compact={true}
                       />
                     </div>
                   ))}
                 </div>

                 {/* Pagination */}
                 {pagination && pagination.totalPages > 1 && (
                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-12 gap-4">
                     <div className="text-sm text-gray-700 text-center sm:text-left font-medium">
                       عرض {products.length} من أصل {pagination.totalProducts} منتج
                     </div>

                     <div className="flex items-center justify-center gap-2">
                       <button
                         onClick={() => setCurrentPage(currentPage - 1)}
                         disabled={!pagination.hasPrev}
                         className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
                       >
                         <ChevronRight className="h-4 w-4 text-indigo-600" />
                         <span className="hidden sm:inline text-gray-700">السابق</span>
                       </button>

                       <div className="flex items-center gap-1">
                         {Array.from(
                           { length: Math.min(5, pagination.totalPages) },
                           (_, i) => {
                             const pageNumber =
                               Math.max(
                                 1,
                                 Math.min(pagination.totalPages - 4, currentPage - 2)
                               ) + i;
                             if (pageNumber > pagination.totalPages) return null;

                             return (
                               <button
                                 key={pageNumber}
                                 onClick={() => setCurrentPage(pageNumber)}
                                 className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                                   pageNumber === currentPage
                                     ? "bg-indigo-600 text-white shadow-md"
                                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                 }`}
                               >
                                 {pageNumber}
                               </button>
                             );
                           }
                         )}
                       </div>

                       <button
                         onClick={() => setCurrentPage(currentPage + 1)}
                         disabled={!pagination.hasNext}
                         className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
                       >
                         <span className="hidden sm:inline text-gray-700">التالي</span>
                         <ChevronRight className="h-4 w-4 rotate-180 text-indigo-600" />
                       </button>
                     </div>
                   </div>
                 )}
               </>
             )}
           </div>
         </div>
       </div>

       {/* Mobile Filter Modal */}
       {mobileFiltersOpen && (
         <div className="fixed inset-0 z-50 flex items-end justify-center">
           {/* Background overlay */}
           <div
             className="absolute inset-0 bg-gray-500 bg-opacity-75"
             onClick={() => setMobileFiltersOpen(false)}
           ></div>

           {/* Modal panel */}
           <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
             {/* Modal header */}
             <div className="px-6 py-4 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold text-gray-900">الفلاتر</h3>
                 <button
                   onClick={() => setMobileFiltersOpen(false)}
                   className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>
             </div>

             {/* Modal content */}
             <div className="px-6 py-6">
               {/* Category Filter */}
               <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-800 mb-3 text-right">الفئة</h4>
                 <select
                   value={selectedCategory}
                   onChange={(e) => {
                     setSelectedCategory(e.target.value);
                     setCurrentPage(1);
                   }}
                   className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                 >
                   <option value="all">جميع الفئات</option>
                   {categories.map((category) => (
                     <option key={category._id} value={category._id}>
                       {category.name}
                     </option>
                   ))}
                 </select>
               </div>

               {/* Price Range */}
               <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-800 mb-3 text-right">نطاق السعر</h4>
                 <div className="space-y-3">
                   <input
                     type="number"
                     value={minPrice}
                     onChange={(e) => {
                       setMinPrice(e.target.value);
                       setCurrentPage(1);
                     }}
                     placeholder="الحد الأدنى"
                     className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                   />
                   <input
                     type="number"
                     value={maxPrice}
                     onChange={(e) => {
                       setMaxPrice(e.target.value);
                       setCurrentPage(1);
                     }}
                     placeholder="الحد الأعلى"
                     className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                   />
                 </div>
               </div>

               {/* Sort Options */}
               <div className="mb-6">
                 <h4 className="text-sm font-semibold text-gray-800 mb-3 text-right">الترتيب حسب</h4>
                 <select
                   value={`${sortBy}-${sortOrder}`}
                   onChange={(e) => {
                     const [newSortBy, newSortOrder] = e.target.value.split('-');
                     setSortBy(newSortBy);
                     setSortOrder(newSortOrder);
                     setCurrentPage(1);
                   }}
                   className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                 >
                   <option value="createdAt-desc">الأحدث</option>
                   <option value="createdAt-asc">الأقدم</option>
                   <option value="name-asc">الاسم أ-ي</option>
                   <option value="name-desc">الاسم ي-أ</option>
                   <option value="price-asc">السعر من الأقل</option>
                   <option value="price-desc">السعر من الأعلى</option>
                 </select>
               </div>

               {/* Clear Filters */}
               {(searchTerm ||
                 selectedCategory !== "all" ||
                 minPrice ||
                 maxPrice) && (
                 <button
                   onClick={() => {
                     clearFilters();
                     setMobileFiltersOpen(false);
                   }}
                   className="w-full px-4 py-3 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 text-center font-medium transition-colors mb-4"
                 >
                   مسح الفلاتر
                 </button>
               )}
             </div>

             {/* Modal footer */}
             <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
               <button
                 onClick={() => setMobileFiltersOpen(false)}
                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
               >
                 تطبيق الفلاتر
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Footer */}
     </div>
   );
 }
