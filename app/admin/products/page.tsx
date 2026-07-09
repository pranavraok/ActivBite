'use client';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage product inventory and details
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-4">Product management - Coming soon</p>
        <p className="text-sm text-muted-foreground">
          This page will allow you to edit product details, manage stock levels, and update
          pricing. Integration with Supabase will be added in Phase 4.
        </p>
      </div>
    </div>
  );
}
