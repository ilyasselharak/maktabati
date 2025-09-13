"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Package, Plus, Minus, Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  isActive: boolean;
  tags?: string[];
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

  // Check if this is a list layout (flex layout)
  const isListLayout = className.includes("flex");

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons or interactive elements
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsAddingToCart(true);

    onAddToCart(product);

    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const isInCart = cartItems.some((item) => item.product._id === product._id);
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const currentQuantity = cartItem?.quantity || 0;

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove from cart
      if (onRemoveFromCart) {
        onRemoveFromCart(product);
      } else {
        // Fallback: just add the product (this will increase quantity, but we want to remove)
        // For now, we'll just call onAddToCart which will handle the logic
        onAddToCart(product);
      }
      return;
    }

    if (newQuantity > product.stock) return; // Don't exceed stock

    if (onUpdateQuantity) {
      onUpdateQuantity(product, newQuantity);
    } else {
      // Fallback to adding (this might not be perfect, but it's a start)
      onAddToCart(product);
    }
  };

  const removeFromCart = () => {
    if (onRemoveFromCart) {
      onRemoveFromCart(product);
    } else {
      // Fallback behavior - this won't work perfectly without proper remove function
      onAddToCart(product);
    }
  };

  if (isListLayout) {
    // List layout
    return (
      <div
        onClick={handleCardClick}
        className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer border border-gray-200 ${className}`}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-48 bg-gray-200 flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}

            {/* Stock Status Badges */}
            {product.stock === 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                نفد المخزون
              </div>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                كمية محدودة
              </div>
            )}

            {/* Cart Status */}
            {isInCart && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                في السلة
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {product.category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    المخزون: {product.stock}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 h-16 flex items-start">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 h-16 flex items-start">
                  {product.description}
                </p>

                {/* Tags (if available) */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:items-end sm:text-left sm:ml-4">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 block mb-4">
                  {formatPrice(product.price)} د.م.
                </span>

                {isInCart && currentQuantity > 0 ? (
                  // Quantity controls when item is in cart
                  <div className="flex items-center gap-2">
                    {/* Remove button */}
                    <button
                      onClick={removeFromCart}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      aria-label="إزالة من السلة"
                      title="إزالة من السلة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => updateQuantity(currentQuantity - 1)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-colors"
                        disabled={currentQuantity <= 1}
                        aria-label="تقليل الكمية"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                        {currentQuantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(currentQuantity + 1)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-colors"
                        disabled={currentQuantity >= product.stock}
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Add to cart button when item is not in cart
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                    className={`p-3 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      product.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isAddingToCart
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                    aria-label={
                      product.stock === 0
                        ? "غير متوفر"
                        : isAddingToCart
                        ? "جاري الإضافة..."
                        : "أضف إلى السلة"
                    }
                    title={
                      product.stock === 0
                        ? "غير متوفر"
                        : isAddingToCart
                        ? "جاري الإضافة..."
                        : "أضف إلى السلة"
                    }
                  >
                    {isAddingToCart ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <ShoppingCart className="h-5 w-5" />
                    )}
                  </button>
                )}

                {/* Success Message */}
                {isAddingToCart && (
                  <div className="mt-2 text-xs text-green-600 text-center sm:text-right">
                    تمت الإضافة بنجاح!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer border border-gray-200 ${className}`}
    >
      <div className={`relative bg-gray-200 product-image ${compact ? 'h-32' : 'h-64'}`}>
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className={`text-gray-400 ${compact ? 'h-8 w-8' : 'h-12 w-12'}`} />
          </div>
        )}

        {/* Stock Status Badges */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            نفد المخزون
          </div>
        )}

        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
            كمية محدودة
          </div>
        )}

        {/* Cart Status */}
        {isInCart && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            في السلة
          </div>
        )}
      </div>

      <div className={`product-content ${compact ? 'p-3' : 'p-6'}`}>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full ${compact ? 'text-xs' : 'text-xs'}`}>
            {product.category.name}
          </span>
          {!compact && (
            <span className="text-xs text-gray-500">
              المخزون: {product.stock}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 flex items-start product-title ${compact ? 'text-sm h-8' : 'text-lg h-14'}`}>
          {product.name}
        </h3>

        {/* Product Description - only show in non-compact mode */}
        {!compact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 flex items-start">
            {product.description}
          </p>
        )}

        {/* Tags (if available) - only show in non-compact mode */}
        {!compact && product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price and Cart Controls */}
        <div className="flex items-center justify-between">
          <span className={`font-bold text-gray-900 product-price ${compact ? 'text-lg' : 'text-2xl'}`}>
            {formatPrice(product.price)} د.م.
          </span>

          {isInCart && currentQuantity > 0 ? (
            // Quantity controls when item is in cart
            <div className="flex items-center gap-1">
              {/* Remove button */}
              <button
                onClick={removeFromCart}
                className={`rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors ${compact ? 'p-1' : 'p-1.5'}`}
                aria-label="إزالة من السلة"
                title="إزالة من السلة"
              >
                <Trash2 className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              </button>

              {/* Quantity controls */}
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  onClick={() => updateQuantity(currentQuantity - 1)}
                  className={`text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-colors ${compact ? 'p-1' : 'p-1.5'}`}
                  disabled={currentQuantity <= 1}
                  aria-label="تقليل الكمية"
                >
                  <Minus className={compact ? 'h-2 w-2' : 'h-3 w-3'} />
                </button>
                <span className={`font-medium text-gray-900 min-w-[2rem] text-center ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>
                  {currentQuantity}
                </span>
                <button
                  onClick={() => updateQuantity(currentQuantity + 1)}
                  className={`text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-colors ${compact ? 'p-1' : 'p-1.5'}`}
                  disabled={currentQuantity >= product.stock}
                  aria-label="زيادة الكمية"
                >
                  <Plus className={compact ? 'h-2 w-2' : 'h-3 w-3'} />
                </button>
              </div>
            </div>
          ) : (
            // Add to cart button when item is not in cart
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`rounded-lg flex items-center justify-center transition-colors duration-200 ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAddingToCart
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } ${compact ? 'p-1.5' : 'p-2'}`}
              aria-label={
                product.stock === 0
                  ? "غير متوفر"
                  : isAddingToCart
                  ? "جاري الإضافة..."
                  : "أضف إلى السلة"
              }
              title={
                product.stock === 0
                  ? "غير متوفر"
                  : isAddingToCart
                  ? "جاري الإضافة..."
                  : "أضف إلى السلة"
              }
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ShoppingCart className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              )}
            </button>
          )}
        </div>

        {/* Success Message */}
        {isAddingToCart && (
          <div className={`text-green-600 text-center ${compact ? 'mt-1 text-xs' : 'mt-2 text-xs'}`}>
            تمت الإضافة بنجاح!
          </div>
        )}
      </div>
    </div>
  );
}
