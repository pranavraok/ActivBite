import ProductCard from '@/components/product-card';
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop - ActivBite',
  description: 'Browse our collection of nutritious breakfast bars for active students.',
};

export default function ShopPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Shop</h1>
            <p className="text-muted-foreground">
              Discover our full range of breakfast bars
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <div className="mb-12 border-b border-border">
              <div className="flex gap-4 overflow-x-auto">
                <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
                  All Products
                </button>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <button
                    key={key}
                    className="px-4 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
    </>
  );
}
