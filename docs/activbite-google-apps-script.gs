const SPREADSHEET_ID = '1rsdFZdNhwvUNuhoXT4zBOOVvqA4Qy8oqCySCNXIMXVo';
const WHOLESALE_SHEET = 'Wholesale Enquiries';
const WAITLIST_SHEET = 'ActivBite_Waitlist';
const CONTACT_SHEET = 'Contact Enquiries';
const ORDERS_SHEET = 'Orders';
const INVENTORY_SHEET = 'Inventory';
const INVENTORY_MOVEMENTS_SHEET = 'Inventory Movements';
const REPORTS_SHEET = 'Reports';
const MANAGEMENT_SPREADSHEET_ID = '1LWCfQAnhINz48MmN9SgWv5HLK03RHA_hFltrQS-p6kw';

const MANAGEMENT_DEFINITIONS = {
  products: { title: 'Products', sheetName: 'Products', headerRow: 3, editable: true, idHeader: 'Product ID', idPrefix: 'SKU-' },
  raw_material_inventory: { title: 'Raw Material Inventory', sheetName: 'Raw Material Inventory', headerRow: 1, editable: false },
  purchases: { title: 'Purchases', sheetName: 'Purchases', headerRow: 1, editable: true, idHeader: 'Purchase ID', idPrefix: 'PUR' },
  sales: { title: 'Sales', sheetName: 'Sales', headerRow: 1, editable: true, idHeader: 'Invoice Number', idPrefix: 'INV' },
  customers: { title: 'Customers', sheetName: 'Customers', headerRow: 3, editable: true, idHeader: 'Customer ID', idPrefix: 'CUST' },
  suppliers: { title: 'Suppliers', sheetName: 'Suppliers', headerRow: 1, editable: true, idHeader: 'Supplier ID', idPrefix: 'SUP' },
  payments_received: { title: 'Payments Received', sheetName: 'Payments Received', headerRow: 1, editable: true, idHeader: 'Payment ID', idPrefix: 'PR' },
  payments_made: { title: 'Payments Made', sheetName: 'Payments Made', headerRow: 1, editable: true, idHeader: 'Payment ID', idPrefix: 'PM' },
  expenses: { title: 'Expenses', sheetName: 'Expenses', headerRow: 1, editable: true, idHeader: 'Expense ID', idPrefix: 'EX' },
  finished_goods_inventory: { title: 'Finished Goods Inventory', sheetName: 'Finished Goods Inventory', headerRow: 1, editable: false },
  production_batches: { title: 'Production Batches', sheetName: 'Production Batches', headerRow: 1, editable: true, idHeader: 'Batch Number', idPrefix: 'BATCH' },
  batch_traceability: { title: 'Batch Traceability', sheetName: 'Batch Traceability', headerRow: 1, editable: true },
};

const WHOLESALE_HEADERS = [
  'Submission ID',
  'Received At',
  'Shop Name',
  'Contact Name',
  'Phone',
  'Email',
  'Shop Type',
  'Location',
  'Monthly Requirement',
  'Preferred Pack',
  'Message',
  'Source',
];

const CONTACT_HEADERS = [
  'Submission ID',
  'Received At',
  'Name',
  'Phone',
  'Email',
  'Location',
  'Topic',
  'Message',
  'Source',
];

const ORDER_HEADERS = [
  'Tracking ID',
  'Created At',
  'Updated At',
  'Status',
  'Status Message',
  'Customer Name',
  'Phone',
  'Email',
  'Delivery Point',
  'Hostel / Area',
  'Room / Landmark',
  'Pack',
  'Pack Count',
  'Quantity',
  'Total',
  'Payment Reference',
  'Source',
];

const INVENTORY_HEADERS = [
  'SKU', 'Pack Label', 'Bars per Pack', 'Units Remaining', 'Low Stock At',
  'Status', 'Updated At', 'Updated By', 'Notes'
];

const INVENTORY_MOVEMENT_HEADERS = [
  'Movement ID', 'Created At', 'Tracking ID', 'SKU', 'Pack Label',
  'Change', 'Reason', 'Previous Stock', 'New Stock', 'Admin / Source'
];

const REPORT_HEADERS = [
  'Report ID', 'Uploaded At', 'Report Name', 'Category', 'Report Date',
  'File Name', 'File URL', 'File ID', 'Notes', 'Uploaded By'
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (payload.type === 'wholesale_enquiry') return saveWholesaleEnquiry_(payload);
    if (payload.type === 'contact_enquiry') return saveContactEnquiry_(payload);
    if (payload.type === 'order_created') return saveOrder_(payload);
    if (payload.type === 'upi_payment_confirmation') return savePaymentConfirmation_(payload);
    if (payload.type === 'admin_update_order') return updateOrderStatus_(payload);
    if (payload.type === 'admin_update_inventory') return updateInventory_(payload);
    if (payload.type === 'admin_upload_report') return saveReport_(payload);
    if (payload.type === 'admin_delete_report') return deleteReport_(payload);
    if (payload.type === 'admin_add_management_record') return addManagementRecord_(payload);
    if (payload.type === 'admin_update_management_record') return updateManagementRecord_(payload);

    return saveWaitlistEntry_(payload);
  } catch (error) {
    return json_({ ok: false, message: error.message || 'Could not save submission.' });
  }
}

