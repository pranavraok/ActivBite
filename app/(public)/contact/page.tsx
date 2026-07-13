import type { Metadata } from 'next';
import ContactExperience from '@/components/contact-experience';

export const metadata: Metadata = {
  title: 'Contact Us | ActivBite',
  description:
    'Contact ActivBite for campus delivery support, product questions, wholesale enquiries, collaborations, and feedback.',
};

export default function ContactPage() {
  return <ContactExperience />;
}
