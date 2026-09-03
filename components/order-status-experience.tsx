'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import QRCode from 'qrcode';
import {
  ArrowRight, Check, CheckCircle2, Clipboard, Copy, CreditCard, Loader2, Mail,
  PackageCheck, PartyPopper, QrCode, Rocket, Search, Send, Soup, Sparkles, Sunrise, Truck,
} from 'lucide-react';
import {
  ACTIVBITE_PAYMENT_CONFIG,
  buildUpiPaymentUri,
  isDummyPaymentConfig,
} from '@/lib/payment-config';
import styles from './order-status-experience.module.css';
import PublicHeader from './public-header';

type OrderStatus =
  | 'awaiting_payment'
  | 'payment_verification'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

type PublicOrder = {
  trackingId: string;
  status: OrderStatus;
  statusMessage: string;
  packLabel: string;
  packCount: number;
  quantity: number;
  total: number;
  deliveryPoint: string;
  createdAt: string;
  updatedAt: string;
};

type StoredOrder = {
  orderId: string; paymentToken?: string; packCount: number; packLabel: string; packNote: string;
  quantity: number; total: number; customerName: string; phone: string;
  email: string; deliveryPoint: string; hostelBlock: string;
  roomOrLandmark: string; createdAt: string;
};

const PACKS = [
  { count: 5, price: 225, label: 'Mini Pack' },
  { count: 10, price: 420, label: 'Starter Pack' },
  { count: 20, price: 825, label: 'Routine Pack' },
  { count: 30, price: 1149, label: 'Power Pack' },
] as const;

