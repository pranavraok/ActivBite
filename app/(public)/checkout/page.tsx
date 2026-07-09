'use client';



import { useCartStore } from '@/lib/store/cart-store';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^[0-9]{6}$/, 'Valid postal code required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      // TODO: Create order in Supabase
      // TODO: Call Cashfree API to create payment session
      // For now, just show success message
      console.log('[v0] Order data:', data);
      console.log('[v0] Cart items:', items);
      
      setOrderCreated(true);
      clearCart();
    } catch (error) {
      console.error('[v0] Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center space-y-6">
            <div className="text-6xl">✓</div>
            <h1 className="text-3xl font-bold text-green-900">
              Order Placed Successfully!
            </h1>
            <p className="text-green-800">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="bg-white p-6 rounded border border-green-200 text-left">
              <p className="text-sm text-muted-foreground mb-2">
                Order Details:
              </p>
              <p className="font-semibold text-foreground">
                Total Items: {items.length}
              </p>
              <p className="font-semibold text-primary text-2xl mt-2">
                Total: ₹{totalPrice}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="border-2 border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-secondary"
              >
                Back Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Delivery Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Address
                      </label>
                      <textarea
                        {...register('address')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full address"
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          City
                        </label>
                        <input
                          {...register('city')}
                          type="text"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="New Delhi"
                        />
                        {errors.city && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          State
                        </label>
                        <input
                          {...register('state')}
                          type="text"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Delhi"
                        />
                        {errors.state && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Postal Code
                      </label>
                      <input
                        {...register('postalCode')}
                        type="text"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="110001"
                      />
                      {errors.postalCode && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={20} className="animate-spin" />}
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-secondary rounded-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-sm font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