function doGet(e) {
  try {
    const action = e && e.parameter.action;
    if (action === 'track_order') return readTrackedOrder_(e.parameter.trackingId);
    if (action === 'inventory') return readInventory_();

    if (
      action !== 'wholesale_enquiries' &&
      action !== 'waitlist_entries' &&
      action !== 'contact_enquiries' &&
      action !== 'orders' &&
      action !== 'reports' &&
      action !== 'management_data'
    ) {
      return json_({ ok: false, message: 'Unknown request.' });
    }

    const expectedSecret = PropertiesService.getScriptProperties()
      .getProperty('WHOLESALE_ADMIN_READ_SECRET');

    if (!expectedSecret || e.parameter.secret !== expectedSecret) {
      return json_({ ok: false, message: 'Unauthorized.' });
    }

    if (action === 'waitlist_entries') return readWaitlistEntries_();
    if (action === 'contact_enquiries') return readContactEnquiries_();
    if (action === 'orders') return readOrders_();
    if (action === 'reports') return readReports_();
    if (action === 'management_data') return readManagementData_();

    return readWholesaleEnquiries_();
  } catch (error) {
    return json_({ ok: false, message: error.message || 'Could not load submissions.' });
  }
}

function readWholesaleEnquiries_() {
    const sheet = getSheet_(WHOLESALE_SHEET, WHOLESALE_HEADERS);
    const values = sheet.getDataRange().getDisplayValues();
    const rows = values.slice(1).filter((row) => row.some(String));

    const enquiries = rows.map((row) => ({
      id: row[0] || '',
      createdAt: row[1] || '',
      shopName: row[2] || '',
      contactName: row[3] || '',
      phone: row[4] || '',
      email: row[5] || '',
      shopType: row[6] || '',
      location: row[7] || '',
      monthlyRequirement: row[8] || '',
      preferredPack: row[9] || '',
      message: row[10] || '',
      source: row[11] || '',
    }));

    enquiries.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json_({ ok: true, enquiries: enquiries });
}

function readWaitlistEntries_() {
  const sheet = getSheet_(WAITLIST_SHEET, ['email', 'source', 'createdAt']);
  const values = sheet.getDataRange().getDisplayValues();
  const rows = values.slice(1).filter((row) => row.some(String));

  const entries = rows.map((row, index) => ({
    id: 'waitlist-' + (index + 2),
    email: row[0] || '',
    source: row[1] || '',
    createdAt: row[2] || '',
  }));

  entries.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return json_({ ok: true, entries: entries });
}

function readContactEnquiries_() {
  const sheet = getSheet_(CONTACT_SHEET, CONTACT_HEADERS);
  const values = sheet.getDataRange().getDisplayValues();
  const rows = values.slice(1).filter((row) => row.some(String));

  const enquiries = rows.map((row) => ({
    id: row[0] || '',
    createdAt: row[1] || '',
    fullName: row[2] || '',
    phone: row[3] || '',
    email: row[4] || '',
    location: row[5] || '',
    topic: row[6] || '',
    message: row[7] || '',
    source: row[8] || '',
  }));

  enquiries.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return json_({ ok: true, enquiries: enquiries });
}

function saveWholesaleEnquiry_(payload) {
  const id = clean_(payload.submissionId) || Utilities.getUuid();
  const sheet = getSheet_(WHOLESALE_SHEET, WHOLESALE_HEADERS);
  sheet.appendRow([
    safeCell_(id),
    safeCell_(payload.createdAt || new Date().toISOString()),
    safeCell_(payload.shopName),
    safeCell_(payload.contactName),
    safeCell_(payload.phone),
    safeCell_(payload.email),
    safeCell_(payload.shopType),
    safeCell_(payload.location),
    safeCell_(payload.monthlyRequirement),
    safeCell_(payload.preferredPack),
    safeCell_(payload.message),
    safeCell_(payload.source || 'ActivBite wholesale page'),
  ]);
  return json_({ ok: true, id: id });
}

function saveWaitlistEntry_(payload) {
  if (!clean_(payload.email)) throw new Error('Email is required.');
  const sheet = getSheet_(WAITLIST_SHEET, ['email', 'source', 'createdAt']);
  sheet.appendRow([
    safeCell_(payload.email),
    safeCell_(payload.source || 'ActivBite coming soon page'),
    safeCell_(payload.createdAt || new Date().toISOString()),
  ]);
  return json_({ ok: true });
}