const STATUS_FLOW: Array<{
  key: Exclude<OrderStatus, 'cancelled'>; label: string; short: string; icon: typeof Clipboard;
}> = [
  { key: 'awaiting_payment', label: 'Awaiting payment', short: 'Order saved', icon: Clipboard },
  { key: 'payment_verification', label: 'Payment verification', short: 'Payment check', icon: CreditCard },
  { key: 'confirmed', label: 'Order confirmed', short: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Packing breakfast', short: 'Packing', icon: PackageCheck },
  { key: 'out_for_delivery', label: 'Out for delivery', short: 'On the way', icon: Truck },
  { key: 'delivered', label: 'Delivered', short: 'Delivered', icon: Check },
];

const TRACKING_ID_PATTERN = /^AB[A-HJ-NP-Z2-9]{6}$/;
const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(price);
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Just now'
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function OrderStatusExperience() {
  const searchParams = useSearchParams();
  const checkoutOrderId = (searchParams.get('order') || '').trim().toUpperCase();
  const trackParam = (searchParams.get('track') || '').trim().toUpperCase();
  const isPaymentMode = Boolean(checkoutOrderId);
  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<PublicOrder | null>(null);
  const [paymentOrderError, setPaymentOrderError] = useState('');
  const [isLoadingPaymentOrder, setIsLoadingPaymentOrder] = useState(isPaymentMode);
  const [paymentQrDataUrl, setPaymentQrDataUrl] = useState('');
  const [paymentQrError, setPaymentQrError] = useState('');
  const [copiedValue, setCopiedValue] = useState<'tracking' | 'upi' | null>(null);
  const [trackingId, setTrackingId] = useState(trackParam);
  const [trackedOrder, setTrackedOrder] = useState<PublicOrder | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isPaymentMode) return;
    const rawOrder = window.sessionStorage.getItem('activbite:lastOrder');
    if (!rawOrder) return;
    try { setStoredOrder(JSON.parse(rawOrder) as StoredOrder); }
    catch { setStoredOrder(null); }
  }, [isPaymentMode]);

  useEffect(() => {
    if (!isPaymentMode) return;
    if (!TRACKING_ID_PATTERN.test(checkoutOrderId)) {
      setPaymentOrderError('This order ID is incomplete. Please return to Shop and try again.');
      setIsLoadingPaymentOrder(false);
      return;
    }

    let cancelled = false;
    setIsLoadingPaymentOrder(true);
    setPaymentOrderError('');

    fetch(`/api/orders/${encodeURIComponent(checkoutOrderId)}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.order) {
          throw new Error(data.message || 'Could not confirm the saved order amount.');
        }
        if (!cancelled) setPaymentOrder(data.order as PublicOrder);
      })
      .catch((error) => {
        if (!cancelled) {
          setPaymentOrder(null);
          setPaymentOrderError(
            error instanceof Error ? error.message : 'Could not confirm the saved order amount.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPaymentOrder(false);
      });

    return () => { cancelled = true; };
  }, [checkoutOrderId, isPaymentMode]);

  const copyValue = async (value: string, kind: 'tracking' | 'upi') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(kind);
      window.setTimeout(() => setCopiedValue(null), 1600);
    } catch {
      if (kind === 'upi') setPaymentError('Could not copy the UPI ID. Please type it manually.');
    }
  };

  const lookupOrder = useCallback(async (value: string) => {
    const cleanedId = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    setTrackingId(cleanedId);
    setTrackedOrder(null);
    setTrackingError('');
    if (!TRACKING_ID_PATTERN.test(cleanedId)) {
      setTrackingError('Enter the complete 8-character ID, for example AB7K2P9.');
      return;
    }
    setIsTracking(true);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(cleanedId)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.order) throw new Error(data.message || 'We could not find that tracking ID.');
      setTrackedOrder(data.order as PublicOrder);
    } catch (error) {
      setTrackingError(error instanceof Error ? error.message : 'Could not load the order status right now.');
    } finally { setIsTracking(false); }
  }, []);

  useEffect(() => {
    if (!isPaymentMode && TRACKING_ID_PATTERN.test(trackParam)) void lookupOrder(trackParam);
  }, [isPaymentMode, lookupOrder, trackParam]);

  const storedPaymentOrder =
    storedOrder?.orderId === checkoutOrderId && storedOrder.total > 0
      ? storedOrder
      : null;
  const confirmedPaymentOrder = paymentOrder || storedPaymentOrder;
  const selectedPack = useMemo(() => {
    const packCount = confirmedPaymentOrder?.packCount || 30;
    return PACKS.find((pack) => pack.count === packCount) || PACKS[3];
  }, [confirmedPaymentOrder]);
  const quantity = confirmedPaymentOrder?.quantity || 1;
  const displayPackLabel = confirmedPaymentOrder?.packLabel || selectedPack.label;
  const total = confirmedPaymentOrder?.total || 0;
  const customerName = searchParams.get('name') || storedOrder?.customerName || 'Breakfast legend';
  const deliveryPoint = storedOrder
    ? [storedOrder.deliveryPoint, storedOrder.hostelBlock, storedOrder.roomOrLandmark].filter(Boolean).join(' · ')
    : `${searchParams.get('point') || 'NITK campus'} · NITK`;
  const upiPaymentUri = useMemo(
    () => buildUpiPaymentUri({
      amount: total,
      orderId: checkoutOrderId,
      note: `ActivBite ${checkoutOrderId} - ${displayPackLabel}`,
    }),
    [checkoutOrderId, displayPackLabel, total]
  );

  useEffect(() => {
    if (!upiPaymentUri) {
      setPaymentQrDataUrl('');
      setPaymentQrError('');
      return;
    }

    let cancelled = false;
    setPaymentQrDataUrl('');
    setPaymentQrError('');

    QRCode.toDataURL(upiPaymentUri, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 420,
      color: { dark: '#2c180e', light: '#ffffff' },
    })
      .then((dataUrl) => { if (!cancelled) setPaymentQrDataUrl(dataUrl); })
      .catch(() => {
        if (!cancelled) setPaymentQrError('Could not prepare the payment QR. Use the UPI app button instead.');
      });

    return () => { cancelled = true; };
  }, [upiPaymentUri]);

  const handlePaymentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedReference = paymentReference.trim();
    if (cleanedReference.length < 6) {
      setPaymentError('Please enter the UPI transaction/reference ID.');
      return;
    }
    if (!confirmedPaymentOrder || total <= 0) {
      setPaymentError('The saved order amount is still being confirmed. Please try again in a moment.');
      return;
    }
    setIsSubmittingPayment(true);
    setPaymentError('');
    try {
      const response = await fetch('/api/payment-confirmation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: checkoutOrderId,
          paymentToken: storedPaymentOrder?.paymentToken || '',
          paymentReference: cleanedReference, customerName,
          phone: storedOrder?.phone || '', email: storedOrder?.email || '',
          deliveryPoint: storedOrder?.deliveryPoint || searchParams.get('point') || 'NITK campus',
          hostelBlock: storedOrder?.hostelBlock || '', roomOrLandmark: storedOrder?.roomOrLandmark || '',
          packLabel: confirmedPaymentOrder.packLabel,
          packCount: confirmedPaymentOrder.packCount,
          quantity: confirmedPaymentOrder.quantity,
          total: confirmedPaymentOrder.total,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not submit the payment reference.');
      setPaymentSuccess('Payment reference received. Your status is now Payment verification.');
      window.sessionStorage.setItem('activbite:lastPayment', JSON.stringify({
        orderId: checkoutOrderId, paymentReference: cleanedReference,
        paymentStatus: 'payment_verification', createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not submit the payment reference.');
    } finally { setIsSubmittingPayment(false); }
  };

  const activeStatusIndex = trackedOrder
    ? STATUS_FLOW.findIndex((step) => step.key === trackedOrder.status)
    : -1;

  return (
    <main className={styles.statusPage} data-brand-page="order-status">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <PublicHeader />

      {isPaymentMode ? (
        <section className={styles.statusLayout} data-nav-theme="dark">
          <div className={styles.orderCopy}>
            <p className={styles.microText}>Order saved</p>
            <h1>Keep this code.<span>Track every step.</span></h1>
            <p className={styles.lead}>
              {customerName.split(' ')[0]}, your breakfast order is saved. Keep this short ID—you can use it anytime from Track Order.
            </p>
            <div className={styles.trackingTicket}>
              <span>Your tracking ID</span><strong>{checkoutOrderId}</strong>
              <button type="button" onClick={() => copyValue(checkoutOrderId, 'tracking')}>
                {copiedValue === 'tracking' ? <Check size={18} /> : <Copy size={18} />}
                {copiedValue === 'tracking' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className={styles.orderFacts}>
              <div><span>Your stack</span><strong>{displayPackLabel}</strong></div>
              <div><span>Total</span><strong>{confirmedPaymentOrder ? formatPrice(total) : 'Checking…'}</strong></div>
              <div><span>Drop point</span><strong>{deliveryPoint}</strong></div>
            </div>
            <Link className={styles.trackShortcut} href={`/order-status?track=${checkoutOrderId}`}>
              <Search size={18} /> Track this order
            </Link>
          </div>

          <aside className={styles.paymentCard} aria-label="Complete UPI payment">
            <div className={styles.paymentCardHeader}>
              <div><span>Payment step</span><h2>Pay, then paste the ID.</h2></div>
              <strong>{confirmedPaymentOrder ? formatPrice(total) : 'Checking…'}</strong>
            </div>
            {paymentOrderError && !confirmedPaymentOrder && (
              <p className={styles.paymentLoadError} role="alert">{paymentOrderError}</p>
            )}
            <div className={styles.paymentBody}>
              <div className={styles.qrBox}>
                {paymentQrDataUrl && confirmedPaymentOrder ? (
                  <Image
                    src={paymentQrDataUrl}
                    alt={`Pay ${formatPrice(total)} to ActivBite using UPI`}
                    width={420}
                    height={420}
                    unoptimized
                  />
                ) : paymentQrError ? (
                  <div className={styles.qrError}><QrCode size={30} /><span>QR unavailable</span></div>
                ) : (
                  <div className={styles.qrLoading} aria-label="Preparing exact-amount UPI QR">
                    <Loader2 className={styles.spinner} size={30} />
                    <span>{isLoadingPaymentOrder ? 'Checking order' : 'Preparing QR'}</span>
                  </div>
                )}
              </div>
              <div className={styles.payDetails}>
                <span>Bank of Baroda merchant</span><strong>{ACTIVBITE_PAYMENT_CONFIG.payeeName}</strong>
                <p>{ACTIVBITE_PAYMENT_CONFIG.upiId}</p>
                <button type="button" onClick={() => copyValue(ACTIVBITE_PAYMENT_CONFIG.upiId, 'upi')}>
                  <Copy size={16} /> {copiedValue === 'upi' ? 'Copied' : 'Copy UPI ID'}
                </button>
              </div>
            </div>
            {confirmedPaymentOrder && (
              <div className={styles.exactAmountNotice}>
                <CheckCircle2 size={19} />
                <div><strong>{formatPrice(total)} is locked to this order.</strong>
                  <span>The QR and UPI app will both show the exact amount.</span></div>
              </div>
            )}
            {paymentQrError && <p className={styles.formError} role="alert">{paymentQrError}</p>}
            {isDummyPaymentConfig && <p className={styles.demoNotice}>Demo payment details are active locally.</p>}
            {upiPaymentUri ? (
              <a className={styles.upiButton} href={upiPaymentUri}>
                <QrCode size={19} /> Open in UPI app · {formatPrice(total)}
              </a>
            ) : (
              <span className={`${styles.upiButton} ${styles.upiButtonDisabled}`} aria-disabled="true">
                <Loader2 className={styles.spinner} size={19} /> Confirming order amount…
              </span>
            )}
            <p className={styles.upiHelp}>On desktop, scan the QR with your phone. On mobile, tap the button above.</p>
            <form className={styles.referenceForm} onSubmit={handlePaymentSubmit}>
              <label>Transaction / reference ID
                <input value={paymentReference} onChange={(event) => {
                  setPaymentReference(event.target.value); setPaymentError('');
                }} placeholder="Paste the UPI reference number" autoComplete="off" />
              </label>
              {paymentError && <p className={styles.formError} role="alert">{paymentError}</p>}
              <button type="submit" disabled={
                isSubmittingPayment || Boolean(paymentSuccess) || !confirmedPaymentOrder
              }>
                {isSubmittingPayment ? <Loader2 className={styles.spinner} size={19} /> : <Send size={19} />}
                {isSubmittingPayment ? 'Saving payment...' : 'Submit payment ID'}
              </button>
            </form>
          </aside>
        </section>
      ) : (
        <section className={styles.statusLayout} data-nav-theme="dark">
          <div className={styles.orderCopy}>
            <p className={styles.microText}>Track ActivBite</p>
            <h1>Track breakfast.<span>Stay in the loop.</span></h1>
            <p className={styles.lead}>
              Enter the short tracking ID shown after checkout to see the latest payment and campus-delivery status.
            </p>
            <div className={styles.trackingHints}>
              <span><Clipboard size={19} /> Find your 8-character ID</span>
              <span><Search size={19} /> Enter it once</span>
              <span><Truck size={19} /> See the latest stage</span>
            </div>
          </div>

          <section className={styles.trackerCard} aria-labelledby="tracker-heading">
            <div className={styles.trackerHeading}>
              <span>Campus order tracker</span><h2 id="tracker-heading">Where’s my breakfast?</h2>
              <p>Your ID begins with AB and contains eight characters.</p>
            </div>
            <form className={styles.trackingForm} onSubmit={(event) => {
              event.preventDefault(); void lookupOrder(trackingId);
            }}>
              <label htmlFor="tracking-id">Tracking ID</label>
              <div>
                <input id="tracking-id" value={trackingId} onChange={(event) => {
                  setTrackingId(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
                  setTrackingError(''); setTrackedOrder(null);
                }} placeholder="AB7K2P9" autoCapitalize="characters" autoComplete="off"
                spellCheck={false} maxLength={8} />
                <button type="submit" disabled={isTracking}>
                  {isTracking ? <Loader2 className={styles.spinner} size={19} /> : <Search size={19} />}
                  {isTracking ? 'Checking...' : 'Show status'}
                </button>
              </div>
            </form>
            {trackingError && <p className={styles.trackingError} role="alert">{trackingError}</p>}
            {trackedOrder && (
              <div className={styles.statusResult} aria-live="polite">
                <div className={styles.currentStatus}>
                  <span>Current status</span>
                  <strong>{trackedOrder.status === 'cancelled' ? 'Order cancelled' :
                    STATUS_FLOW.find((step) => step.key === trackedOrder.status)?.label || 'Order updated'}</strong>
                  <p>{trackedOrder.statusMessage}</p>
                </div>
                {trackedOrder.status !== 'cancelled' && (
                  <ol className={styles.statusTimeline}>
                    {STATUS_FLOW.map(({ key, short, icon: Icon }, index) => (
                      <li key={key} className={index <= activeStatusIndex ? styles.stepComplete : undefined}
                        aria-current={index === activeStatusIndex ? 'step' : undefined}>
                        <i>{index < activeStatusIndex ? <Check size={15} /> : <Icon size={15} />}</i><span>{short}</span>
                      </li>
                    ))}
                  </ol>
                )}
                <div className={styles.trackedFacts}>
                  <div><span>Tracking ID</span><strong>{trackedOrder.trackingId}</strong></div>
                  <div><span>Pack</span><strong>{trackedOrder.packLabel} × {trackedOrder.quantity}</strong></div>
                  <div><span>Drop point</span><strong>{trackedOrder.deliveryPoint}</strong></div>
                  <div><span>Updated</span><strong>{formatDate(trackedOrder.updatedAt)}</strong></div>
                </div>
              </div>
            )}
            <div className={styles.trackerHelp}><Mail size={18} />
              <span>Need help? <a href="mailto:support@activbite.com">support@activbite.com</a></span>
            </div>
          </section>
        </section>
      )}

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span><Sunrise size={31} /> ONE BAR.</span><span><Soup size={31} /> REAL BREAKFAST.</span>
        <span><Rocket size={31} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>

      {paymentSuccess && (
        <div className={styles.paymentConfirmationOverlay} role="presentation">
          <section className={styles.paymentConfirmationCard} role="dialog" aria-modal="true"
            aria-labelledby="payment-confirmation-title" aria-describedby="payment-confirmation-copy">
            <Sparkles className={styles.confirmationSparkleLeft} size={28} aria-hidden="true" />
            <Sparkles className={styles.confirmationSparkleRight} size={22} aria-hidden="true" />
            <div className={styles.confirmationIcon} aria-hidden="true">
              <PartyPopper size={36} />
            </div>
            <p className={styles.confirmationEyebrow}>Payment ID received</p>
            <h2 id="payment-confirmation-title">Order confirmed!</h2>
            <p id="payment-confirmation-copy" className={styles.confirmationCopy}>
              Your order is safely recorded. We&apos;ll verify the payment and keep every update ready on the tracking page.
            </p>
            <div className={styles.confirmationTrackId}>
              <span>Your tracking ID</span>
              <strong>{checkoutOrderId}</strong>
            </div>
            <Link className={styles.confirmationTrackButton}
              href={`/order-status?track=${encodeURIComponent(checkoutOrderId)}`}>
              Track my order <ArrowRight size={20} />
            </Link>
            <p className={styles.confirmationFootnote}>Keep this ID handy for future updates.</p>
          </section>
        </div>
      )}
    </main>
  );
}
