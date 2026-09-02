'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PUBLIC_NAV_LINKS } from '@/lib/public-navigation';
import styles from './public-header.module.css';

export default function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    let frame = 0;

    const syncHeaderTheme = () => {
      frame = 0;
      const sampleY = Math.min(82, window.innerHeight * .1);
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-nav-theme]')
      );
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom > sampleY;
      });

      setNavTheme(active?.dataset.navTheme === 'light' ? 'light' : 'dark');
    };

    const onViewportChange = () => {
      if (!frame) frame = window.requestAnimationFrame(syncHeaderTheme);
    };

    syncHeaderTheme();
    const routeFrame = window.requestAnimationFrame(syncHeaderTheme);
    window.addEventListener('scroll', onViewportChange, { passive: true });
    window.addEventListener('resize', onViewportChange);

    return () => {
      window.cancelAnimationFrame(routeFrame);
      window.removeEventListener('scroll', onViewportChange);
      window.removeEventListener('resize', onViewportChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      className={`${styles.header} ${navTheme === 'light' ? styles.headerOnLight : ''}`}
      data-common-header
      data-nav-contrast={navTheme}
    >
      <Link href="/" className={styles.logo} aria-label="ActivBite home">
        <Image
          className={styles.brandWhite}
          src="/optimized/ab-logo.webp"
          alt="ActivBite"
          width={640}
          height={640}
          priority
        />
        <Image
          className={styles.brandOrange}
          src="/PNG/LOGO_ORANGE.png"
          alt=""
          width={640}
          height={640}
          priority
        />
      </Link>

      <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Main navigation">
        {PUBLIC_NAV_LINKS.map((link) => {
          const isCurrent =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href ||
                pathname.startsWith(`${link.href}/`) ||
                (link.href === '/shop' && pathname === '/checkout');
          const className = [
            'highlighted' in link ? styles.shopAction : '',
            isCurrent ? styles.activeLink : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <Link
              key={link.href}
              href={link.href}
              className={className || undefined}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {'highlighted' in link && <ShoppingBag size={17} aria-hidden="true" />}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        className={styles.menuButton}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}
