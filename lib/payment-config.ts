const DEFAULT_ACTIVBITE_PAYEE_NAME = 'ACTIVBITE';
const DEFAULT_ACTIVBITE_UPI_ID = 'acti9481345@barodampay';

export const ACTIVBITE_PAYMENT_CONFIG = {
  payeeName:
    process.env.NEXT_PUBLIC_ACTIVBITE_UPI_PAYEE_NAME || DEFAULT_ACTIVBITE_PAYEE_NAME,
  upiId: process.env.NEXT_PUBLIC_ACTIVBITE_UPI_ID || DEFAULT_ACTIVBITE_UPI_ID,
};

export const isDummyPaymentConfig =
  ACTIVBITE_PAYMENT_CONFIG.upiId.toLowerCase().includes('demo');

export const buildUpiPaymentUri = ({
  amount,
  orderId,
  note,
}: {
  amount: number;
  orderId: string;
  note?: string;
}) => {
  if (!Number.isFinite(amount) || amount <= 0 || !orderId.trim()) return '';

  const params = new URLSearchParams({
    pa: ACTIVBITE_PAYMENT_CONFIG.upiId,
    pn: ACTIVBITE_PAYMENT_CONFIG.payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tr: orderId,
    tn: (note || `ActivBite order ${orderId}`).trim().slice(0, 80),
  });

  return `upi://pay?${params.toString()}`;
};
