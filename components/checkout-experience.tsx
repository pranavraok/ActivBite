'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  Rocket,
  ShieldCheck,
  Soup,
  Sunrise,
  Truck,
} from 'lucide-react';
import styles from './checkout-experience.module.css';
import PublicHeader from './public-header';

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  deliveryPoint: string;
  hostelBlock: string;
  roomOrLandmark: string;
  deliveryConfirm: boolean;
};

type FormErrors = Partial<Record<keyof CheckoutForm | 'payment', string>>;

type CreatedOrder = {
  orderId: string;
  paymentToken: string;
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
    count: 5,
    price: 225,
    mrp: 225,
    discount: 0,
    label: 'Mini Pack',
    note: 'Try 5 easy breakfasts',
    image: '/PNG/PACKOF5.png',
  },
  {
    count: 10,
    price: 420,
    mrp: 450,
    discount: 30,
    label: 'Starter Pack',
    note: '10 easy breakfasts',
    image: '/PNG/PACKOF10.png',
  },
  {
    count: 20,
    price: 825,
    mrp: 900,
    discount: 75,
    label: 'Routine Pack',
    note: 'Campus favourite',
    image: '/PNG/PACKOF20.png',
  },
  {
    count: 30,
    price: 1149,
    mrp: 1350,
    discount: 201,
    label: 'Power Pack',
    note: 'Best value - stock up',
    image: '/PNG/PACKOF30.png',
  },
] as const;

