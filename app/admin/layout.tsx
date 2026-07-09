'use client';

import Link from 'next/link';
import { LogOut, BarChart3, Package, Mail, Users, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';

const adminNavigation = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/wholesale', label: 'Wholesale Enquiries', icon: Mail },
  { href: '/admin/contact-enquiries', label: 'Contact Forms', icon: Mail },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold">ActivBite</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-border h-16 flex items-center px-8">
          <h2 className="text-xl font-semibold text-foreground">Admin Dashboard</h2>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
