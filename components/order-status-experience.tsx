'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Rocket,
  ShoppingBag,
  Soup,
  Sunrise,
  Truck,
  Zap,
} from 'lucide-react';
import styles from './order-status-experience.module.css';

type StoredOrder = {
  orderId: string;
  packCount: number;
  packLabel: string;
  packNote: string;
  quantity: number;
  total: number;
  customerName: string;
  phone: string;
  email: string;
  deliveryPoint: string;
  hostelBlock: string;
  roomOrLandmark: string;
  createdAt: string;
};

const PACKS = [
  {
    count: 10,
    price: 400,
    label: 'Starter Pack',
    note: '10 easy breakfasts',
    image: '/PNG/PACKOF10.png',
  },
  {
    count: 20,
    price: 800,
    label: 'Routine Pack',
    note: 'Most popular',
    image: '/PNG/PACKOF20.png',
  },
  {
    count: 30,
    price: 1200,
    label: 'Power Pack',
    note: 'Stock up for the month',
    image: '/PNG/PACKOF30.png',
  },
] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const decodeParam = (value: string | null, fallback: string) => value || fallback;

export default function OrderStatusExperience() {
  const searchParams = useSearchParams();
  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    const rawOrder = window.sessionStorage.getItem('activbite:lastOrder');

    if (!rawOrder) {
      return;
    }

    try {
      setStoredOrder(JSON.parse(rawOrder) as StoredOrder);
    } catch {
      setStoredOrder(null);
    }
  }, []);

  const packCount = Number(searchParams.get('pack')) || storedOrder?.packCount || 20;
  const selectedPack = PACKS.find((pack) => pack.count === packCount) || PACKS[1];
  const quantity = Number(searchParams.get('qty')) || storedOrder?.quantity || 1;
  const total = Number(searchParams.get('total')) || storedOrder?.total || selectedPack.price * quantity;
  const orderId = decodeParam(searchParams.get('order'), storedOrder?.orderId || 'AB-NITK-LOCKED');
  const customerName = decodeParam(searchParams.get('name'), storedOrder?.customerName || 'Breakfast legend');
  const deliveryPoint = decodeParam(searchParams.get('point'), storedOrder?.deliveryPoint || 'NITK campus');

  const studentLine = useMemo(() => {
    const firstName = customerName.trim().split(' ')[0] || 'legend';
    return `${firstName}, breakfast scene is officially sorted.`;
  }, [customerName]);

  const deliveryLine = storedOrder
    ? `${storedOrder.deliveryPoint} · ${storedOrder.hostelBlock} · ${storedOrder.roomOrLandmark}`
    : `${deliveryPoint} · NITK campus`;

  return (
    <main className={styles.statusPage}>
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

        <div className={styles.headerActions}>
          <Link href="/shop" className={styles.shopLink}>
            <ShoppingBag size={18} />
            Shop
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <h1>
            Order
            <span>Locked.</span>
          </h1>

          <div className={styles.decorativeRule} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p className={styles.lead}>{studentLine}</p>
          <p className={styles.subLead}>
            Payment done, breakfast mission accepted. If anything needs
            attention, the ActivBite team will contact you directly.
          </p>

          <div className={styles.slangGrid}>
            <span>
              <Zap size={18} />
              Mess queue dodged
            </span>
            <span>
              <Truck size={18} />
              Delivery squad warming up
            </span>
            <span>
              <Soup size={18} />
              8 AM comeback loading
            </span>
          </div>
        </div>

        <aside className={styles.ticketCard} aria-label="Order ticket">
          <div className={styles.ticketHeader}>
            <div>
              <span>Breakfast ticket</span>
              <strong>{orderId}</strong>
            </div>
            <p>Confirmed</p>
          </div>

          <div className={styles.productStage}>
            <Image
              src={selectedPack.image}
              alt={`ActivBite Breakfast Bar pack of ${selectedPack.count}`}
              width={900}
              height={675}
              priority
              unoptimized
            />
            <div className={styles.packBubble}>
              <strong>{selectedPack.count}</strong>
              <span>BARS</span>
            </div>
          </div>

          <div className={styles.ticketBody}>
            <span className={styles.microLabel}>Fuel selected</span>
            <h2>{selectedPack.label}</h2>
            <p>Pack of {selectedPack.count} · {selectedPack.note}</p>

            <div className={styles.orderRows}>
              <div>
                <span>Name</span>
                <strong>{customerName}</strong>
              </div>
              <div>
                <span>Drop point</span>
                <strong>{deliveryLine}</strong>
              </div>
              <div>
                <span>Qty</span>
                <strong>{quantity}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.statusDock} aria-label="Order progress">
        <div className={styles.statusIntro}>
          <span>Live-ish campus tracker</span>
          <h2>What happens next?</h2>
        </div>

        <div className={styles.timeline}>
          <article>
            <CheckCircle2 size={23} />
            <span>01</span>
            <h3>Details grabbed</h3>
            <p>Name, phone, email and drop point are locked. Admin brain can relax.</p>
          </article>
          <article>
            <PackageCheck size={23} />
            <span>02</span>
            <h3>Pack reserved</h3>
            <p>Your {selectedPack.count}-bar breakfast backup is sitting in the queue.</p>
          </article>
          <article>
            <Clock3 size={23} />
            <span>03</span>
            <h3>Team confirms</h3>
            <p>ActivBite will verify the order before campus delivery movement begins.</p>
          </article>
          <article>
            <Truck size={23} />
            <span>04</span>
            <h3>Campus drop</h3>
            <p>Free delivery on your campus. Wrong/damaged issues? Report during delivery.</p>
          </article>
        </div>

        <div className={styles.nextActions}>
          <Link href="/faq">
            Read FAQ
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className={styles.bottomStrip} aria-label="ActivBite promise">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
