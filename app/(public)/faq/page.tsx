import type { Metadata } from 'next';
import FaqExperience from '@/components/faq-experience';

export const metadata: Metadata = {
  title: 'FAQ | ActivBite',
  description:
    'Answers about ActivBite breakfast bars, campus delivery, pack sizes, payments, wholesale enquiries, and support.',
};

export default function FAQPage() {
  return <FaqExperience />;
}
