'use client';



import CartDrawer from '@/components/cart-drawer';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useCartStore } from '@/lib/store/cart-store';
import Link from 'next/link';
import { Metadata } from 'next';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="bg-secondary rounded-lg p-12 text-center space-y-6">
              <p className="text-lg text-muted-foreground">Your cart is empty</p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <CartDrawer />
              </div>

              {/* Order Summary */}
              <div className="bg-secondary rounded-lg p-6 h-fit">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary text-xl">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-secondary transition-colors text-center"
                >
                  Continue Shopping
                </Link>

                {/* Info */}
                <div className="mt-6 p-4 bg-white rounded border border-border text-sm text-muted-foreground space-y-2">
                  <p>✓ Free shipping on orders over ₹500</p>
                  <p>✓ Easy returns within 7 days</p>
                  <p>✓ 100% fresh guarantee</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
