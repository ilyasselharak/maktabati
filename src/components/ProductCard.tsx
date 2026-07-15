"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Trash2,
  Eye,
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
    slug?: string;
  };
  stock: number;
  isActive: boolean;
  tags?: string[];
  slug?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (product: Product, quantity: number) => void;
  onRemoveFromCart?: (product: Product) => void;
  className?: string;
  compact?: boolean;
}

export default function ProductCard({
  product,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  className = "",
  compact = false,
}: ProductCardProps) {
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isListLayout = className.includes("flex");

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/products/${product.slug!}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    setIsAddingToCart(true);
    onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const formatPrice = (price: number) => price.toFixed(2);

  const isInCart = cartItems.some((item) => item.product._id === product._id);
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const currentQuantity = cartItem?.quantity || 0;

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      if (onRemoveFromCart) onRemoveFromCart(product);
      return;
    }
    if (newQuantity > product.stock) return;
    if (onUpdateQuantity) onUpdateQuantity(product, newQuantity);
  };

  const removeFromCart = () => {
    if (onRemoveFromCart) onRemoveFromCart(product);
  };

  const stockBadge = () => {
    if (product.stock === 0)
      return (
        <span className="absolute top-3 start-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
          نفد المخزون
        </span>
      );
    if (product.stock <= 5)
      return (
        <span className="absolute top-3 start-3 z-10 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
          كمية محدودة
        </span>
      );
    return null;
  };

  // ── List Layout ──
  if (isListLayout) {
    return (
      <div
        onClick={handleCardClick}
        className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 ${className}`}
        dir="rtl"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-52 h-52 sm:h-auto bg-slate-50 flex-shrink-0 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
            )}
            {stockBadge()}
            {isInCart && (
              <span className="absolute top-3 end-3 z-10 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                في السلة
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
                    {product.category.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    مخزون: {product.stock}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:items-end gap-3">
                <span className="text-2xl font-bold text-indigo-600">
                  {formatPrice(product.price)}
                  <span className="text-sm font-normal text-slate-400 me-1">د.م.</span>
                </span>

                {isInCart && currentQuantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={removeFromCart}
                      className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="إزالة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(currentQuantity - 1)}
                        className="p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
                        disabled={currentQuantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center font-semibold text-slate-900 text-sm">
                        {currentQuantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(currentQuantity + 1)}
                        className="p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
                        disabled={currentQuantity >= product.stock}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                    className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium text-sm ${
                      product.stock === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : isAddingToCart
                        ? "bg-emerald-500 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
                    }`}
                  >
                    {isAddingToCart ? (
                      <span>تمت الإضافة!</span>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>أضف للسلة</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid Layout ──
  const imageHeight = compact ? "h-40" : "h-56";
  const padding = compact ? "p-3" : "p-4";
  const titleSize = compact ? "text-sm h-9 leading-5" : "text-sm h-10 leading-5";
  const priceSize = compact ? "text-base" : "text-lg";
  const btnSize = compact ? "p-2" : "p-2.5";
  const iconSize = compact ? "h-4 w-4" : "h-4 w-4";

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 ${className}`}
      dir="rtl"
    >
      {/* Image Area */}
      <div className={`relative bg-slate-50 ${imageHeight} overflow-hidden`}>
        {product.images && product.images.length > 0 ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : "scale-100"}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className={`text-slate-300 ${compact ? "h-8 w-8" : "h-10 w-10"}`} />
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${isHovered ? "bg-black/5" : ""}`} />

        {stockBadge()}

        {isInCart && (
          <span className="absolute top-3 end-3 z-10 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
            في السلة
          </span>
        )}

        {/* Quick view button */}
        <div className={`absolute bottom-3 end-3 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
            <Eye className="h-3.5 w-3.5" />
            عرض التفاصيل
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`${padding}`}>
        {/* Category + Stock */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
            {product.category.name}
          </span>
          {!compact && (
            <span className="text-[10px] text-slate-400">
              مخزون: {product.stock}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-slate-900 mb-1.5 line-clamp-2 ${titleSize}`}>
          {product.name}
        </h3>

        {/* Description */}
        {!compact && (
          <p className="text-slate-500 text-xs mb-2.5 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>
        )}

        {/* Tags */}
        {!compact && product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className={`font-bold text-indigo-600 ${priceSize}`}>
            {formatPrice(product.price)}
            <span className="text-xs font-normal text-slate-400 me-1">د.م.</span>
          </span>

          {isInCart && currentQuantity > 0 ? (
            <div className="flex items-center gap-1">
              <button
                onClick={removeFromCart}
                className={`rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors ${btnSize}`}
                aria-label="إزالة"
              >
                <Trash2 className={iconSize} />
              </button>
              <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(currentQuantity - 1)}
                  className={`text-slate-600 hover:bg-slate-200 transition-colors ${btnSize}`}
                  disabled={currentQuantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className={`font-semibold text-slate-900 text-center min-w-[1.25rem] ${compact ? "px-1 py-0.5 text-xs" : "px-1.5 py-1 text-xs"}`}>
                  {currentQuantity}
                </span>
                <button
                  onClick={() => updateQuantity(currentQuantity + 1)}
                  className={`text-slate-600 hover:bg-slate-200 transition-colors ${btnSize}`}
                  disabled={currentQuantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`rounded-xl flex items-center justify-center transition-all duration-200 ${
                product.stock === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isAddingToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
              } ${btnSize}`}
              aria-label={product.stock === 0 ? "غير متوفر" : "أضف للسلة"}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
              ) : (
                <ShoppingCart className={iconSize} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
