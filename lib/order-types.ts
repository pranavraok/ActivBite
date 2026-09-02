export const ORDER_STATUSES = [
  'awaiting_payment',
  'payment_verification',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  payment_verification: 'Payment verification',
  confirmed: 'Order confirmed',
  preparing: 'Packing breakfast',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  awaiting_payment: 'Order saved. Complete the UPI payment to move it forward.',
  payment_verification: 'Payment reference received. The ActivBite team is verifying it.',
  confirmed: 'Payment verified. Your ActivBite order is confirmed.',
  preparing: 'Your breakfast packs are being prepared for dispatch.',
  out_for_delivery: 'Your ActivBite order is on the way to the selected campus drop point.',
  delivered: 'Delivered. Enjoy an easier breakfast tomorrow morning.',
  cancelled: 'This order has been cancelled. Contact ActivBite support if you need help.',
};

export type PublicOrder = {
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

export type AdminOrderRecord = PublicOrder & {
  customerName: string;
  phone: string;
  email: string;
  hostelBlock: string;
  roomOrLandmark: string;
  paymentReference: string;
  source: string;
};

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === 'string' && ORDER_STATUSES.includes(value as OrderStatus);