const DELIVERY_POINTS = [
  'Hostel',
  'Department',
  'Library',
  'Main gate',
  'Sports complex',
  'Other NITK location',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const clampQuantity = (value: number) => {
  if (!Number.isInteger(value)) {
    return 1;
  }

  return Math.min(10, Math.max(1, value));
};

export default function CheckoutExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    deliveryPoint: 'Hostel',
    hostelBlock: '',
    roomOrLandmark: '',
    deliveryConfirm: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPack = useMemo(() => {
    const packCount = Number(searchParams.get('pack'));
    return PACKS.find((pack) => pack.count === packCount) || PACKS[3];
  }, [searchParams]);

  const quantity = useMemo(
    () => clampQuantity(Number(searchParams.get('qty') || 1)),
    [searchParams]
  );

  const total = selectedPack.price * quantity;

  const updateField = <Field extends keyof CheckoutForm>(
    field: Field,
    value: CheckoutForm[Field]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, payment: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const cleanedPhone = form.phone.replace(/\D/g, '');

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter the customer name.';
    }

    if (!PHONE_PATTERN.test(cleanedPhone)) {
      nextErrors.phone = 'Please enter a valid 10 digit phone number.';
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email.';
    }

    if (!form.deliveryPoint) {
      nextErrors.deliveryPoint = 'Please select a delivery point.';
    }

    if (form.hostelBlock.trim().length < 2) {
      nextErrors.hostelBlock = 'Please enter hostel, block, department, or area.';
    }

    if (form.roomOrLandmark.trim().length < 2) {
      nextErrors.roomOrLandmark = 'Please enter room number or landmark.';
    }

    if (!form.deliveryConfirm) {
      nextErrors.deliveryConfirm = 'Please confirm the delivery rule.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const cleanedPhone = form.phone.replace(/\D/g, '');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.fullName.trim(),
          phone: cleanedPhone,
          email: form.email.trim(),
          deliveryPoint: form.deliveryPoint,
          hostelBlock: form.hostelBlock.trim(),
          roomOrLandmark: form.roomOrLandmark.trim(),
          packCount: selectedPack.count,
          quantity,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not save your order right now.');
      }

      if (
        typeof data.paymentToken !== 'string' ||
        !data.order ||
        data.order.trackingId !== data.trackingId
      ) {
        throw new Error('Your order was saved, but payment could not be prepared. Please try again.');
      }

      const order: CreatedOrder = {
        orderId: data.order.trackingId,
        paymentToken: data.paymentToken,
        packCount: Number(data.order.packCount),
        packLabel: String(data.order.packLabel),
        packNote: selectedPack.note,
        quantity: Number(data.order.quantity),
        total: Number(data.order.total),
        customerName: form.fullName.trim(),
        phone: cleanedPhone,
        email: form.email.trim(),
        deliveryPoint: form.deliveryPoint,
        hostelBlock: form.hostelBlock.trim(),
        roomOrLandmark: form.roomOrLandmark.trim(),
        createdAt: new Date().toISOString(),
      };

      window.sessionStorage.setItem('activbite:lastOrder', JSON.stringify(order));
      router.replace(`/order-status?order=${encodeURIComponent(order.orderId)}`);
    } catch (error) {
      setErrors({
        payment:
          error instanceof Error
            ? error.message
            : 'Could not save your order right now. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.checkoutPage} data-brand-page="checkout">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.shell} data-nav-theme="light">
        <div className={styles.leftColumn}>
          <div className={styles.copy}>
            <h1>Almost there.</h1>
            <p>Add your delivery details, then pay instantly using the UPI QR.</p>
          </div>

          <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeading}>
              <h2>Delivery details</h2>
              <span>Step 1 of 1</span>
            </div>

            <div className={styles.gridTwo}>
              <label>
                Name
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Customer name"
                  autoComplete="name"
                />
                {errors.fullName && <small>{errors.fullName}</small>}
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="9876543210"
                  inputMode="numeric"
                  autoComplete="tel"
                />
                {errors.phone && <small>{errors.phone}</small>}
              </label>
            </div>

            <label>
              Email
              <input
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@nitk.edu.in"
                type="email"
                autoComplete="email"
              />
              {errors.email && <small>{errors.email}</small>}
            </label>

            <div className={styles.gridTwo}>
              <label>
                Delivery point
                <select
                  value={form.deliveryPoint}
                  onChange={(event) => updateField('deliveryPoint', event.target.value)}
                >
                  {DELIVERY_POINTS.map((point) => (
                    <option key={point} value={point}>
                      {point}
                    </option>
                  ))}
                </select>
                {errors.deliveryPoint && <small>{errors.deliveryPoint}</small>}
              </label>

              <label>
                Hostel / area
                <input
                  value={form.hostelBlock}
                  onChange={(event) => updateField('hostelBlock', event.target.value)}
                  placeholder="Eg: Block, dept, area"
                />
                {errors.hostelBlock && <small>{errors.hostelBlock}</small>}
              </label>
            </div>

            <label>
              Room / landmark
              <input
                value={form.roomOrLandmark}
                onChange={(event) => updateField('roomOrLandmark', event.target.value)}
                placeholder="Eg: Room 214, near main stairs"
              />
              {errors.roomOrLandmark && <small>{errors.roomOrLandmark}</small>}
            </label>

            <label className={styles.confirmRow}>
              <input
                type="checkbox"
                checked={form.deliveryConfirm}
                onChange={(event) => updateField('deliveryConfirm', event.target.checked)}
              />
              <span>
                Delivery is within NITK. Wrong, missing, damaged, or broken-seal
                pack issues must be reported during delivery.
              </span>
            </label>
            {errors.deliveryConfirm && (
              <p className={styles.checkboxError}>{errors.deliveryConfirm}</p>
            )}

            {errors.payment && (
              <p className={styles.paymentError} role="alert">
                {errors.payment}
              </p>
            )}

            <button type="submit" className={styles.payButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className={styles.spinner} />
                  Locking order...
                </>
              ) : (
                <>
                  Confirm my breakfast
                  <ArrowRight size={24} />
                </>
              )}
            </button>

            <p className={styles.legalLinks}>
              By confirming, you agree to the <Link href="/terms">Terms</Link> and{' '}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        <div className={styles.summaryColumn}>
          <div className={styles.promiseGrid}>
            <span><MapPin size={20} /> NITK only</span>
            <span><Truck size={20} /> Free delivery</span>
              <span><ShieldCheck size={20} /> QR payment next</span>
          </div>

          <aside className={styles.summaryCard} aria-label="Order summary">
            <div className={styles.summaryHeader}>
              <h2>Order summary</h2>
              <strong>{formatPrice(total)}</strong>
            </div>

            <div className={styles.summaryBody}>
              <div className={styles.summaryImage}>
                <Image
                  src={selectedPack.image}
                  alt={`ActivBite Breakfast Bar pack of ${selectedPack.count}`}
                  width={900}
                  height={675}
                  priority
                  unoptimized
                />
              </div>

              <div className={styles.summaryCopy}>
                <span>Breakfast ticket</span>
                <h2>{selectedPack.label}</h2>
                <p>Pack of {selectedPack.count} - {selectedPack.note}</p>
                <small className={styles.summaryOffer}>
                  {selectedPack.discount > 0
                    ? `You save ${formatPrice(selectedPack.discount)} on this pack`
                    : 'No offer on this mini pack'}
                </small>
              </div>

              <div className={styles.summaryRows}>
                {selectedPack.discount > 0 && (
                  <>
                    <div>
                      <span>MRP</span>
                      <strong>{formatPrice(selectedPack.mrp)}</strong>
                    </div>
                    <div className={styles.discountRow}>
                      <span>Offer</span>
                      <strong>-{formatPrice(selectedPack.discount)}</strong>
                    </div>
                  </>
                )}
                <div>
                  <span>Pack</span>
                  <strong>{formatPrice(selectedPack.price)}</strong>
                </div>
                <div>
                  <span>Qty</span>
                  <strong>{quantity}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>Free</strong>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <p className={styles.foodNotice}>
                <CheckCircle2 size={17} />
                Oats, peanuts, dates, poha, jaggery, elaichi, chocolate.
                Check allergens before consuming.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>

    </main>
  );
}
