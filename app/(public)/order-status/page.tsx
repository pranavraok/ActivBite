import type { Metadata } from 'next';
import { Suspense } from 'react';
import OrderStatusExperience from '@/components/order-status-experience';

export const metadata: Metadata = {
  title: 'Order Status | ActivBite',
  description:
    'ActivBite UPI QR payment reference and campus delivery status for breakfast bar orders.',
};

export default function OrderStatusPage() {
  return (
    <Suspense fallback={null}>
      <OrderStatusExperience />
    </Suspense>
  );
}
