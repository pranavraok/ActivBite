'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import PublicHeader from './public-header';
import { isPackAvailable, type InventoryItem } from '@/lib/inventory-types';

const PACKS = [
  {
    count: 5,
    price: 225,
    mrp: 225,
    discount: 0,
    label: 'Mini Pack',
    note: 'A simple 5-day trial',
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
    note: 'Breakfast for 10 busy mornings',
    badge: '',
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
    badge: '',
    popular: false,
    image: '/PNG/PACKOF20.png',
  },
  {
    count: 30,
    price: 1149,
    mrp: 1350,
    discount: 201,
    label: 'Power Pack',
    note: 'Best value for the month',
    badge: 'Best value',
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
  const [quantities, setQuantities] = useState<Record<number, number>>({ 30: 1 });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [inventoryError, setInventoryError] = useState('');

  useEffect(() => {
    const requestedCount = Number(new URLSearchParams(window.location.search).get('pack'));
    const requestedPack = PACKS.find((pack) => pack.count === requestedCount);
    if (requestedPack) {
      setSelectedPack(requestedPack);
      setQuantities({ [requestedPack.count]: 1 });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/inventory', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !Array.isArray(data.inventory)) {
          throw new Error(data.message || 'Availability could not be confirmed.');
        }
        if (!cancelled) setInventory(data.inventory);
      })
      .catch((error) => {
        if (!cancelled) setInventoryError(error instanceof Error ? error.message : 'Availability could not be confirmed.');
      })
      .finally(() => { if (!cancelled) setIsLoadingInventory(false); });
    return () => { cancelled = true; };
  }, []);

  const stockFor = (packCount: number) => inventory.find((item) => item.packCount === packCount);
  const selectedStock = stockFor(selectedPack.count);
  const selectedPackAvailable = !inventoryError && isPackAvailable(selectedStock, 1);
  const basket = PACKS.map((pack) => ({ pack, quantity: quantities[pack.count] || 0 })).filter((item) => item.quantity > 0);
  const basketTotal = basket.reduce((sum, item) => sum + item.pack.price * item.quantity, 0);
  const basketCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  const basketAvailable = !inventoryError && basket.length > 0 && basket.every(({ pack, quantity }) => isPackAvailable(stockFor(pack.count), quantity));

  const maxFor = (packCount: number) => {
    const item = stockFor(packCount);
    return item?.unitsRemaining === null || item?.unitsRemaining === undefined ? 10 : Math.max(0, Math.min(10, item.unitsRemaining));
  };

  const updateQuantity = (packCount: number, next: number) => {
    const safeValue = Math.max(0, Math.min(maxFor(packCount), next));
    setQuantities((current) => ({ ...current, [packCount]: safeValue }));
  };

  useEffect(() => {
    if (isLoadingInventory || inventoryError || selectedPackAvailable) return;
    const firstAvailable = PACKS.find((pack) => isPackAvailable(stockFor(pack.count), 1));
    if (firstAvailable) {
      setSelectedPack(firstAvailable);
      setQuantities({ [firstAvailable.count]: 1 });
    }
  }, [inventory, inventoryError, isLoadingInventory, selectedPackAvailable]);

  const handleBuyNow = () => {
    if (!basketAvailable || isLoadingInventory) return;
    const params = new URLSearchParams({ items: basket.map(({ pack, quantity }) => `${pack.count}:${quantity}`).join(',') });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <main className={styles.shopPage} data-brand-page="shop">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
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
            Pick one pack or mix a few together. Your total updates instantly, so building the right breakfast stack stays simple.
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
              <strong>Build your breakfast stack</strong>
              <small>Use + and − on any pack. Mix pack sizes freely.</small>
            </div>
            {isLoadingInventory ? (
              <div className={styles.stockChecking}>Checking stock…</div>
            ) : inventoryError ? (
              <div className={styles.outOfStock}>Stock unavailable</div>
            ) : selectedStock?.unitsRemaining === 0 ? (
              <div className={styles.outOfStock}>Currently out of stock</div>
            ) : selectedStock?.status === 'low_stock' ? (
              <div className={styles.lowStock}><i /> Only {selectedStock.unitsRemaining} left</div>
            ) : (
              <div className={styles.inStock}><i /> In stock</div>
            )}
          </div>

          <div className={styles.packOptions} aria-label="Build a mixed pack order">
            {PACKS.map((pack) => {
              const selected = pack.count === selectedPack.count;
              const packStock = stockFor(pack.count);
              const available = isPackAvailable(packStock, 1);
              return (
                <div
                  key={pack.count}
                  aria-disabled={!available}
                  className={`${selected ? styles.selectedPack : ''} ${pack.discount === 0 ? styles.compactPack : ''} ${!available ? styles.soldOutPack : ''}`}
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
                    <small>{pack.count} bars · {pack.note}</small>
                    {!available && <span className={styles.soldOutLabel}>Currently out of stock</span>}
                    {pack.discount > 0 ? (
                      <span className={styles.offerLine}>
                        <s>{formatPrice(pack.mrp)}</s>
                        <mark>Save {formatPrice(pack.discount)}</mark>
                      </span>
                    ) : null}
                  </span>
                  <span className={styles.packPrice}>
                    <b>{formatPrice(pack.price)}</b>
                    <small>{formatPrice(Math.round(pack.price / pack.count))} / bar</small>
                  </span>
                  <span className={styles.packQuantity} aria-label={`${pack.label} quantity`} onClick={(event) => event.stopPropagation()}>
                    <button type="button" disabled={(quantities[pack.count] || 0) === 0} onClick={() => updateQuantity(pack.count, (quantities[pack.count] || 0) - 1)} aria-label={`Remove one ${pack.label}`}><Minus size={15} /></button>
                    <b>{quantities[pack.count] || 0}</b>
                    <button type="button" disabled={!available || (quantities[pack.count] || 0) >= maxFor(pack.count)} onClick={() => { setSelectedPack(pack); updateQuantity(pack.count, (quantities[pack.count] || 0) + 1); }} aria-label={`Add one ${pack.label}`}><Plus size={15} /></button>
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.purchaseRow}>
            <div className={styles.basketSummary}><small>Your stack</small><strong>{basketCount} {basketCount === 1 ? 'pack' : 'packs'}</strong></div>
            <div className={styles.total}>
              <small>Total</small>
              <strong>{formatPrice(basketTotal)}</strong>
            </div>
          </div>

          <button
            type="button"
            className={styles.buyNow}
            onClick={handleBuyNow}
            disabled={isLoadingInventory || !basketAvailable}
          >
            {inventoryError ? 'Stock unavailable' : basket.length === 0 ? 'Add a pack to continue' : !basketAvailable ? 'Check selected stock' : 'Purchase your stack'}
            {basketAvailable && <ArrowRight size={20} />}
          </button>

          {inventoryError && <p className={styles.inventoryError}>{inventoryError} Please refresh and try again.</p>}

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

      <section className={styles.bottomStrip} data-nav-theme="light">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
