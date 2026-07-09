'use client';

import { useCartStore } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/helpers';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link href="/shop" className="text-primary font-semibold hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex gap-4 pb-4 border-b border-border"
          >
            {/* Image */}
            <div className="relative w-20 h-20 bg-secondary rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {formatPrice(item.price)}
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.product_id, item.quantity - 1)
                  }
                  className="w-6 h-6 rounded border border-border hover:bg-secondary text-sm"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.product_id, item.quantity + 1)
                  }
                  className="w-6 h-6 rounded border border-border hover:bg-secondary text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Remove from cart"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({totalItems} items):</span>
          <span className="font-semibold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping:</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      {/* Checkout button */}
      <Link
        href="/checkout"
        className="block w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center mt-4"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
