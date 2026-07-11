'use client';

import { useEffect } from 'react';

const CLEANUP_FLAG = 'activbite-cache-cleaned-v1';

export default function BrowserCacheCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const cleanBrowserCache = async () => {
      try {
        const registrations =
          'serviceWorker' in navigator
            ? await navigator.serviceWorker.getRegistrations()
            : [];

        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        }

        if (registrations.length > 0 && sessionStorage.getItem(CLEANUP_FLAG) !== 'done') {
          sessionStorage.setItem(CLEANUP_FLAG, 'done');
          window.location.reload();
        }
      } catch {
        // Cache cleanup should never block the page.
      }
    };

    cleanBrowserCache();
  }, []);

  return null;
}
