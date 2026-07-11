'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BicepsFlexed,
  Leaf,
  Minus,
  Plus,
  Rocket,
  ShieldCheck,
  Soup,
  Sunrise,
  Truck,
  Zap,
} from 'lucide-react';
import styles from './shop-experience.module.css';

type CashfreeCheckout = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_top' | '_modal';
  }) => Promise<unknown> | void;
};

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => CashfreeCheckout;
  }
}

let cashfreeSdkPromise: Promise<void> | null = null;

const loadCashfreeSdk = () => {
  if (typeof window === 'undefined' || window.Cashfree) {
    return Promise.resolve();
  }

  if (!cashfreeSdkPromise) {
    cashfreeSdkPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Unable to load Cashfree checkout.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Cashfree checkout.'));
      document.head.appendChild(script);
    });
  }

  return cashfreeSdkPromise;
};

const PACKS = [
  {
    count: 10,
    price: 400,
    label: 'Starter Pack',
    note: '10 easy breakfasts',
    popular: false,
    image: '/PNG/PACKOF10.png',
  },
  {
    count: 20,
    price: 800,
    label: 'Routine Pack',
    note: 'Most popular',
    popular: true,
    image: '/PNG/PACKOF20.png',
  },
  {
    count: 30,
    price: 1200,
    label: 'Power Pack',
    note: 'Stock up for the month',
    popular: false,
    image: '/PNG/PACKOF30.png',
  },
] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export default function ShopExperience() {
  const [selectedPack, setSelectedPack] = useState<(typeof PACKS)[number]>(PACKS[1]);
  const [quantity, setQuantity] = useState(1);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleBuyNow = async () => {
    setPaymentError('');
    setIsPaymentLoading(true);

    try {
      const response = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packCount: selectedPack.count,
          quantity,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.paymentSessionId) {
        throw new Error(data.error || 'Unable to open Cashfree payment right now.');
      }

      await loadCashfreeSdk();

      if (!window.Cashfree) {
        throw new Error('Cashfree checkout is not available right now.');
      }

      const cashfree = window.Cashfree({
        mode: data.mode === 'production' ? 'production' : 'sandbox',
      });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self',
      });
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to open payment gateway right now.');
      setIsPaymentLoading(false);
    }
  };

  return (
    <main className={styles.shopPage}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="ActivBite home">
          <Image
            src="/optimized/ab-logo.webp"
            alt="ActivBite"
            width={640}
            height={640}
            priority
          />
        </Link>

      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <h1>
            BREAKFAST,
            <span>PACKED.</span>
          </h1>

          <div className={styles.decorativeRule} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p className={styles.intro}>
            Made for busy mornings, long days, and quick checkouts.
          </p>

          <div className={styles.statsGrid} aria-label="Nutrition highlights">
            <div>
              <Zap size={28} fill="currentColor" />
              <strong>300 <small>kcal</small></strong>
            </div>
            <div>
              <BicepsFlexed size={30} fill="currentColor" />
              <strong>9.3g <small>Protein</small></strong>
            </div>
            <div>
              <Leaf size={30} fill="currentColor" />
              <strong>6.5g <small>Fibre</small></strong>
            </div>
          </div>
        </div>

        <aside className={styles.buyPanel}>
          <div className={styles.panelHeading}>
            <div>
              <span>Choose your pack</span>
              <strong>{formatPrice(40)} <small>/ bar</small></strong>
            </div>
            <div className={styles.inStock}><i /> In stock</div>
          </div>

          <div className={styles.packOptions} role="radiogroup" aria-label="Select pack size">
            {PACKS.map((pack) => {
              const selected = pack.count === selectedPack.count;
              return (
                <button
                  key={pack.count}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={selected ? styles.selectedPack : ''}
                  onClick={() => setSelectedPack(pack)}
                >
                  {pack.popular && <em>POPULAR</em>}
                  <span className={styles.radio}>{selected && <i />}</span>
                  <span className={styles.packCopy}>
                    <strong>{pack.label}</strong>
                    <small>Pack of {pack.count} - {pack.note}</small>
                  </span>
                  <b>{formatPrice(pack.price)}</b>
                </button>
              );
            })}
          </div>

          <div className={styles.purchaseRow}>
            <div className={styles.quantity} aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity === 1}
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>
            <div className={styles.total}>
              <small>Total</small>
              <strong>{formatPrice(selectedPack.price * quantity)}</strong>
            </div>
          </div>

          <button
            type="button"
            className={styles.buyNow}
            onClick={handleBuyNow}
            disabled={isPaymentLoading}
          >
            {isPaymentLoading ? 'Opening Cashfree...' : <>Purchase now <ArrowRight size={20} /></>}
          </button>
          {paymentError && <p className={styles.paymentError} role="alert">{paymentError}</p>}

          <div className={styles.reassurance}>
            <span><Truck size={17} /> Free delivery on your campus</span>
            <span><ShieldCheck size={17} /> Secure checkout</span>
          </div>
        </aside>

        <div className={styles.productVisual}>
          <span className={`${styles.ingredient} ${styles.oat}`} aria-label="Oats">
            <Image src="/PNG/OAT.png" alt="Oats" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.date}`} aria-label="Dates">
            <Image src="/PNG/DATES.png" alt="Dates" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.peanuts}`} aria-label="Peanuts">
            <Image src="/PNG/PEANUTS.png" alt="Peanuts" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.chocolate}`} aria-label="Chocolate">
            <Image src="/PNG/CHOCOLATE.png" alt="Chocolate" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.poha}`} aria-label="Poha">
            <Image src="/PNG/POHA.png" alt="Poha" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.jaggery}`} aria-label="Jaggery">
            <Image src="/PNG/JAGGERY.png" alt="Jaggery" width={180} height={180} unoptimized />
          </span>
          <span className={`${styles.ingredient} ${styles.elaichi}`} aria-label="Elaichi">
            <Image src="/PNG/ELAICHI.png" alt="Elaichi" width={180} height={180} unoptimized />
          </span>
          <div className={styles.sunburst} aria-hidden="true" />
          <div className={styles.packCount}>
            <strong>{selectedPack.count}</strong>
            <span>BARS</span>
          </div>
          <Image
            key={selectedPack.count}
            className={styles.productImage}
            src={selectedPack.image}
            alt={`ActivBite Breakfast Bar pack of ${selectedPack.count}`}
            width={1440}
            height={1080}
            priority
            unoptimized
            sizes="(max-width: 900px) 92vw, 48vw"
          />
        </div>
      </section>

      <section className={styles.bottomStrip}>
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
