// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: 'energy' | 'protein' | 'recovery';
  stock: number;
  featured: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: string[];
  allergens: string[];
  created_at: string;
}

// Cart types
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Cart {
  items: CartItem[];
}

// Customer types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  created_at: string;
}

// Order types
export interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'failed';
  payment_method: 'cashfree' | 'bank_transfer';
  cashfree_order_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

// Enquiry types
export interface WholesaleEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  message: string;
  quantity_range: string;
  created_at: string;
  notes?: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  notes?: string;
}

// Report/FAQ types
export interface Report {
  id: string;
  title: string;
  file_url: string;
  category: 'nutrition' | 'testing' | 'safety' | 'sustainability';
  created_at: string;
}

// Auth types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  created_at: string;
}
