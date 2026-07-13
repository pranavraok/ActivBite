import type { Metadata } from 'next';
import AboutExperience from '@/components/about-experience';

export const metadata: Metadata = {
  title: 'About ActivBite | Student-born breakfast bar brand',
  description:
    'The real story behind ActivBite: a NITK-born, Padukone-built breakfast bar brand created to make skipped mornings easier for students.',
};

export default function AboutPage() {
  return <AboutExperience />;
}
