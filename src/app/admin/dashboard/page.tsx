"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DashboardLayout from "./components/DashboardLayout";
import {
  Package,
  Users,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Box,
  Tag,
  Plus,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  totalOrders: number;
}

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1200;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("ar-MA")}{suffix}
    </span>
  );
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
          headers: { Authorization: `Bearer ${token}` },
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
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-blue-500 to-cyan-400",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeUp: true,
      link: "/admin/dashboard/products",
    },
    {
      name: "الفئات",
      value: stats.totalCategories,
      icon: BookOpen,
      gradient: "from-emerald-500 to-teal-400",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: "+3",
      changeUp: true,
      link: "/admin/dashboard/categories",
    },
    {
      name: "إجمالي الإيرادات",
      value: stats.totalRevenue,
      icon: TrendingUp,
      prefix: "د.م. ",
      gradient: "from-amber-500 to-orange-400",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      change: "+8.5%",
      changeUp: true,
      link: "/admin/dashboard/orders",
    },
    {
      name: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: "from-violet-500 to-purple-400",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      change: "-2%",
      changeUp: false,
      link: "/admin/dashboard/orders",
    },
  ];

  const activities = [
    {
      icon: Box,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "تمت إضافة منتج جديد",
      desc: "كتاب الرياضيات - الصف الثالث",
      time: "منذ ساعتين",
      timeColor: "text-slate-400",
    },
    {
      icon: Tag,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "تم إنشاء فئة جديدة",
      desc: "لوازم الفنون",
      time: "منذ 4 ساعات",
      timeColor: "text-slate-400",
    },
    {
      icon: ShoppingCart,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      title: "طلب جديد",
      desc: "طلب #1234 - 3 منتجات",
      time: "منذ 6 ساعات",
      timeColor: "text-slate-400",
    },
    {
      icon: Users,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "عميل جديد",
      desc: "أحمد العلوي - وزان",
      time: "منذ يوم واحد",
      timeColor: "text-slate-400",
    },
    {
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "تنبيه مخزون",
      desc: "قلم حبر - بقي 3قطع فقط",
      time: "منذ يومين",
      timeColor: "text-slate-400",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "إضافة منتج", href: "/admin/dashboard/products/add", color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
    { icon: Tag, label: "إدارة الفئات", href: "/admin/dashboard/categories", color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200" },
    { icon: TrendingUp, label: "التحليلات", href: "/admin/dashboard/analytics", color: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200" },
  ];

  return (
    <DashboardLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/4 translate-y-1/4" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">مرحباً بعودتك! 👋</h2>
            <p className="text-indigo-100">
              إليك ما يحدث في متجر لوازم المدرسة اليوم.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.name} href={stat.link} className="group block">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-indigo-500/10`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.changeUp ? "text-emerald-600" : "text-red-500"}`}>
                      {stat.changeUp ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {isLoading ? (
                        <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse" />
                      ) : (
                        <AnimatedCounter value={stat.value} prefix={stat.prefix || ""} />
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">الأنشطة الأخيرة</h3>
                <p className="text-xs text-slate-400 mt-0.5">آخر التحديثات في المتجر</p>
              </div>
              <Link href="/admin/dashboard/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                عرض الكل
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {activities.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className={`p-2 rounded-xl ${activity.iconBg} shrink-0`}>
                      <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions + Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-2.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${action.color}`}
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Store Status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">حالة المتجر</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-600">الموقع</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">يعمل</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-slate-600">الدفع</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">نشط</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-slate-600">الشحن</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">يدوي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
