"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  Eye,
  Package,
  User,
  MapPin,
  Phone,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Customer {
  name: string;
  city: string;
  phone: string;
}

interface Order {
  _id: string;
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "في الانتظار",
  confirmed: "مؤكد",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("فشل في جلب الطلبات:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedStatus,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [
    currentPage,
    searchTerm,
    selectedStatus,
    selectedCategory,
    sortBy,
    sortOrder,
    fetchOrders,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        console.error("Failed to fetch categories:", response.status);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedCategory("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error("فشل في تحديث حالة الطلب:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-MA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="إدارة الطلبات">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="إدارة الطلبات">
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الطلبات</h2>
              <p className="text-gray-600 mt-1">
                إدارة ومراقبة جميع الطلبات (
                {pagination?.totalOrders || orders.length} طلب)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                الفلاتر
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-80 transition-all duration-300 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الفلاتر
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البحث
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="رقم الطلب، اسم العميل، رقم الهاتف..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الطلب
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">جميع الحالات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الترتيب حسب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 mb-2"
                >
                  <option value="createdAt">التاريخ</option>
                  <option value="totalAmount">المبلغ</option>
                  <option value="orderId">رقم الطلب</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="desc">تنازلي</option>
                  <option value="asc">تصاعدي</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm ||
                selectedStatus ||
                selectedCategory ||
                sortBy !== "createdAt" ||
                sortOrder !== "desc") && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  مسح جميع الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Orders Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لا توجد طلبات
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedStatus || selectedCategory
                    ? "لا توجد طلبات تطابق معايير البحث"
                    : "لم يتم العثور على أي طلبات"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{order.orderId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as Order["status"]
                            )
                          }
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${
                            statusColors[order.status]
                          }`}
                        >
                          <option value="pending">في الانتظار</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="processing">قيد المعالجة</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="delivered">تم التسليم</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-900">
                            {order.customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-900">
                            {order.customer.city}
                          </span>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">عدد المنتجات</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {order.totalItems}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-600">
                            المبلغ الإجمالي
                          </p>
                          <p className="text-xl font-bold text-indigo-600">
                            {order.totalAmount.toFixed(2)} د.م.
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-700 text-center sm:text-right">
                        عرض {orders.length} من أصل {pagination.totalOrders} طلب
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <ChevronRight className="h-4 w-4" />
                          السابق
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              const pageNumber =
                                Math.max(1, currentPage - 2) + i;
                              if (pageNumber > pagination.totalPages)
                                return null;

                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                    pageNumber === currentPage
                                      ? "bg-indigo-600 text-white"
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
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          التالي
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      تفاصيل الطلب #{selectedOrder.orderId}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 text-right">
                      معلومات العميل
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {selectedOrder.customer.name}
                        </span>
                        <div className="flex items-center">
                          <span className="text-gray-900 mr-2">الاسم:</span>
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {selectedOrder.customer.city}
                        </span>
                        <div className="flex items-center">
                          <span className="text-gray-900 mr-2">المدينة:</span>
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {selectedOrder.customer.phone}
                        </span>
                        <div className="flex items-center">
                          <span className="text-gray-900 mr-2">الهاتف:</span>
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 text-right">
                      ملخص الطلب
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">
                          {selectedOrder.totalItems}
                        </span>
                        <span className="text-gray-900">عدد المنتجات:</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-lg text-gray-900">
                          {selectedOrder.totalAmount.toFixed(2)} د.م.
                        </span>
                        <span className="text-gray-900">المبلغ الإجمالي:</span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[selectedOrder.status]
                          }`}
                        >
                          {statusLabels[selectedOrder.status]}
                        </span>
                        <span className="text-gray-900">الحالة:</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-right">
                    المنتجات المطلوبة
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 uppercase">
                            المجموع
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 uppercase">
                            الكمية
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 uppercase">
                            السعر
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 uppercase">
                            المنتج
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {item.total.toFixed(2)} د.م.
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm text-gray-900">
                                {item.quantity}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm text-gray-900">
                                {item.price.toFixed(2)} د.م.
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-6 flex justify-start space-x-3">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    إغلاق
                  </button>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder._id,
                        e.target.value as Order["status"]
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
