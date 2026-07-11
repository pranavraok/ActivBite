import type { Metadata } from 'next';
import WholesaleExperience from '@/components/wholesale-experience';

export const metadata: Metadata = {
  title: 'Wholesale Enquiry | ActivBite',
  description:
    'Submit a wholesale enquiry to stock ActivBite Breakfast Bars in shops, cafes, canteens, gyms, and campus counters.',
};

export default function WholesalePage() {
  return <WholesaleExperience />;
}
