'use client';

import { useEffect } from 'react';

export default function BrowserCacheCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const cleanBrowserCache = async () => {
      try {
        // Unregister ALL service workers
        const registrations =
          'serviceWorker' in navigator
            ? await navigator.serviceWorker.getRegistrations()
            : [];
        await Promise.all(registrations.map((reg) => reg.unregister()));

        // Delete ALL caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }

        const reloadKey = 'activbite-cache-cleanup-v3';
        if (window.sessionStorage.getItem(reloadKey) !== 'done') {
          window.sessionStorage.setItem(reloadKey, 'done');
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
