# ActivBite - E-Commerce Skeleton

A full-stack e-commerce platform skeleton for ActivBite, a student-focused breakfast bar brand built with Next.js, Tailwind CSS, Supabase, and Zustand.

## Features

### Public Website
- **Home Page**: Hero section, featured products, brand story
- **Shop Page**: Product listing with category filtering
- **Product Detail Page**: Full product information, nutrition facts, add to cart
- **Cart System**: Persistent cart with Zustand + localStorage
- **Checkout Flow**: Multi-step checkout with order creation
- **Additional Pages**: About, FAQ, Wholesale, Contact, Privacy Policy, Terms & Conditions

### Admin Dashboard (Skeleton)
- Login page
- Dashboard overview
- Order management
- Product inventory
- Wholesale enquiries
- Contact enquiries
- Report management

### Technical Features
- TypeScript for type safety
- Tailwind CSS 4 with custom ActivBite theme
- Form validation with Zod + React Hook Form
- Mock data for demo without Supabase
- Responsive design (mobile-first)
- Optimized images
- SEO metadata

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (for admin)
- **Payment**: Cashfree (skeleton)
- **Icons**: lucide-react

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start dev server
pnpm dev
```

Visit http://localhost:3000 to see the app.

## Environment Setup

### Without Supabase (Mock Mode)
The app works out of the box without Supabase. It uses mock data and localStorage.

### With Supabase
1. Create a Supabase project at https://supabase.com
2. Run the database schema: `supabase/schema.sql`
3. Add these to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### With Cashfree Payments
1. Create a Cashfree account at https://cashfree.com
2. Add these to `.env.local`:
   ```
   NEXT_PUBLIC_CASHFREE_APP_ID=your_app_id
   CASHFREE_SECRET_KEY=your_secret_key
   ```

## Project Structure

```
/app
  /(public)           # Public routes
    page.tsx          # Home
    shop/             # Shop pages
    product/          # Product detail
    cart/             # Cart page
    checkout/         # Checkout
    about/            # About page
    faq/              # FAQ
    wholesale/        # Wholesale
    contact/          # Contact form
    privacy-policy/   # Policy pages
    terms/
  /admin              # Admin routes (skeleton)
    layout.tsx
    login/page.tsx
    page.tsx
  /api               # API routes (skeleton)
    /cashfree
    /orders
    /wholesale
    /contact
  globals.css        # Global styles + theme

/components
  header.tsx         # Navigation
  footer.tsx         # Footer
  product-card.tsx   # Product card
  cart-drawer.tsx    # Cart component
  admin/             # Admin components

/lib
  types.ts           # TypeScript types
  constants.ts       # Constants + mock data
  helpers.ts         # Utility functions
  supabase-client.ts # Supabase setup
  store/
    cart-store.ts    # Zustand store

/supabase
  schema.sql        # Database schema

/public
  placeholder-bar.png # Product image
```

## Usage

### Adding to Cart
```typescript
import { useCartStore } from '@/lib/store/cart-store';

const addItem = useCartStore((state) => state.addItem);
addItem({
  product_id: '1',
  name: 'Energy Bar',
  price: 199,
  quantity: 1,
  image_url: '/image.png'
});
```

### Fetching from Supabase
```typescript
import { supabase } from '@/lib/supabase-client';

const { data, error } = await supabase
  .from('products')
  .select('*');
```

### Form Validation
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## Styling

The app uses Tailwind CSS 4 with a custom ActivBite theme:
- **Primary**: Orange (#FF8C42)
- **Secondary**: Cream (#FFF5E6)
- **Background**: White
- **Text**: Dark (#1A1A1A)

Theme variables are defined in `app/globals.css`.

## TODO - Next Steps

### Phase 3: Admin Dashboard
- [ ] Implement admin authentication with Supabase Auth
- [ ] Build admin dashboard with stats
- [ ] Create order management interface
- [ ] Add product inventory management
- [ ] Create enquiry tracking system

### Phase 4: API Integration
- [ ] Integrate Cashfree payment API
- [ ] Build order creation endpoint
- [ ] Add webhook handler for payment confirmation
- [ ] Create enquiry submission endpoints

### Phase 5: Polish
- [ ] Add error boundaries
- [ ] Implement toast notifications
- [ ] Add loading skeletons
- [ ] Optimize images
- [ ] Set up analytics
- [ ] Configure email notifications

### Production
- [ ] Set up production Supabase database
- [ ] Configure Cashfree production keys
- [ ] Add logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Deploy to Vercel

## Design Customization

To update the design:
1. Edit `app/globals.css` for theme colors
2. Modify component styles in respective files
3. Update `tailwind.config.ts` for custom utilities

## Performance Optimization

- Images are optimized with Next.js Image component
- Cart state persists in localStorage for instant load
- Mock data prevents N+1 queries
- Responsive design for all device sizes

## Support

For issues or questions, contact: hello@activbite.com

## License

MIT
