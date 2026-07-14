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
  X,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
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
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
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

const statusConfig = {
  pending: { label: "في الانتظار", class: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
  confirmed: { label: "مؤكد", class: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle2 },
  processing: { label: "قيد المعالجة", class: "bg-purple-50 text-purple-700 border-purple-100", icon: RefreshCw },
  shipped: { label: "تم الشحن", class: "bg-indigo-50 text-indigo-700 border-indigo-100", icon: Truck },
  delivered: { label: "تم التسليم", class: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
  cancelled: { label: "ملغي", class: "bg-red-50 text-red-700 border-red-100", icon: Ban },
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

  useEffect(() => { fetchCategories(); }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams({
        page: currentPage.toString(), search: searchTerm, status: selectedStatus,
        category: selectedCategory, sortBy, sortOrder,
      });
      const response = await fetch(`/api/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [currentPage, searchTerm, selectedStatus, selectedCategory, sortBy, sortOrder]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm(""); setSelectedStatus(""); setSelectedCategory("");
    setSortBy("createdAt"); setSortOrder("desc"); setCurrentPage(1);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders(orders.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
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
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <DashboardLayout title="إدارة الطلبات">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">الطلبات</h2>
              <p className="text-slate-500 text-sm mt-1">
                إدارة ومراقبة جميع الطلبات ({pagination?.totalOrders || orders.length} طلب)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  showFilters
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                الفلاتر
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-72 shrink-0`}>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 mb-4">الفلاتر</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">البحث</label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="رقم الطلب، اسم العميل..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">حالة الطلب</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                  >
                    <option value="">جميع الحالات</option>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">الترتيب</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sb, so] = e.target.value.split("-");
                      setSortBy(sb); setSortOrder(so); setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                  >
                    <option value="createdAt-desc">الأحدث أولاً</option>
                    <option value="createdAt-asc">الأقدم أولاً</option>
                    <option value="totalAmount-desc">المبلغ: الأعلى</option>
                    <option value="totalAmount-asc">المبلغ: الأقل</option>
                  </select>
                </div>

                {(searchTerm || selectedStatus || selectedCategory || sortBy !== "createdAt" || sortOrder !== "desc") && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    مسح الفلاتر
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded-lg mb-3 w-1/3" />
                    <div className="h-4 bg-slate-100 rounded-lg mb-4 w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">لا توجد طلبات</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm || selectedStatus ? "لا توجد طلبات تطابق معايير البحث" : "لم يتم العثور على أي طلبات"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {orders.map((order) => {
                    const cfg = statusConfig[order.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={order._id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">#{order.orderId}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${cfg.class}`}>
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900">{order.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">{order.customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-sm text-slate-600">{order.customer.city}</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-slate-400">المنتجات</p>
                            <p className="text-lg font-bold text-slate-900">{order.totalItems}</p>
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-slate-400">المجموع</p>
                            <p className="text-xl font-bold text-indigo-600">{order.totalAmount.toFixed(2)} <span className="text-xs font-normal text-slate-400">د.م.</span></p>
                          </div>
                        </div>

                        {/* Status Change */}
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as Order["status"])}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all mb-3"
                        >
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleViewOrder(order)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          عرض التفاصيل
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-sm text-slate-500 text-center sm:text-right">
                        عرض {orders.length} من أصل {pagination.totalOrders} طلب
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 text-sm font-medium transition-all"
                        >
                          <ChevronRight className="h-4 w-4" />
                          السابق
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNumber = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                            if (pageNumber > pagination.totalPages) return null;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                  pageNumber === currentPage
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 text-sm font-medium transition-all"
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">تفاصيل الطلب #{selectedOrder.orderId}</h3>
                    <p className="text-sm text-slate-400 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">معلومات العميل</h4>
                    <div className="space-y-3">
                      {[
                        { label: "الاسم", value: selectedOrder.customer.name, icon: User },
                        { label: "المدينة", value: selectedOrder.customer.city, icon: MapPin },
                        { label: "الهاتف", value: selectedOrder.customer.phone, icon: Phone },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-slate-900">{item.value}</span>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <span className="text-xs">{item.label}</span>
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">ملخص الطلب</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm text-slate-900">{selectedOrder.totalItems}</span>
                        <span className="text-xs text-slate-500">عدد المنتجات</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-lg text-slate-900">{selectedOrder.totalAmount.toFixed(2)} د.م.</span>
                        <span className="text-xs text-slate-500">المبلغ الإجمالي</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${statusConfig[selectedOrder.status].class}`}>
                          {statusConfig[selectedOrder.status].label}
                        </span>
                        <span className="text-xs text-slate-500">الحالة</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">المنتجات المطلوبة</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">المنتج</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">السعر</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">الكمية</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">{item.price.toFixed(2)} د.م.</td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">{item.total.toFixed(2)} د.م.</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
                  >
                    إغلاق
                  </button>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value as Order["status"])}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                  >
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
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
