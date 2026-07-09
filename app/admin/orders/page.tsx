'use client';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all customer orders
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground mb-4">Orders list - Coming soon</p>
        <p className="text-sm text-muted-foreground">
          This page will display all orders with filtering, sorting, and order management
          features. Integration with Supabase will be added in Phase 4.
        </p>
      </div>
    </div>
  );
}
