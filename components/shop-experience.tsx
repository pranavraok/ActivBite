'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const PACKS = [
  {
    count: 5,
    price: 225,
    mrp: 225,
    discount: 0,
    label: 'Mini Pack',
    note: 'Try 5 easy breakfasts',
    badge: '',
    popular: false,
    image: '/PNG/PACKOF5.png',
  },
  {
    count: 10,
    price: 420,
    mrp: 450,
    discount: 30,
    label: 'Starter Pack',
    note: '10 easy breakfasts',
    badge: '₹30 OFF',
    popular: false,
    image: '/PNG/PACKOF10.png',
  },
  {
    count: 20,
    price: 825,
    mrp: 900,
    discount: 75,
    label: 'Routine Pack',
    note: 'Campus favourite',
    badge: '₹75 OFF',
    popular: false,
    image: '/PNG/PACKOF20.png',
  },
  {
    count: 30,
    price: 1149,
    mrp: 1350,
    discount: 201,
    label: 'Power Pack',
    note: 'Best value - stock up',
    badge: 'BEST DEAL • ₹201 OFF',
    popular: true,
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
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<(typeof PACKS)[number]>(PACKS[3]);
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    const params = new URLSearchParams({
      pack: String(selectedPack.count),
      qty: String(quantity),
    });

    router.push(`/checkout?${params.toString()}`);
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
              <strong><span>300</span><small>kcal</small></strong>
            </div>
            <div>
              <BicepsFlexed size={30} fill="currentColor" />
              <strong><span>9.3g</span><small>Protein</small></strong>
            </div>
            <div>
              <Leaf size={30} fill="currentColor" />
              <strong><span>6.5g</span><small>Fibre</small></strong>
            </div>
          </div>
        </div>

        <aside className={styles.buyPanel}>
          <div className={styles.panelHeading}>
            <div>
              <span>Choose your pack</span>
              <strong>{formatPrice(45)} <small>/ bar</small></strong>
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
                  className={`${selected ? styles.selectedPack : ''} ${pack.discount === 0 ? styles.compactPack : ''}`}
                  onClick={() => setSelectedPack(pack)}
                >
                  {pack.badge && (
                    <em className={pack.popular ? styles.bestDeal : undefined}>
                      {pack.badge}
                    </em>
                  )}
                  <span className={styles.radio}>{selected && <i />}</span>
                  <span className={styles.packCopy}>
                    <strong>{pack.label}</strong>
                    <small>Pack of {pack.count} - {pack.note}</small>
                    {pack.discount > 0 ? (
                      <span className={styles.offerLine}>
                        <s>{formatPrice(pack.mrp)}</s>
                        <mark>{formatPrice(pack.discount)} off</mark>
                      </span>
                    ) : (
                      <span className={styles.noOfferLine}>No offer on this mini pack</span>
                    )}
                  </span>
                  <span className={styles.packPrice}>
                    <b>{formatPrice(pack.price)}</b>
                    <small>{pack.discount > 0 ? 'launch price' : 'regular price'}</small>
                  </span>
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
          >
            Purchase now <ArrowRight size={20} />
          </button>

          <div className={styles.reassurance}>
            <span><Truck size={17} /> Free delivery on your campus</span>
            <span><ShieldCheck size={17} /> UPI QR payment</span>
          </div>
        </aside>

        <div className={styles.productVisual}>
          <div className={styles.ingredientOrbit} aria-label="Ingredients">
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
          </div>
          <div className={styles.sunburst} aria-hidden="true" />
          <div className={styles.packCount}>
            <strong>{selectedPack.count}</strong>
            <span>BARS</span>
          </div>
          <Image
            key={selectedPack.count}
            className={`${styles.productImage} ${selectedPack.count === 5 ? styles.miniPackImage : ''}`}
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
