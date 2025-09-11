"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
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
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
  {
    name: "لوحة التحكم",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "المنتجات",
    href: "/admin/dashboard/products",
    icon: Package,
    subItems: [
      {
        name: "جميع المنتجات",
        href: "/admin/dashboard/products",
        icon: List,
      },
      {
        name: "إضافة منتج",
        href: "/admin/dashboard/products/add",
        icon: PlusCircle,
      },
    ],
  },
  {
    name: "الفئات",
    href: "/admin/dashboard/categories",
    icon: BookOpen,
    subItems: [
      {
        name: "جميع الفئات",
        href: "/admin/dashboard/categories",
        icon: List,
      },
      {
        name: "إضافة فئة",
        href: "/admin/dashboard/categories/add",
        icon: PlusCircle,
      },
      {
        name: "إدارة الفئات",
        href: "/admin/dashboard/categories/manage",
        icon: Tag,
      },
    ],
  },
  {
    name: "الطلبات",
    href: "/admin/dashboard/orders",
    icon: ShoppingCart,
    subItems: [
      {
        name: "جميع الطلبات",
        href: "/admin/dashboard/orders",
        icon: List,
      },
    ],
  },
  {
    name: "التحليلات",
    href: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "الإعدادات",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">مكتبتي</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                      ${
                        isParentActive(item.name)
                          ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                      ${
                        isActive(item.href)
                          ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )}

                {/* Sub-items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                            ${
                              isActive(subItem.href)
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            }
                          `}
                        >
                          <SubIcon className="h-4 w-4" />
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
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
}
