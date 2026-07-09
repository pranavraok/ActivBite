import { Product } from './types';

// ActivBite brand colors
export const COLORS = {
  primary: '#FF8C42', // Warm orange
  secondary: '#FFF5E6', // Cream
  background: '#FFFFFF', // White
  text: '#1A1A1A', // Dark
  border: '#E8E8E8', // Light gray
  success: '#10B981',
  error: '#EF4444',
};

// Currency
export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';

// Product categories
export const CATEGORIES = {
  energy: 'Energy Boost',
  protein: 'Protein Plus',
  recovery: 'Recovery',
};

// Order statuses
export const ORDER_STATUSES = {
  pending: 'Pending Payment',
  paid: 'Payment Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  failed: 'Payment Failed',
};

// Mock products for demo
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Energy Bar Classic',
    slug: 'energy-bar-classic',
    description: 'Perfect for pre-workout sessions. Packed with natural energy.',
    price: 199,
    image_url: '/optimized/product-packaging.webp',
    category: 'energy',
    stock: 100,
    featured: true,
    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 35,
      fat: 9,
      fiber: 3,
    },
    ingredients: ['Oats', 'Honey', 'Almonds', 'Dark Chocolate', 'Coconut Oil'],
    allergens: ['Almonds', 'Soy'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Protein Power Bar',
    slug: 'protein-power-bar',
    description: 'High protein content for muscle recovery and growth.',
    price: 249,
    image_url: '/optimized/product-packaging.webp',
    category: 'protein',
    stock: 80,
    featured: true,
    nutrition: {
      calories: 280,
      protein: 20,
      carbs: 30,
      fat: 8,
      fiber: 2,
    },
    ingredients: ['Whey Protein', 'Oats', 'Peanut Butter', 'Dark Chocolate'],
    allergens: ['Peanuts', 'Milk'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Recovery Blend',
    slug: 'recovery-blend',
    description: 'Aids in post-workout recovery with amino acids and carbs.',
    price: 229,
    image_url: '/optimized/product-packaging.webp',
    category: 'recovery',
    stock: 120,
    featured: true,
    nutrition: {
      calories: 260,
      protein: 12,
      carbs: 40,
      fat: 5,
      fiber: 4,
    },
    ingredients: ['Muesli', 'Banana Chips', 'Honey', 'Nuts Mix'],
    allergens: ['Tree Nuts'],
    created_at: new Date().toISOString(),
  },
];

// Pagination
export const ITEMS_PER_PAGE = 10;

// Toast messages
export const TOAST_MESSAGES = {
  addedToCart: 'Added to cart!',
  removedFromCart: 'Removed from cart',
  cartCleared: 'Cart cleared',
  orderCreated: 'Order created successfully!',
  errorOccurred: 'An error occurred. Please try again.',
};
