'use client';

import { MOCK_PRODUCTS } from '@/lib/constants';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { formatPrice } from '@/lib/helpers';
import { useCartStore } from '@/lib/store/cart-store';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/shop" className="text-primary font-semibold hover:underline">
            Back to shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="relative w-full h-96 bg-secondary rounded-lg overflow-hidden border border-border">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="text-sm font-semibold text-primary uppercase mb-2">
                  {product.category}
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="bg-secondary p-6 rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Free shipping on orders over ₹500
                </p>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-secondary"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-secondary"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={20} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} /> Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Stock */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ {product.stock} in stock - Ships in 1-2 business days
                </p>
              </div>

              {/* Nutrition Facts */}
              <div className="border-t pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Nutrition Facts
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="text-2xl font-bold text-foreground">
                      {product.nutrition.calories}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-2xl font-bold text-foreground">
                      {product.nutrition.protein}g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="text-2xl font-bold text-foreground">
                      {product.nutrition.carbs}g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="text-2xl font-bold text-foreground">
                      {product.nutrition.fat}g
                    </p>
                  </div>
                </div>
              </div>

              {/* Ingredients & Allergens */}
              <div className="border-t pt-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Ingredients
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
                {product.allergens.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Allergens
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {product.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
}
