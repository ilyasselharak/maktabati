"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  BarChart3,
  Settings,
  LogOut,
  X,
  BookOpen,
  PlusCircle,
  List,
  Tag,
  ShoppingCart,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
  { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "المنتجات",
    href: "/admin/dashboard/products",
    icon: Package,
    subItems: [
      { name: "جميع المنتجات", href: "/admin/dashboard/products", icon: List },
      { name: "إضافة منتج", href: "/admin/dashboard/products/add", icon: PlusCircle },
    ],
  },
  {
    name: "الفئات",
    href: "/admin/dashboard/categories",
    icon: BookOpen,
    subItems: [
      { name: "جميع الفئات", href: "/admin/dashboard/categories", icon: List },
      { name: "إضافة فئة", href: "/admin/dashboard/categories/add", icon: PlusCircle },
      { name: "إدارة الفئات", href: "/admin/dashboard/categories/manage", icon: Tag },
    ],
  },
  {
    name: "الطلبات",
    href: "/admin/dashboard/orders",
    icon: ShoppingCart,
    subItems: [
      { name: "جميع الطلبات", href: "/admin/dashboard/orders", icon: List },
    ],
  },
  { name: "التحليلات", href: "/admin/dashboard/analytics", icon: BarChart3 },
  { name: "الإعدادات", href: "/admin/dashboard/settings", icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["المنتجات", "الفئات", "الطلبات"]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/auth/login";
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (itemName: string) =>
    menuItems
      .find((item) => item.name === itemName)
      ?.subItems?.some((subItem) => isActive(subItem.href));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-slate-200 shadow-xl shadow-slate-200/50
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none lg:border-l
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-none">مكتبتي</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">لوحة الإدارة</span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-5 space-y-1 overflow-y-auto h-[calc(100%-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const activeParent = isParentActive(item.name);

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                      ${activeParent
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${activeParent ? "bg-indigo-100" : "bg-slate-100"}`}>
                        <Icon className={`h-4 w-4 ${activeParent ? "text-indigo-600" : "text-slate-500"}`} />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "-rotate-90" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive(item.href)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${isActive(item.href) ? "bg-indigo-100" : "bg-slate-100"}`}>
                      <Icon className={`h-4 w-4 ${isActive(item.href) ? "text-indigo-600" : "text-slate-500"}`} />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                )}

                {/* Sub-items */}
                {hasSubItems && isExpanded && (
                  <div className="mr-9 mt-1 space-y-0.5 border-r-2 border-slate-100 pr-3">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200
                            ${isActive(subItem.href)
                              ? "bg-indigo-50 text-indigo-700 font-semibold"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }
                          `}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isActive(subItem.href) ? "text-indigo-600" : "text-slate-400"}`} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 right-0 left-0 border-t border-slate-100 p-3 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <div className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