function saveContactEnquiry_(payload) {
  const id = clean_(payload.submissionId) || Utilities.getUuid();
  const sheet = getSheet_(CONTACT_SHEET, CONTACT_HEADERS);
  sheet.appendRow([
    safeCell_(id),
    safeCell_(payload.createdAt || new Date().toISOString()),
    safeCell_(payload.fullName),
    safeCell_(payload.phone),
    safeCell_(payload.email),
    safeCell_(payload.location),
    safeCell_(payload.topic),
    safeCell_(payload.message),
    safeCell_(payload.source || 'ActivBite contact page'),
  ]);
  return json_({ ok: true, id: id });
}

function saveOrder_(payload) {
  const trackingId = clean_(payload.trackingId).toUpperCase();
  if (!trackingId) throw new Error('Tracking ID is required.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_(ORDERS_SHEET, ORDER_HEADERS);
    // Network retries must be safe. If the first request saved the order but its
    // response was interrupted, return the same order instead of appending twice.
    if (findOrderRow_(sheet, trackingId)) {
      return json_({ ok: true, id: trackingId, duplicate: true });
    }

    if (!hasInventory_(Number(payload.packCount), Number(payload.quantity) || 1)) {
      throw new Error('This pack is currently out of stock. Please choose another pack.');
    }

    const createdAt = payload.createdAt || new Date().toISOString();
    sheet.appendRow([
      safeCell_(trackingId),
      safeCell_(createdAt),
      safeCell_(createdAt),
      'awaiting_payment',
      'Order saved. Complete the UPI payment to move it forward.',
      safeCell_(payload.customerName),
      safeCell_(payload.phone),
      safeCell_(payload.email),
      safeCell_(payload.deliveryPoint),
      safeCell_(payload.hostelBlock),
      safeCell_(payload.roomOrLandmark),
      safeCell_(payload.packLabel),
      Number(payload.packCount) || 0,
      Number(payload.quantity) || 1,
      Number(payload.total) || 0,
      '',
      safeCell_(payload.source || 'ActivBite checkout'),
    ]);

    return json_({ ok: true, id: trackingId });
  } finally {
    lock.releaseLock();
  }
}

function readTrackedOrder_(trackingIdValue) {
  const trackingId = clean_(trackingIdValue).toUpperCase();
  if (!trackingId) return json_({ ok: false, message: 'Tracking ID is required.' });

  const sheet = getSheet_(ORDERS_SHEET, ORDER_HEADERS);
  const rowNumber = findOrderRow_(sheet, trackingId);
  if (!rowNumber) return json_({ ok: false, message: 'Order not found.' });

  const row = sheet.getRange(rowNumber, 1, 1, ORDER_HEADERS.length).getValues()[0];
  return json_({
    ok: true,
    order: {
      trackingId: row[0] || '',
      createdAt: row[1] || '',
      updatedAt: row[2] || '',
      status: row[3] || 'awaiting_payment',
      statusMessage: row[4] || '',
      deliveryPoint: row[8] || '',
      packLabel: row[11] || '',
      packCount: Number(row[12]) || 0,
      quantity: Number(row[13]) || 1,
      total: Number(row[14]) || 0,
    },
  });
}

function readOrders_() {
  const sheet = getSheet_(ORDERS_SHEET, ORDER_HEADERS);
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter((row) => row.some(String));
  const orders = rows.map((row) => ({
    trackingId: row[0] || '',
    createdAt: row[1] || '',
    updatedAt: row[2] || '',
    status: row[3] || 'awaiting_payment',
    statusMessage: row[4] || '',
    customerName: row[5] || '',
    phone: row[6] || '',
    email: row[7] || '',
    deliveryPoint: row[8] || '',
    hostelBlock: row[9] || '',
    roomOrLandmark: row[10] || '',
    packLabel: row[11] || '',
    packCount: Number(row[12]) || 0,
    quantity: Number(row[13]) || 1,
    total: Number(row[14]) || 0,
    paymentReference: row[15] || '',
    source: row[16] || '',
  }));

  orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return json_({ ok: true, orders: orders });
}

