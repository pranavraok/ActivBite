export const ACTIVBITE_PAYMENT_CONFIG = {
  payeeName: process.env.NEXT_PUBLIC_ACTIVBITE_UPI_PAYEE_NAME || 'ActivBite',
  upiId: process.env.NEXT_PUBLIC_ACTIVBITE_UPI_ID || 'activbite-demo@upi',
  qrImage: process.env.NEXT_PUBLIC_ACTIVBITE_UPI_QR_IMAGE || '',
};

export const isDummyPaymentConfig =
  !process.env.NEXT_PUBLIC_ACTIVBITE_UPI_ID ||
  ACTIVBITE_PAYMENT_CONFIG.upiId.includes('demo');

export const buildUpiPaymentUri = ({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) => {
  const params = new URLSearchParams({
    pa: ACTIVBITE_PAYMENT_CONFIG.upiId,
    pn: ACTIVBITE_PAYMENT_CONFIG.payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: `ActivBite ${orderId}`,
  });

  return `upi://pay?${params.toString()}`;
};
