import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutExperience from '@/components/checkout-experience';

export const metadata: Metadata = {
  title: 'Checkout | ActivBite',
  description:
    'Enter NITK campus delivery details and continue to UPI QR payment for ActivBite Breakfast Bars.',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutExperience />
    </Suspense>
  );
}