function findOrderRow_(sheet, trackingId) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(trackingId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function updateOrderStatus_(payload) {
  const expectedSecret = PropertiesService.getScriptProperties()
    .getProperty('WHOLESALE_ADMIN_READ_SECRET');
  if (!expectedSecret || clean_(payload.secret) !== expectedSecret) {
    throw new Error('Unauthorized.');
  }

  const trackingId = clean_(payload.trackingId).toUpperCase();
  const status = clean_(payload.status);
  const allowedStatuses = [
    'awaiting_payment', 'payment_verification', 'confirmed', 'preparing',
    'out_for_delivery', 'delivered', 'cancelled'
  ];
  if (!trackingId || allowedStatuses.indexOf(status) === -1) {
    throw new Error('Invalid order update.');
  }

  const sheet = getSheet_(ORDERS_SHEET, ORDER_HEADERS);
  const rowNumber = findOrderRow_(sheet, trackingId);
  if (!rowNumber) throw new Error('Order not found.');
  const orderRow = sheet.getRange(rowNumber, 1, 1, ORDER_HEADERS.length).getValues()[0];

  const now = payload.updatedAt || new Date().toISOString();
  const message = clean_(payload.statusMessage) || statusMessageFor_(status);
  sheet.getRange(rowNumber, 3, 1, 3).setValues([[
    safeCell_(now),
    status,
    safeCell_(message),
  ]]);

  if (status === 'confirmed') {
    adjustInventoryForOrder_(trackingId, Number(orderRow[12]), Number(orderRow[13]), 'Order confirmed — stock deducted');
    syncOrderToManagement_(trackingId, orderRow);
  } else if (status === 'cancelled') {
    adjustInventoryForOrder_(trackingId, Number(orderRow[12]), Number(orderRow[13]), 'Order cancelled — stock restored');
  }

  return json_({ ok: true, id: trackingId });
}

function statusMessageFor_(status) {
  const messages = {
    awaiting_payment: 'Order saved. Complete the UPI payment to move it forward.',
    payment_verification: 'Payment reference received. The ActivBite team is verifying it.',
    confirmed: 'Payment verified. Your ActivBite order is confirmed.',
    preparing: 'Your breakfast packs are being prepared for dispatch.',
    out_for_delivery: 'Your ActivBite order is on the way to the selected campus drop point.',
    delivered: 'Delivered. Enjoy an easier breakfast tomorrow morning.',
    cancelled: 'This order has been cancelled. Contact ActivBite support if you need help.',
  };
  return messages[status] || 'Your order status has been updated.';
}

function updateOrderPayment_(payload) {
  const trackingId = clean_(payload.orderId).toUpperCase();
  if (!trackingId) return;

  const sheet = getSheet_(ORDERS_SHEET, ORDER_HEADERS);
  let rowNumber = findOrderRow_(sheet, trackingId);
  const now = payload.createdAt || new Date().toISOString();

  if (!rowNumber) {
    sheet.appendRow([
      safeCell_(trackingId),
      safeCell_(now),
      safeCell_(now),
      'payment_verification',
      'Payment reference received. The ActivBite team is verifying it.',
      safeCell_(payload.customerName),
      safeCell_(payload.phone),
      safeCell_(payload.email),
      safeCell_(payload.deliveryPoint),
      safeCell_(payload.hostelBlock),
      safeCell_(payload.roomOrLandmark),
      safeCell_(payload.packLabel),
      Number(payload.packCount) || 0,
      Number(payload.quantity) || 1,
      Number(payload.total) || 0,
      safeCell_(payload.paymentReference),
      safeCell_(payload.source || 'ActivBite payment page'),
    ]);
    return;
  }

  sheet.getRange(rowNumber, 3, 1, 3).setValues([[
    safeCell_(now),
    'payment_verification',
    'Payment reference received. The ActivBite team is verifying it.',
  ]]);
  sheet.getRange(rowNumber, 16).setValue(safeCell_(payload.paymentReference));
}

function savePaymentConfirmation_(payload) {
  const headers = [
    'Received At', 'Order ID', 'Payment Reference', 'Status', 'Customer Name',
    'Phone', 'Email', 'Delivery Point', 'Hostel Block', 'Room or Landmark',
    'Pack', 'Pack Count', 'Quantity', 'Total', 'Source'
  ];
  const sheet = getSheet_('Payment Confirmations', headers);
  sheet.appendRow([
    safeCell_(payload.createdAt || new Date().toISOString()),
    safeCell_(payload.orderId),
    safeCell_(payload.paymentReference),
    safeCell_(payload.paymentStatus),
    safeCell_(payload.customerName),
    safeCell_(payload.phone),
    safeCell_(payload.email),
    safeCell_(payload.deliveryPoint),
    safeCell_(payload.hostelBlock),
    safeCell_(payload.roomOrLandmark),
    safeCell_(payload.packLabel),
    Number(payload.packCount) || 0,
    Number(payload.quantity) || 0,
    Number(payload.total) || 0,
    safeCell_(payload.source || 'ActivBite order-status page'),
  ]);
  updateOrderPayment_(payload);
  return json_({ ok: true });
}

function requireAdmin_(secret) {
  const expectedSecret = PropertiesService.getScriptProperties()
    .getProperty('WHOLESALE_ADMIN_READ_SECRET');
  if (!expectedSecret || clean_(secret) !== expectedSecret) throw new Error('Unauthorized.');
}

function seedInventory_() {
  const sheet = getSheet_(INVENTORY_SHEET, INVENTORY_HEADERS);
  const existing = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues().flat()
    : [];
  const packs = [
    ['AB-PACK-05', 'Mini Pack', 5],
    ['AB-PACK-10', 'Starter Pack', 10],
    ['AB-PACK-20', 'Routine Pack', 20],
    ['AB-PACK-30', 'Power Pack', 30],
  ];
  packs.forEach(function (pack) {
    if (existing.indexOf(pack[0]) === -1) {
      sheet.appendRow([pack[0], pack[1], pack[2], '', 5, 'Not set', '', '',
        'Enter the real opening stock in the admin portal.']);
    }
  });
  return sheet;
}

function inventoryStatus_(stock, threshold) {
  if (stock === '' || stock === null || stock === undefined) return 'Not set';
  const quantity = Math.max(0, Number(stock) || 0);
  if (quantity === 0) return 'Out of stock';
  if (quantity <= (Number(threshold) || 0)) return 'Low stock';
  return 'In stock';
}

function inventoryRecord_(row) {
  const rawStock = row[3];
  const stock = rawStock === '' || rawStock === null ? null : Math.max(0, Number(rawStock) || 0);
  const threshold = Math.max(0, Number(row[4]) || 0);
  const statusLabel = inventoryStatus_(stock, threshold);
  const statusMap = {
    'Not set': 'not_set', 'In stock': 'in_stock',
    'Low stock': 'low_stock', 'Out of stock': 'out_of_stock'
  };
  return {
    sku: row[0] || '', packLabel: row[1] || '', packCount: Number(row[2]) || 0,
    unitsRemaining: stock, lowStockThreshold: threshold,
    status: statusMap[statusLabel] || 'not_set', updatedAt: row[6] || '',
    updatedBy: row[7] || '', notes: row[8] || ''
  };
}

function readInventory_() {
  const sheet = seedInventory_();
  const rows = sheet.getDataRange().getValues().slice(1).filter(function (row) { return row[0]; });
  return json_({ ok: true, inventory: rows.map(inventoryRecord_) });
}

function findInventoryRow_(sheet, sku) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(sku).matchEntireCell(true).findNext();
  return match ? match.getRow() : 0;
}

