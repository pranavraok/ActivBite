'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  PackageCheck,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Store,
  Sunrise,
  Truck,
} from 'lucide-react';
import styles from './faq-experience.module.css';
import PublicHeader from './public-header';

const categories = ['All', 'Product', 'Delivery', 'Payment', 'Wholesale', 'Support'] as const;

type Category = (typeof categories)[number];

type Faq = {
  id: string;
  category: Exclude<Category, 'All'>;
  question: string;
  answer: ReactNode;
};

const faqs: Faq[] = [
  {
    id: 'what-is-activbite',
    category: 'Product',
    question: 'What exactly is ActivBite?',
    answer:
      'ActivBite is a breakfast bar brand built for busy mornings, quick campus routines, and zero breakfast drama.',
  },
  {
    id: 'current-product',
    category: 'Product',
    question: 'Which product is available right now?',
    answer:
      'For launch, ActivBite has one hero product: the ActivBite Breakfast Bar.',
  },
  {
    id: 'pack-sizes',
    category: 'Product',
    question: 'What pack sizes can I buy?',
    answer:
      'Choose 5, 10, 20, or 30 bars. The 5-pack is ideal for trying ActivBite; the 30-pack offers the best listed value.',
  },
  {
    id: 'choosing-a-pack',
    category: 'Product',
    question: 'Which pack should I choose?',
    answer:
      'The pack of 5 is useful for trying ActivBite first. Packs of 10 and 20 suit shorter routines, while the pack of 30 offers the best listed value for regular breakfasts.',
  },
  {
    id: 'who-is-it-for',
    category: 'Product',
    question: 'Who is ActivBite made for?',
    answer:
      'ActivBite is designed for students and anyone managing a busy morning who wants a portable breakfast made with familiar ingredients. Always review the ingredient and allergen information for your own dietary needs.',
  },
  {
    id: 'pricing',
    category: 'Product',
    question: 'What is the price?',
    answer:
      'One bar is ₹45. Pack of 5 is ₹225 with no offer. Launch packs are ₹420 for 10 bars (₹30 off), ₹825 for 20 bars (₹75 off), and ₹1,149 for 30 bars (₹201 off — best deal).',
  },
  {
    id: 'nutrition',
    category: 'Product',
    question: 'What are the nutrition highlights?',
    answer:
      'Each bar highlights 300 kcal, 9.3g protein, and 6.5g fibre. It contains peanuts, so always check the pack label for allergens.',
  },
  {
    id: 'ingredients',
    category: 'Product',
    question: 'What ingredients are inside?',
    answer:
      'The bar includes oats, peanuts, dates, poha, jaggery, elaichi, and chocolate. Always check the pack label before consuming.',
  },
  {
    id: 'allergens',
    category: 'Product',
    question: 'Does it contain allergens?',
    answer:
      'Yes, it contains peanuts and may not be suitable for people with nut or ingredient allergies. Please check allergens before consuming.',
  },
  {
    id: 'delivery-area',
    category: 'Delivery',
    question: 'Where do you deliver right now?',
    answer:
      'ActivBite currently delivers within NITK Surathkal campus, with free campus delivery during launch.',
  },
  {
    id: 'delivery-fee',
    category: 'Delivery',
    question: 'Is campus delivery free?',
    answer:
      'Yes — free delivery on your campus for the current launch flow.',
  },
  {
    id: 'damaged-pack',
    category: 'Delivery',
    question: 'What if my pack is wrong, missing, or damaged?',
    answer:
      'Please report wrong packs, missing quantity, damaged packs, or broken seals during delivery itself so the team can verify and help immediately.',
  },
  {
    id: 'payment-flow',
    category: 'Payment',
    question: 'How does payment work?',
    answer:
      'Choose your pack, enter delivery details, pay using the UPI QR, and submit the transaction/reference ID for team verification.',
  },
  {
    id: 'bulk-orders',
    category: 'Wholesale',
    question: 'Can shops or cafes order in bulk?',
    answer: (
      <>
        Yes. Shops, cafes, canteens, and campus sellers can send an enquiry from the{' '}
        <Link href="/wholesale">Wholesale page</Link>.
      </>
    ),
  },
  {
    id: 'contact',
    category: 'Support',
    question: 'How do I contact ActivBite?',
    answer: (
      <>
        You can email the team at{' '}
        <a href="mailto:support@activbite.com">support@activbite.com</a>.
      </>
    ),
  },
];

