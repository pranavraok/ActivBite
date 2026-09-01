'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Home,
  LifeBuoy,
  Mail,
  PackageCheck,
  QrCode,
  Rocket,
  Send,
  ShoppingBag,
  Soup,
  Sunrise,
  Truck,
  Zap,
} from 'lucide-react';
import {
  ACTIVBITE_PAYMENT_CONFIG,
  buildUpiPaymentUri,
  isDummyPaymentConfig,
} from '@/lib/payment-config';
import styles from './order-status-experience.module.css';
import PublicHeader from './public-header';

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

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

const decodeParam = (value: string | null, fallback: string) => value || fallback;

export default function OrderStatusExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [hasCopiedUpi, setHasCopiedUpi] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const packCount = Number(searchParams.get('pack')) || storedOrder?.packCount || 30;
  const selectedPack = PACKS.find((pack) => pack.count === packCount) || PACKS[3];
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

  const readableDeliveryLine = deliveryLine.replaceAll('\u00C2\u00B7', '·');

  const cleanDeliveryLine = readableDeliveryLine.replaceAll('\u00C2\u00B7', '\u00B7');
  const friendlyDeliveryLine = storedOrder
    ? [storedOrder.deliveryPoint, storedOrder.hostelBlock, storedOrder.roomOrLandmark]
        .filter(Boolean)
        .join(' · ')
    : `${deliveryPoint} · NITK campus`;
  const selectedPackMeta = `Pack of ${selectedPack.count} \u00B7 ${selectedPack.note}`;

  const upiPaymentUri = useMemo(
    () => buildUpiPaymentUri({ amount: total, orderId }),
    [orderId, total]
  );

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(ACTIVBITE_PAYMENT_CONFIG.upiId);
      setHasCopiedUpi(true);
      window.setTimeout(() => setHasCopiedUpi(false), 1600);
    } catch {
      setPaymentError('Could not copy the UPI ID. Please type it manually.');
    }
  };

  const handlePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedReference = paymentReference.trim();

    if (cleanedReference.length < 6) {
      setPaymentError('Please enter the UPI transaction/reference ID.');
      setPaymentSuccess('');
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError('');
    setPaymentSuccess('');

    try {
      const response = await fetch('/api/payment-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentReference: cleanedReference,
          customerName,
          phone: storedOrder?.phone || '',
          email: storedOrder?.email || '',
          deliveryPoint: storedOrder?.deliveryPoint || deliveryPoint,
          hostelBlock: storedOrder?.hostelBlock || '',
          roomOrLandmark: storedOrder?.roomOrLandmark || '',
          packLabel: selectedPack.label,
          packCount: selectedPack.count,
          quantity,
          total,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || 'Could not submit the payment reference. Please try again.'
        );
      }

      const message =
        data?.message ||
        'Payment reference received. ActivBite will verify it and contact you if needed.';
      setPaymentSuccess(message);
      setShowSuccessModal(true);

      window.sessionStorage.setItem(
        'activbite:lastPayment',
        JSON.stringify({
          orderId,
          paymentReference: cleanedReference,
          paymentStatus: 'submitted_for_manual_verification',
          createdAt: new Date().toISOString(),
        })
      );

      window.setTimeout(() => {
        router.push('/');
      }, 10000);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Could not submit the payment reference. Please try again.'
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <main className={styles.statusPage} data-brand-page="order-status">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
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
            Breakfast mission is locked. Pay the exact amount using the UPI QR
            below, then submit the transaction/reference ID for team verification.
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

          <div className={styles.orderMiniCard}>
            <div>
              <span>Order ID</span>
              <strong>{orderId}</strong>
            </div>
            <div>
              <span>Pack</span>
              <strong>{selectedPack.label} · {quantity} qty</strong>
            </div>
            <div>
              <span>Offer</span>
              <strong>
                {selectedPack.discount > 0
                  ? `You saved ${formatPrice(selectedPack.discount * quantity)}`
                  : 'No offer on mini pack'}
              </strong>
            </div>
            <div>
              <span>Drop point</span>
              <strong>{friendlyDeliveryLine}</strong>
            </div>
          </div>
        </div>

        <aside className={styles.paymentCard} aria-label="UPI payment and transaction ID">
          <div className={styles.paymentCardHeader}>
            <div>
              <span>UPI payment</span>
              <h2>Scan. Pay. Paste ID.</h2>
            </div>
            <strong>{formatPrice(total)}</strong>
          </div>

          <div className={styles.paymentStepPills} aria-label="Payment steps">
            <span><QrCode size={17} /> Pay exact amount</span>
            <span><Send size={17} /> Submit ref ID</span>
          </div>

          <div className={styles.qrHeroBox}>
            <div className={styles.qrFrame}>
              {ACTIVBITE_PAYMENT_CONFIG.qrImage ? (
                <img src={ACTIVBITE_PAYMENT_CONFIG.qrImage} alt="ActivBite UPI QR code" />
              ) : (
                <div className={styles.dummyQr} aria-label="Temporary dummy UPI QR">
                  <i />
                  <i />
                  <i />
                  <span>DEMO</span>
                </div>
              )}
            </div>

            <div className={styles.qrSideNote}>
              <span>Payee</span>
              <strong>{ACTIVBITE_PAYMENT_CONFIG.payeeName}</strong>
              <p>{ACTIVBITE_PAYMENT_CONFIG.upiId}</p>
              {isDummyPaymentConfig && (
                <small>Demo QR active until real bank QR is added.</small>
              )}
            </div>
          </div>

          <div className={styles.paymentButtons}>
            <a className={styles.upiButton} href={upiPaymentUri}>
              <QrCode size={19} />
              Open UPI app
              <ArrowRight size={20} />
            </a>
            <button type="button" className={styles.copyUpiButton} onClick={handleCopyUpi}>
              <Copy size={17} />
              {hasCopiedUpi ? 'UPI copied' : 'Copy UPI ID'}
            </button>
          </div>

          <form className={styles.referenceForm} onSubmit={handlePaymentSubmit}>
            <label>
              Transaction / reference ID
              <input
                value={paymentReference}
                onChange={(event) => {
                  setPaymentReference(event.target.value);
                  setPaymentError('');
                  setPaymentSuccess('');
                }}
                placeholder="Paste UPI ref no. here"
                autoComplete="off"
              />
            </label>

            <p className={styles.referenceHint}>
              You’ll find this on the UPI success screen after payment.
            </p>

            {paymentError && (
              <p className={styles.paymentError} role="alert">
                {paymentError}
              </p>
            )}

            <button type="submit" disabled={isSubmittingPayment || showSuccessModal}>
              <Send size={19} />
              {isSubmittingPayment ? 'Submitting...' : 'Submit transaction ID'}
            </button>
          </form>

          <div className={styles.needHelpCard}>
            <LifeBuoy size={21} />
            <div>
              <strong>Need help?</strong>
              <p>
                If money is debited or the ref ID is confusing, keep a screenshot.
                ActivBite will contact you if anything needs checking.
              </p>
              <a href="mailto:support@activbite.com">
                <Mail size={15} /> support@activbite.com
              </a>
            </div>
          </div>
        </aside>

        <aside className={styles.ticketCard} aria-label="Order ticket">
          <div className={styles.ticketHeader}>
            <div>
              <span>Breakfast ticket</span>
              <strong>{orderId}</strong>
            </div>
            <p>QR payment next</p>
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
            <span className={styles.ticketMeta}>{selectedPackMeta}</span>
            <p>Pack of {selectedPack.count} · {selectedPack.note}</p>

            <div className={styles.orderRows}>
              <div>
                <span>Name</span>
                <strong>{customerName}</strong>
              </div>
              <div>
                <span>Drop point</span>
                <strong>{cleanDeliveryLine}</strong>
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

      <section className={styles.paymentDock} data-nav-theme="light" aria-label="UPI payment instructions">
        <div className={styles.paymentIntro}>
          <div>
            <span>Payment step</span>
            <h2>Pay now, then paste the ref ID.</h2>
          </div>
          <p>
            Soft launch mode: pay the exact amount, submit the transaction/reference ID,
            and ActivBite will manually verify it. If anything looks off, the team will
            contact you.
          </p>
        </div>

        <div className={styles.paymentGrid}>
          <div className={styles.qrPanel}>
            <div className={styles.qrFrame}>
              {ACTIVBITE_PAYMENT_CONFIG.qrImage ? (
                <img src={ACTIVBITE_PAYMENT_CONFIG.qrImage} alt="ActivBite UPI QR code" />
              ) : (
                <div className={styles.dummyQr} aria-label="Temporary dummy UPI QR">
                  <i />
                  <i />
                  <i />
                  <span>DEMO</span>
                </div>
              )}
            </div>

            {isDummyPaymentConfig && (
              <p className={styles.dummyWarning}>
                Temporary dummy QR is active. Replace it with the real ActivBite bank QR
                before accepting live payments.
              </p>
            )}
          </div>

          <div className={styles.paymentDetails}>
            <div className={styles.amountCard}>
              <span>Pay exactly</span>
              <strong>{formatPrice(total)}</strong>
              <p>Order ID: {orderId}</p>
            </div>

            <div className={styles.upiCard}>
              <div>
                <span>UPI payee</span>
                <strong>{ACTIVBITE_PAYMENT_CONFIG.payeeName}</strong>
                <p>{ACTIVBITE_PAYMENT_CONFIG.upiId}</p>
              </div>
              <button type="button" onClick={handleCopyUpi}>
                <Copy size={17} />
                {hasCopiedUpi ? 'Copied' : 'Copy'}
              </button>
            </div>

            <a className={styles.upiButton} href={upiPaymentUri}>
              <QrCode size={20} />
              Open UPI app
              <ArrowRight size={20} />
            </a>

            <form className={styles.referenceForm} onSubmit={handlePaymentSubmit}>
              <label>
                Transaction / reference ID
                <input
                  value={paymentReference}
                  onChange={(event) => {
                    setPaymentReference(event.target.value);
                    setPaymentError('');
                    setPaymentSuccess('');
                  }}
                  placeholder="Eg: 4263XXXX9102 or UPI ref no."
                  autoComplete="off"
                />
              </label>

              {paymentError && (
                <p className={styles.paymentError} role="alert">
                  {paymentError}
                </p>
              )}
              {paymentSuccess && (
                <p className={styles.paymentSuccess} role="status">
                  {paymentSuccess}
                </p>
              )}

              <button type="submit" disabled={isSubmittingPayment || Boolean(paymentSuccess)}>
                <Send size={19} />
                {isSubmittingPayment ? 'Submitting...' : 'Submit payment ID'}
              </button>
            </form>

            <p className={styles.softNotice}>
              Need help, wrong pack, missing bar, damaged pack, or broken seal? Tell the
              delivery person immediately so ActivBite can sort it kindly and quickly.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.statusDock} data-nav-theme="light" aria-label="Order progress">
        <div className={styles.statusIntro}>
          <span>Campus tracker</span>
          <h2>What happens next?</h2>
        </div>

        <div className={styles.timeline}>
          <article>
            <CheckCircle2 size={23} />
            <span>01</span>
            <h3>Details saved</h3>
            <p>We save your delivery details for the campus drop.</p>
          </article>
          <article>
            <QrCode size={23} />
            <span>02</span>
            <h3>Pay by UPI</h3>
            <p>Scan the QR or open UPI, then pay the exact total.</p>
          </article>
          <article>
            <PackageCheck size={23} />
            <span>03</span>
            <h3>Ref ID checked</h3>
            <p>Our team checks the payment reference you submit.</p>
          </article>
          <article>
            <Truck size={23} />
            <span>04</span>
            <h3>Campus delivery</h3>
            <p>We deliver on campus. Report any issue when it arrives.</p>
          </article>
        </div>

        <div className={styles.nextActions}>
          <Link href="/faq">
            Read FAQ
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {showSuccessModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.successModal}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={38} />
            </div>
            <div className={styles.successProduct}>
              <Image
                src="/optimized/product-packaging.webp"
                alt="ActivBite Breakfast Bar"
                width={1600}
                height={887}
                sizes="(max-width: 700px) 78vw, 24rem"
                priority
              />
            </div>
            <span>Transaction ID received</span>
            <h2 className={styles.cheerHeadline}>Breakfast is in motion!</h2>
            <p className={styles.cheerText}>
              Ref ID received. ActivBite will verify it and contact you soon if
              anything is needed. Tiny breakfast party loading — taking you back
              to the landing page in a few seconds.
            </p>
            <h2>We’ll contact you soon.</h2>
            <p>
              ActivBite will verify your payment reference. If anything is needed,
              the team will reach out. Taking you back to the landing page now.
            </p>
            <Link href="/" className={styles.homeButton}>
              <Home size={18} />
              Return to landing page
            </Link>
          </div>
        </div>
      )}

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