function updateInventory_(payload) {
  requireAdmin_(payload.secret);
  const sku = clean_(payload.sku).toUpperCase();
  const stock = Number(payload.unitsRemaining);
  const threshold = Number(payload.lowStockThreshold);
  if (!sku || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(threshold) || threshold < 0) {
    throw new Error('Invalid inventory update.');
  }
  const sheet = seedInventory_();
  const rowNumber = findInventoryRow_(sheet, sku);
  if (!rowNumber) throw new Error('Inventory item not found.');
  const row = sheet.getRange(rowNumber, 1, 1, INVENTORY_HEADERS.length).getValues()[0];
  const previous = row[3] === '' ? null : Number(row[3]) || 0;
  const now = payload.updatedAt || new Date().toISOString();
  sheet.getRange(rowNumber, 4, 1, 6).setValues([[
    stock, threshold, inventoryStatus_(stock, threshold), safeCell_(now),
    safeCell_(payload.updatedBy || 'ActivBite admin'), safeCell_(payload.notes)
  ]]);
  appendInventoryMovement_('', sku, row[1], previous, stock, 'Manual stock update', payload.updatedBy);
  const updated = sheet.getRange(rowNumber, 1, 1, INVENTORY_HEADERS.length).getValues()[0];
  return json_({ ok: true, item: inventoryRecord_(updated) });
}

function appendInventoryMovement_(trackingId, sku, packLabel, previous, next, reason, source) {
  const sheet = getSheet_(INVENTORY_MOVEMENTS_SHEET, INVENTORY_MOVEMENT_HEADERS);
  sheet.appendRow([
    Utilities.getUuid(), new Date().toISOString(), safeCell_(trackingId), safeCell_(sku),
    safeCell_(packLabel), Number(next) - Number(previous || 0), safeCell_(reason),
    previous === null ? '' : Number(previous), Number(next), safeCell_(source || 'ActivBite admin')
  ]);
}

function movementExists_(trackingId, reason) {
  const sheet = getSheet_(INVENTORY_MOVEMENTS_SHEET, INVENTORY_MOVEMENT_HEADERS);
  if (sheet.getLastRow() < 2) return false;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, INVENTORY_MOVEMENT_HEADERS.length).getDisplayValues();
  return rows.some(function (row) { return row[2] === trackingId && row[6] === reason; });
}

