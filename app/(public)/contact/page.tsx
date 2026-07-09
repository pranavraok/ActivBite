'use client';



import { useForm } from 'react-hook-form';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid phone number required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    try {
      // TODO: Save to Supabase
      console.log('[v0] Contact enquiry:', data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('[v0] Contact error:', error);
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
              Message Sent Successfully!
            </h1>
            <p className="text-green-800">
              Thank you for contacting us. Our team will respond to your message within
              24 hours.
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We&apos;d love to hear from you. Get in touch with our team.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-8">
                    Get in Touch
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a
                          href="mailto:hello@activbite.com"
                          className="text-primary hover:underline"
                        >
                          hello@activbite.com
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a href="tel:+919876543210" className="text-primary hover:underline">
                          +91 9876543210
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          New Delhi, Delhi, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Response Times
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Email: 24 hours</li>
                    <li>• Phone: Business hours (9 AM - 6 PM IST)</li>
                    <li>• Wholesale inquiries: 24-48 hours</li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <div className="bg-white border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Send us a Message
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
                        Message
                      </label>
                      <textarea
                        {...register('message')}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your message"
                        rows={5}
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
                      {isLoading ? 'Sending...' : 'Send Message'}
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
