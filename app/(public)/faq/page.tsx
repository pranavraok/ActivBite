'use client';



import { useState } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ChevronDown } from 'lucide-react';
import { Metadata } from 'next';

const faqs = [
  {
    question: 'What are the main ingredients in ActivBite bars?',
    answer:
      'ActivBite Breakfast Bars are made using ingredients such as oats, peanuts, dates, poha, jaggery, elaichi, and chocolate. Please check the product label before consuming, especially if you have allergies.',
  },
  {
    question: 'Are your bars suitable for vegetarians?',
    answer:
      'Yes! Most of our bars are vegetarian-friendly. We clearly label any bars containing animal products. Please check the product details for specific ingredients.',
  },
  {
    question: 'How long do the bars stay fresh?',
    answer:
      'Our bars have a shelf life of 6 months from the date of manufacture. Store them in a cool, dry place for best results. Once opened, consume within a few days.',
  },
  {
    question: 'Can I use these for meal replacement?',
    answer:
      'While ActivBite bars are nutritious, they are designed as a breakfast complement or snack, not a complete meal replacement. We recommend combining them with other food items for a balanced diet.',
  },
  {
    question: 'Do you offer bulk orders for institutions?',
    answer:
      'Yes! We offer wholesale pricing for schools, colleges, gyms, and other institutions. Please visit our Wholesale page or contact us for more information.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Because this is a packaged food product, delivery issues must be reported during delivery itself. If there is a wrong pack, missing quantity, damaged pack, broken seal, or visible quality concern, we may offer a correction, replacement, or refund depending on the issue.',
  },
  {
    question: 'How do you ensure product quality?',
    answer:
      'Each batch is tested for quality and safety. We follow strict hygiene standards and use only sourced ingredients from trusted suppliers. Our facilities are regularly audited.',
  },
  {
    question: 'Where do you currently deliver?',
    answer:
      'For the first launch phase, ActivBite delivery is limited to National Institute of Technology Karnataka (NITK).',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left font-semibold text-foreground hover:bg-secondary transition-colors flex justify-between items-center"
      >
        {question}
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-secondary border-t border-border text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about ActivBite
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            {/* Additional Support */}
            <div className="mt-16 bg-secondary rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Didn&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help. Reach out anytime!
              </p>
              <a
                href="/contact"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