function adjustInventoryForOrder_(trackingId, packCount, quantity, reason) {
  if (!trackingId || movementExists_(trackingId, reason)) return;
  if (reason === 'Order cancelled — stock restored' &&
      !movementExists_(trackingId, 'Order confirmed — stock deducted')) return;
  const sku = 'AB-PACK-' + String(packCount).padStart(2, '0');
  const sheet = seedInventory_();
  const rowNumber = findInventoryRow_(sheet, sku);
  if (!rowNumber) return;
  const row = sheet.getRange(rowNumber, 1, 1, INVENTORY_HEADERS.length).getValues()[0];
  if (row[3] === '') return; // Stock tracking has not been started for this pack yet.
  const previous = Math.max(0, Number(row[3]) || 0);
  const change = reason === 'Order cancelled — stock restored' ? Math.max(1, Number(quantity) || 1) : -Math.max(1, Number(quantity) || 1);
  const next = Math.max(0, previous + change);
  const now = new Date().toISOString();
  sheet.getRange(rowNumber, 4).setValue(next);
  sheet.getRange(rowNumber, 6, 1, 3).setValues([[
    inventoryStatus_(next, row[4]), now, 'Order workflow'
  ]]);
  appendInventoryMovement_(trackingId, sku, row[1], previous, next, reason, 'Order workflow');
}

function hasInventory_(packCount, quantity) {
  const sku = 'AB-PACK-' + String(packCount).padStart(2, '0');
  const sheet = seedInventory_();
  const rowNumber = findInventoryRow_(sheet, sku);
  if (!rowNumber) return true;
  const stock = sheet.getRange(rowNumber, 4).getValue();
  return stock === '' || stock === null || Number(stock) >= Math.max(1, Number(quantity) || 1);
}

function readReports_() {
  const sheet = getSheet_(REPORTS_SHEET, REPORT_HEADERS);
  const rows = sheet.getDataRange().getDisplayValues().slice(1).filter(function (row) { return row[0]; });
  const reports = rows.map(function (row) {
    return {
      id: row[0], uploadedAt: row[1], reportName: row[2], category: row[3],
      reportDate: row[4], fileName: row[5], fileUrl: row[6], fileId: row[7],
      notes: row[8], uploadedBy: row[9]
    };
  });
  reports.sort(function (a, b) { return String(b.uploadedAt).localeCompare(String(a.uploadedAt)); });
  return json_({ ok: true, reports: reports });
}

function reportsFolder_() {
  const folders = DriveApp.getFoldersByName('ActivBite Reports');
  return folders.hasNext() ? folders.next() : DriveApp.createFolder('ActivBite Reports');
}

function saveReport_(payload) {
  requireAdmin_(payload.secret);
  if (!clean_(payload.reportName) || !clean_(payload.fileBase64) || !clean_(payload.fileName)) {
    throw new Error('Report name and file are required.');
  }
  const blob = Utilities.newBlob(
    Utilities.base64Decode(payload.fileBase64),
    clean_(payload.mimeType) || 'application/octet-stream', clean_(payload.fileName)
  );
  const file = reportsFolder_().createFile(blob);
  const report = {
    id: clean_(payload.reportId) || Utilities.getUuid(),
    uploadedAt: payload.uploadedAt || new Date().toISOString(),
    reportName: clean_(payload.reportName), category: clean_(payload.category),
    reportDate: clean_(payload.reportDate), fileName: clean_(payload.fileName),
    fileUrl: file.getUrl(), fileId: file.getId(), notes: clean_(payload.notes),
    uploadedBy: clean_(payload.uploadedBy || 'ActivBite admin')
  };
  getSheet_(REPORTS_SHEET, REPORT_HEADERS).appendRow([
    safeCell_(report.id), safeCell_(report.uploadedAt), safeCell_(report.reportName),
    safeCell_(report.category), safeCell_(report.reportDate), safeCell_(report.fileName),
    safeCell_(report.fileUrl), safeCell_(report.fileId), safeCell_(report.notes),
    safeCell_(report.uploadedBy)
  ]);
  return json_({ ok: true, report: report });
}

function deleteReport_(payload) {
  requireAdmin_(payload.secret);
  const reportId = clean_(payload.reportId);
  const sheet = getSheet_(REPORTS_SHEET, REPORT_HEADERS);
  if (sheet.getLastRow() < 2) throw new Error('Report not found.');
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, REPORT_HEADERS.length).getDisplayValues();
  const index = rows.findIndex(function (row) { return row[0] === reportId; });
  if (index === -1) throw new Error('Report not found.');
  const fileId = rows[index][7];
  if (fileId) {
    try { DriveApp.getFileById(fileId).setTrashed(true); } catch (ignored) {}
  }
  sheet.deleteRow(index + 2);
  return json_({ ok: true });
}

function managementSpreadsheet_() {
  return SpreadsheetApp.openById(MANAGEMENT_SPREADSHEET_ID);
}

function managementSheet_(definition) {
  const sheet = managementSpreadsheet_().getSheetByName(definition.sheetName);
  if (!sheet) throw new Error('Management sheet not found: ' + definition.sheetName);
  return sheet;
}

