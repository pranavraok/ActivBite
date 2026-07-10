import type { Metadata } from 'next';
import ShopExperience from '@/components/shop-experience';

export const metadata: Metadata = {
  title: 'Shop Breakfast Bars | ActivBite',
  description:
    'Shop ActivBite Breakfast Bars in packs of 10, 20, or 30. Real ingredients, ready for real mornings.',
};

export default function ShopPage() {
  return <ShopExperience />;
}
