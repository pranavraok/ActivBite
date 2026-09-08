'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  ClipboardList,
  FileText,
  LogOut,
  Mail,
  Menu,
  Package,
  Users,
  X,
} from 'lucide-react';
import styles from './admin-shell.module.css';

const adminNavigation = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/operations', label: 'Business Operations', icon: ClipboardList },
  { href: '/admin/waitlist', label: 'Waitlist Emails', icon: Users },
  { href: '/admin/wholesale', label: 'Wholesale Enquiries', icon: Mail },
  { href: '/admin/contact-enquiries', label: 'Contact Forms', icon: Mail },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    setIsNavigationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNavigationOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNavigationOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isNavigationOpen]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  if (pathname === '/admin/login') return <>{children}</>;

  const activePage =
    adminNavigation.find((item) =>
      item.href === '/admin'
        ? pathname === '/admin'
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) || adminNavigation[0];

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={`${styles.sidebarBackdrop} ${isNavigationOpen ? styles.sidebarBackdropVisible : ''}`}
        onClick={() => setIsNavigationOpen(false)}
        aria-label="Close admin navigation"
        tabIndex={isNavigationOpen ? 0 : -1}
      />

      <aside
        id="admin-navigation"
        className={`${styles.sidebar} ${isNavigationOpen ? styles.sidebarOpen : ''}`}
      >
        <Link href="/" className={styles.brand} aria-label="ActivBite home">
          <span className={styles.brandLogo}>
            <Image
              src="/optimized/ab-logo.webp"
              alt="ActivBite"
              fill
              sizes="176px"
              priority
            />
          </span>
          <span className={styles.brandTag}>Admin portal</span>
        </Link>

        <button
          type="button"
          className={styles.sidebarCloseButton}
          onClick={() => setIsNavigationOpen(false)}
          aria-label="Close admin navigation"
        >
          <X size={20} />
        </button>

        <nav className={styles.navigation} aria-label="Admin navigation">
          <p className={styles.navigationLabel}>Command centre</p>
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.workspaceStatus}>
            <span className={styles.statusDot} aria-hidden="true" />
            Secure admin workspace
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className={styles.logoutButton}
          >
            <LogOut size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarIdentity}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={() => setIsNavigationOpen(true)}
              aria-label="Open admin navigation"
              aria-controls="admin-navigation"
              aria-expanded={isNavigationOpen}
            >
              <Menu size={21} />
            </button>
            <div>
              <p className={styles.topbarEyebrow}>ActivBite command centre</p>
              <h1>{activePage.label}</h1>
            </div>
          </div>
          <Link href="/" className={styles.siteLink}>
            <span>View website</span>
            <ArrowUpRight size={17} />
          </Link>
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