function managementHeaders_(sheet, definition) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return [];
  return sheet.getRange(definition.headerRow, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(clean_)
    .filter(Boolean);
}

function readManagementData_() {
  const datasets = Object.keys(MANAGEMENT_DEFINITIONS).map(function (key) {
    const definition = MANAGEMENT_DEFINITIONS[key];
    const sheet = managementSheet_(definition);
    const headers = managementHeaders_(sheet, definition);
    const startRow = definition.headerRow + 1;
    const lastRow = sheet.getLastRow();
    let rows = [];
    let rowNumbers = [];
    if (headers.length && lastRow >= startRow) {
      sheet.getRange(startRow, 1, Math.min(lastRow - startRow + 1, 1000), headers.length)
        .getDisplayValues()
        .forEach(function (row, index) {
          if (row.some(function (cell) { return clean_(cell); })) {
            rows.push(row);
            rowNumbers.push(startRow + index);
          }
        });
    }
    return { key: key, title: definition.title, headers: headers, rows: rows, rowNumbers: rowNumbers, editable: definition.editable };
  });
  return json_({ ok: true, datasets: datasets });
}

function nextManagementId_(sheet, definition) {
  const startRow = definition.headerRow + 1;
  const rowCount = Math.max(0, sheet.getLastRow() - definition.headerRow);
  const values = rowCount ? sheet.getRange(startRow, 1, rowCount, 1).getDisplayValues().flat() : [];
  const prefix = definition.idPrefix || '';
  const highest = values.reduce(function (max, value) {
    const match = clean_(value).match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1]) || 0) : max;
  }, 0);
  return prefix + String(highest + 1).padStart(3, '0');
}

function firstEmptyManagementRow_(sheet, definition) {
  const startRow = definition.headerRow + 1;
  const available = Math.max(1, sheet.getMaxRows() - definition.headerRow);
  const values = sheet.getRange(startRow, 1, available, 1).getDisplayValues();
  for (let index = 0; index < values.length; index += 1) {
    if (!clean_(values[index][0])) return startRow + index;
  }
  sheet.insertRowAfter(sheet.getMaxRows());
  return sheet.getMaxRows();
}

function managementCellValue_(header, rawValue) {
  const value = clean_(rawValue);
  if (!value) return '';
  if (/Date$/i.test(header) && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + 'T00:00:00');
  }
  if (/Quantity|Price|Cost|Amount|Stock|Level|Produced|Used \(g\)$/i.test(header) && isFinite(Number(value))) {
    return Number(value);
  }
  return safeCell_(value);
}

function applyManagementFormulas_(datasetKey, sheet, rowNumber, headers, providedValues) {
  const column = function (header) { return headers.indexOf(header) + 1; };
  const formula = function (header, value) {
    const columnNumber = column(header);
    if (columnNumber > 0) sheet.getRange(rowNumber, columnNumber).setFormula(value);
  };

  if (datasetKey === 'purchases') {
    if (!clean_(providedValues['Cost Price'])) formula('Cost Price', '=IF(D' + rowNumber + '="",,XLOOKUP(D' + rowNumber + ',Products!B:B,Products!E:E,0))');
    formula('Total Cost', '=IF(E' + rowNumber + '="",,E' + rowNumber + '*F' + rowNumber + ')');
  }
  if (datasetKey === 'sales') {
    if (!clean_(providedValues['Selling Price'])) formula('Selling Price', '=IF(D' + rowNumber + '="",,XLOOKUP(D' + rowNumber + ',Products!B:B,Products!F:F,0))');
    formula('Total Amount', '=IF(E' + rowNumber + '="",,E' + rowNumber + '*F' + rowNumber + ')');
    if (!clean_(providedValues['Due Date'])) formula('Due Date', '=IF(B' + rowNumber + '="",,B' + rowNumber + '+Settings!B6)');
  }
  if (datasetKey === 'suppliers') {
    formula('Outstanding Payable', '=IF(A' + rowNumber + '="",,SUMIFS(Purchases!G:G,Purchases!C:C,B' + rowNumber + ')-SUMIFS(\'Payments Made\'!E:E,\'Payments Made\'!C:C,B' + rowNumber + '))');
    formula('Last Payment Date', '=IF(A' + rowNumber + '="",,MAXIFS(\'Payments Made\'!B:B,\'Payments Made\'!C:C,B' + rowNumber + '))');
  }
}

