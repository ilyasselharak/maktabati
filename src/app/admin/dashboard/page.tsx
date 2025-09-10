"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BookOpen,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  totalOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("/api/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("فشل في جلب إحصائيات لوحة التحكم:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "إجمالي المنتجات",
      value: isLoading ? "..." : stats.totalProducts.toString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      name: "الفئات",
      value: isLoading ? "..." : stats.totalCategories.toString(),
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      name: "إجمالي الإيرادات",
      value: isLoading ? "..." : `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      name: "إجمالي الطلبات",
      value: isLoading ? "..." : stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
  ];

  return (
    <DashboardLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            مرحباً بعودتك!
          </h2>
          <p className="text-gray-600">
            إليك ما يحدث في متجر لوازم المدرسة اليوم.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow-sm rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-md ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              الأنشطة الأخيرة
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    تمت إضافة منتج جديد
                  </p>
                  <p className="text-sm text-gray-500">
                    تمت إضافة كتاب الرياضيات إلى المخزون
                  </p>
                </div>
                <div className="text-sm text-gray-500">منذ ساعتين</div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    تم إنشاء فئة جديدة
                  </p>
                  <p className="text-sm text-gray-500">
                    تم إنشاء فئة لوازم الفنون
                  </p>
                </div>
                <div className="text-sm text-gray-500">منذ 4 ساعات</div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    تم الوصول إلى هدف المبيعات
                  </p>
                  <p className="text-sm text-gray-500">
                    تهانينا! لقد وصلت إلى 1000 مبيعة إجمالية
                  </p>
                </div>
                <div className="text-sm text-gray-500">منذ يوم واحد</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              الإجراءات السريعة
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Package className="h-5 w-5 mr-2" />
                إضافة منتج جديد
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <BookOpen className="h-5 w-5 mr-2" />
                إدارة الفئات
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <TrendingUp className="h-5 w-5 mr-2" />
                عرض التحليلات
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
