'use client';

import { ShoppingCart, TrendingUp, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Orders',
    value: '₹24,500',
    change: '+12.5%',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    label: 'Revenue',
    value: '₹1,24,500',
    change: '+8.2%',
    icon: TrendingUp,
    href: '/admin/orders',
  },
  {
    label: 'Pending Orders',
    value: '5',
    change: 'Action needed',
    icon: AlertCircle,
    href: '/admin/orders',
  },
  {
    label: 'Total Customers',
    value: '324',
    change: '+2.4%',
    icon: Users,
    href: '/admin/orders',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-primary font-semibold">{stat.change}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  id: '#ORD-001',
                  customer: 'John Doe',
                  amount: '₹499',
                  status: 'Delivered',
                  date: 'Jan 15, 2024',
                },
                {
                  id: '#ORD-002',
                  customer: 'Jane Smith',
                  amount: '₹1,299',
                  status: 'Shipped',
                  date: 'Jan 14, 2024',
                },
                {
                  id: '#ORD-003',
                  customer: 'Mike Johnson',
                  amount: '₹799',
                  status: 'Processing',
                  date: 'Jan 13, 2024',
                },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-secondary transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border">
          <Link
            href="/admin/orders"
            className="text-primary font-semibold hover:underline text-sm"
          >
            View all orders →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/wholesale">
          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Wholesale Enquiries
            </h3>
            <p className="text-muted-foreground text-sm">
              View and manage bulk order requests
            </p>
          </div>
        </Link>

        <Link href="/admin/contact-enquiries">
          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Contact Enquiries
            </h3>
            <p className="text-muted-foreground text-sm">
              Review customer support requests
            </p>
          </div>
        </Link>

        <Link href="/admin/products">
          <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Product Inventory
            </h3>
            <p className="text-muted-foreground text-sm">
              Manage product stock and details
            </p>
          </div>
        </Link>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-900 text-sm">
          <strong>Skeleton Status:</strong> This admin dashboard is a skeleton
          implementation. Actual data integration with Supabase will be added in the next
          phase. Currently showing mock data for UI reference.
        </p>
      </div>
    </div>
  );
}