function appendManagementRecord_(datasetKey, values) {
  const definition = MANAGEMENT_DEFINITIONS[datasetKey];
  if (!definition || !definition.editable) throw new Error('This management view is read-only.');
  const sheet = managementSheet_(definition);
  const headers = managementHeaders_(sheet, definition);
  if (!headers.length) throw new Error('The management sheet has no headers.');
  const rowNumber = firstEmptyManagementRow_(sheet, definition);
  const target = sheet.getRange(rowNumber, 1, 1, headers.length);
  const templateRow = Math.max(definition.headerRow + 1, rowNumber - 1);
  if (templateRow !== rowNumber) {
    const template = sheet.getRange(templateRow, 1, 1, headers.length);
    template.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    template.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  }
  const normalized = Object.assign({}, values || {});
  if (definition.idHeader && !clean_(normalized[definition.idHeader])) {
    normalized[definition.idHeader] = nextManagementId_(sheet, definition);
  }
  const row = headers.map(function (header) { return managementCellValue_(header, normalized[header]); });
  target.setValues([row]);
  applyManagementFormulas_(datasetKey, sheet, rowNumber, headers, normalized);
  SpreadsheetApp.flush();
  return sheet.getRange(rowNumber, 1, 1, headers.length).getDisplayValues()[0];
}

function addManagementRecord_(payload) {
  requireAdmin_(payload.secret);
  const datasetKey = clean_(payload.dataset);
  const row = appendManagementRecord_(datasetKey, payload.values || {});
  return json_({ ok: true, dataset: datasetKey, row: row });
}

function updateManagementRecord_(payload) {
  requireAdmin_(payload.secret);
  const datasetKey = clean_(payload.dataset);
  const definition = MANAGEMENT_DEFINITIONS[datasetKey];
  const rowNumber = Number(payload.rowNumber);
  if (!definition || !definition.editable) throw new Error('This management view is read-only.');
  const sheet = managementSheet_(definition);
  if (!Number.isInteger(rowNumber) || rowNumber <= definition.headerRow || rowNumber > sheet.getLastRow()) {
    throw new Error('The selected spreadsheet row is not valid.');
  }
  const headers = managementHeaders_(sheet, definition);
  const normalized = Object.assign({}, payload.values || {});
  headers.forEach(function (header, index) {
    if (header === definition.idHeader || !Object.prototype.hasOwnProperty.call(normalized, header)) return;
    sheet.getRange(rowNumber, index + 1).setValue(managementCellValue_(header, normalized[header]));
  });
  applyManagementFormulas_(datasetKey, sheet, rowNumber, headers, normalized);
  SpreadsheetApp.flush();
  return json_({
    ok: true,
    dataset: datasetKey,
    rowNumber: rowNumber,
    row: sheet.getRange(rowNumber, 1, 1, headers.length).getDisplayValues()[0]
  });
}

function syncOrderToManagement_(trackingId, orderRow) {
  const salesDefinition = MANAGEMENT_DEFINITIONS.sales;
  const salesSheet = managementSheet_(salesDefinition);
  if (salesSheet.getLastRow() > salesDefinition.headerRow) {
    const existing = salesSheet.getRange(salesDefinition.headerRow + 1, 1, salesSheet.getLastRow() - salesDefinition.headerRow, 1)
      .createTextFinder(trackingId).matchEntireCell(true).findNext();
    if (existing) return;
  }

  const customerName = clean_(orderRow[5]) || 'Website customer';
  const contactInfo = [clean_(orderRow[6]), clean_(orderRow[7])].filter(Boolean).join(' / ');
  const customersDefinition = MANAGEMENT_DEFINITIONS.customers;
  const customersSheet = managementSheet_(customersDefinition);
  const customerNames = customersSheet.getLastRow() > customersDefinition.headerRow
    ? customersSheet.getRange(customersDefinition.headerRow + 1, 2, customersSheet.getLastRow() - customersDefinition.headerRow, 1).getDisplayValues().flat()
    : [];
  if (customerNames.indexOf(customerName) === -1) {
    appendManagementRecord_('customers', {
      'Customer Name / Location': customerName,
      'Sales Channel': 'Online',
      'Preferred Pack Size': Number(orderRow[12]) + ' Pack',
      'Contact Info': contactInfo,
      'Campus Details': clean_(orderRow[8]),
      'Status': 'Active',
      'Notes': 'Created automatically from website order ' + trackingId,
    });
  }

  const bars = Math.max(1, Number(orderRow[12]) || 1) * Math.max(1, Number(orderRow[13]) || 1);
  const total = Math.max(0, Number(orderRow[14]) || 0);
  appendManagementRecord_('sales', {
    'Invoice Number': trackingId,
    'Date': Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    'Customer': customerName,
    'Product': 'ActivBite Balanced Breakfast Bar Original',
    'Quantity': bars,
    'Selling Price': bars ? total / bars : total,
    'Payment Type (Cash/Credit)': 'Cash',
    'Notes': 'Website order; ' + clean_(orderRow[11]) + ' × ' + Math.max(1, Number(orderRow[13]) || 1),
  });
}

function getSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);

  return sheet;
}

function safeCell_(value) {
  const text = clean_(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function clean_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
