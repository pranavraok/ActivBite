'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import styles from './shop-experience.module.css';

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
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [selectedPack, setSelectedPack] = useState<(typeof PACKS)[number]>(PACKS[1]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addSelectedPack = () => {
    addItem({
      product_id: `breakfast-bar-${selectedPack.count}-pack`,
      name: `ActivBite Breakfast Bar — Pack of ${selectedPack.count}`,
      price: selectedPack.price,
      quantity,
      image_url: selectedPack.image,
    });
  };

  const handleAddToCart = () => {
    addSelectedPack();
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addSelectedPack();
    router.push('/checkout');
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

        <Link href="/cart" className={styles.cartLink} aria-label={`Cart with ${totalCartItems} items`}>
          <ShoppingBag size={20} strokeWidth={2.4} />
          <span>Cart</span>
          {totalCartItems > 0 && <b>{totalCartItems}</b>}
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <Sparkles size={16} />
            <span>Your everyday breakfast bar</span>
          </div>

          <h1>
            GOOD MORNINGS,
            <span>PACKED.</span>
          </h1>

          <p className={styles.intro}>
            A satisfying breakfast bar made with familiar ingredients—built for busy
            mornings, long days, and everything in between.
          </p>

          <div className={styles.proofRow} aria-label="Product highlights">
            <span><Check size={15} /> High protein</span>
            <span><Check size={15} /> High fibre</span>
            <span><Check size={15} /> Real ingredients</span>
          </div>
        </div>

        <div className={styles.productVisual}>
          <span className={`${styles.ingredient} ${styles.oat}`}>OATS</span>
          <span className={`${styles.ingredient} ${styles.date}`}>DATES</span>
          <span className={`${styles.ingredient} ${styles.cocoa}`}>COCOA</span>
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
                    <small>Pack of {pack.count} · {pack.note}</small>
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

          <button type="button" className={styles.buyNow} onClick={handleBuyNow}>
            Purchase now <ArrowRight size={20} />
          </button>
          <button type="button" className={styles.addToCart} onClick={handleAddToCart}>
            {isAdded ? <><Check size={18} /> Added to cart</> : <><ShoppingBag size={18} /> Add to cart</>}
          </button>

          <div className={styles.reassurance}>
            <span><Truck size={17} /> Free delivery above ₹500</span>
            <span><ShieldCheck size={17} /> Secure checkout</span>
          </div>
        </aside>
      </section>

      <section className={styles.bottomStrip}>
        <span>ONE BAR.</span>
        <span>REAL BREAKFAST.</span>
        <span>ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
