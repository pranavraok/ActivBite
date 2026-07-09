'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/helpers';
import { useCartStore } from '@/lib/store/cart-store';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative w-full h-48 bg-secondary">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.featured && (
            <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category badge */}
          <div className="text-xs font-semibold text-primary mb-2 uppercase">
            {product.category}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="font-bold text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-lg transition-all ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
              title="Add to cart"
            >
              {isAdded ? (
                <Check size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