const compactFaqIds = [
  'what-is-activbite',
  'pack-sizes',
  'nutrition',
  'delivery-area',
  'damaged-pack',
  'payment-flow',
  'bulk-orders',
  'contact',
] as const;

const compactFaqs = faqs.filter((faq) =>
  compactFaqIds.includes(faq.id as (typeof compactFaqIds)[number]),
);

const highlights = [
  { icon: ShoppingBag, label: '₹45 / bar' },
  { icon: PackageCheck, label: '5 · 10 · 20 · 30 packs' },
  { icon: MapPin, label: 'NITK first' },
];

const quickLinks = [
  { href: '/shop', label: 'Shop packs', icon: ShoppingBag },
  { href: '/wholesale', label: 'Wholesale enquiry', icon: Store },
  { href: 'mailto:support@activbite.com', label: 'Email support', icon: Mail },
];

const ingredientBadges = ['Oats', 'Peanuts', 'Dates', 'Poha', 'Jaggery', 'Elaichi', 'Chocolate'];

export default function FaqExperience() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [openId, setOpenId] = useState('what-is-activbite');

  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'All') {
      return compactFaqs;
    }

    return compactFaqs.filter((faq) => faq.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className={styles.faqPage} data-brand-page="faq">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
        <div className={styles.copy}>
          <h1>
            Questions,
            <span>Answered.</span>
          </h1>

          <div className={styles.decorativeRule} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p>
            Bars, packs, campus delivery, payments, ingredients, and all the tiny
            “wait, what?” moments — cleaned up in one crunchy place.
          </p>

          <div className={styles.heroHighlights}>
            {highlights.map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={18} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <aside className={styles.heroCard} aria-label="ActivBite FAQ summary">
          <div className={styles.cardTopline}>
            <span>FAQ snack box</span>
            <strong>8 answers</strong>
          </div>

          <div className={styles.productStage}>
            <Image
              src="/optimized/product-packaging.webp"
              alt="ActivBite Breakfast Bar"
              width={1600}
              height={887}
              sizes="(max-width: 900px) 78vw, 34vw"
              priority
            />
            <div className={styles.packBubble}>
              <strong>20</strong>
              <span>BARS</span>
            </div>
          </div>

          <div className={styles.ingredientRail} aria-label="Ingredients">
            {ingredientBadges.map((ingredient) => (
              <span key={ingredient}>{ingredient}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.faqShell} data-nav-theme="light" aria-labelledby="faq-heading">
        <div className={styles.faqIntro}>
          <div>
            <span>Pick a lane</span>
            <h2 id="faq-heading">Find your answer fast.</h2>
          </div>

          <div className={styles.categoryTabs} aria-label="FAQ categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? styles.activeTab : undefined}
                onClick={() => {
                  setActiveCategory(category);
                  const nextFaq =
                    category === 'All'
                      ? compactFaqs[0]
                      : compactFaqs.find((faq) => faq.category === category);
                  if (nextFaq) {
                    setOpenId(nextFaq.id);
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.faqGrid}>
          <div className={styles.faqList}>
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <article key={faq.id} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.questionButton}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-answer`}
                    onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  >
                    <span>{faq.category}</span>
                    <strong>{faq.question}</strong>
                    <ChevronDown
                      size={22}
                      className={isOpen ? styles.chevronOpen : undefined}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div id={`${faq.id}-answer`} className={styles.answer}>
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <aside className={styles.sidePanel}>
            <span className={styles.sideTag}>Still hungry?</span>
            <h3>Jump to the next useful thing.</h3>
            <p>
              If the FAQ did its job, you probably know where to go now. If it
              didn&apos;t, support is one tap away.
            </p>

            <div className={styles.quickLinks}>
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link key={label} href={href}>
                  <Icon size={18} />
                  {label}
                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>

            <div className={styles.promiseStack}>
              <span>
                <Truck size={18} />
                Free delivery on your campus
              </span>
              <span>
                <ShieldCheck size={18} />
                UPI QR payment
              </span>
              <span>
                <Soup size={18} />
                Real breakfast energy
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span>
          <Sunrise size={30} />
          ONE BAR.
        </span>
        <span>
          <Soup size={30} />
          REAL BREAKFAST.
        </span>
        <span>
          <Rocket size={30} />
          ZERO MORNING DRAMA.
        </span>
      </section>
    </main>
  );
}
