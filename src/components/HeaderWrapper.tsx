"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

interface CartItem {
  product: {
    _id: string;
  };
  quantity: number;
}

export default function HeaderWrapper() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = () => {
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
    };

    loadCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <Header
      cartCount={cartCount}
      mobileMenuOpen={mobileMenuOpen}
      onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      currentPage={pathname}
    />
  );
}
