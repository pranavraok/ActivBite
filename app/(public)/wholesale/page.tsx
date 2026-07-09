'use client';



import { useForm } from 'react-hook-form';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const wholesaleSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid phone number required'),
  companyName: z.string().min(2, 'Company name is required'),
  quantityRange: z.string().min(1, 'Please select a quantity range'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type WholesaleForm = z.infer<typeof wholesaleSchema>;

export default function WholesalePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WholesaleForm>({
    resolver: zodResolver(wholesaleSchema),
  });

  const onSubmit = async (data: WholesaleForm) => {
    setIsLoading(true);
    try {
      // TODO: Save to Supabase
      console.log('[v0] Wholesale enquiry:', data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('[v0] Wholesale error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center space-y-6">
            <div className="text-6xl">✓</div>
            <h1 className="text-3xl font-bold text-green-900">
              Enquiry Submitted Successfully!
            </h1>
            <p className="text-green-800">
              Thank you for your interest in ActivBite wholesale. Our team will contact you
              within 24-48 hours.
            </p>
            <a
              href="/"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
            >
              Back Home
            </a>
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
        {/* Hero */}
        <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Wholesale Program</h1>
            <p className="text-lg text-muted-foreground">
              Partner with ActivBite for bulk orders and institutional packages
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Benefits */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    Why Partner With Us?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Competitive Pricing
                        </h3>
                        <p className="text-muted-foreground">
                          Bulk discounts available for schools, gyms, and businesses
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Quality Assurance
                        </h3>
                        <p className="text-muted-foreground">
                          Each batch is tested for quality and freshness
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Fast Delivery
                        </h3>
                        <p className="text-muted-foreground">
                          Quick turnaround times for bulk orders
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Dedicated Support
                        </h3>
                        <p className="text-muted-foreground">
                          Personalized account management and support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    Ideal For:
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• College and university canteens</li>
                    <li>• Fitness centers and gyms</li>
                    <li>• Corporate offices</li>
                    <li>• Sports teams and coaching centers</li>
                    <li>• Convenience stores and retailers</li>
                  </ul>
                </div>
              </div>

              {/* Form */}
              <div>
                <div className="bg-white border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Get in Touch
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Name
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
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
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone
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

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Company/Institution Name
                      </label>
                      <input
                        {...register('companyName')}
                        type="text"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your company name"
                      />
                      {errors.companyName && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Estimated Quantity Range
                      </label>
                      <select
                        {...register('quantityRange')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a quantity range</option>
                        <option value="100-500">100-500 units</option>
                        <option value="500-1000">500-1000 units</option>
                        <option value="1000-5000">1000-5000 units</option>
                        <option value="5000+">5000+ units</option>
                      </select>
                      {errors.quantityRange && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.quantityRange.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Message
                      </label>
                      <textarea
                        {...register('message')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tell us about your requirements"
                        rows={4}
                      />
                      {errors.message && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading && <Loader2 size={20} className="animate-spin" />}
                      {isLoading ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
