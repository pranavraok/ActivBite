'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './waitlist-success-modal.module.css';

const AUTO_CLOSE_MS = 6400;
const CLOSE_ANIMATION_MS = 320;

const CONFETTI = [
  { tx: '0px', ty: '-420px', r: '480deg', c: '#FF6B00', w: '14px', h: '14px', br: '50%', delay: '0.02s', dur: '1.1s' },
  { tx: '120px', ty: '-370px', r: '-380deg', c: '#FFC61B', w: '12px', h: '12px', br: '2px', delay: '0.05s', dur: '1.05s' },
  { tx: '-120px', ty: '-360px', r: '420deg', c: '#FF4757', w: '16px', h: '6px', br: '2px', delay: '0s', dur: '1.12s' },
  { tx: '255px', ty: '-270px', r: '-320deg', c: '#2ED573', w: '10px', h: '10px', br: '2px', delay: '0.08s', dur: '1.08s' },
  { tx: '-255px', ty: '-270px', r: '360deg', c: '#A855F7', w: '12px', h: '12px', br: '50%', delay: '0.04s', dur: '1.12s' },
  { tx: '365px', ty: '-90px', r: '420deg', c: '#FFD700', w: '16px', h: '6px', br: '2px', delay: '0.07s', dur: '1.08s' },
  { tx: '-365px', ty: '-90px', r: '-420deg', c: '#1E90FF', w: '11px', h: '11px', br: '2px', delay: '0.06s', dur: '1.1s' },
  { tx: '335px', ty: '120px', r: '360deg', c: '#FFC61B', w: '14px', h: '14px', br: '50%', delay: '0.03s', dur: '1.08s' },
  { tx: '-335px', ty: '120px', r: '-360deg', c: '#2ED573', w: '11px', h: '4px', br: '2px', delay: '0.09s', dur: '1s' },
  { tx: '220px', ty: '330px', r: '-360deg', c: '#A855F7', w: '12px', h: '12px', br: '50%', delay: '0.05s', dur: '1.08s' },
  { tx: '-220px', ty: '330px', r: '360deg', c: '#FF8C42', w: '14px', h: '14px', br: '50%', delay: '0.1s', dur: '1.08s' },
  { tx: '0px', ty: '390px', r: '420deg', c: '#FFE135', w: '16px', h: '16px', br: '2px', delay: '0.06s', dur: '1.12s' },
  { tx: '250px', ty: '-170px', r: '540deg', c: '#ffffff', w: '6px', h: '6px', br: '50%', delay: '0.13s', dur: '1.1s' },
  { tx: '-250px', ty: '-170px', r: '-540deg', c: '#ffffff', w: '5px', h: '5px', br: '50%', delay: '0.14s', dur: '1.08s' },
  { tx: '155px', ty: '245px', r: '480deg', c: '#ffffff', w: '6px', h: '6px', br: '50%', delay: '0.12s', dur: '1.1s' },
  { tx: '-155px', ty: '245px', r: '-480deg', c: '#ffffff', w: '5px', h: '5px', br: '50%', delay: '0.15s', dur: '1.08s' },
];

interface Props {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export default function WaitlistSuccessModal({ isOpen, email, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;

    closingRef.current = true;
    clearTimers();
    setClosing(true);

    finishTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      closingRef.current = false;
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [clearTimers, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    clearTimers();
    closingRef.current = false;
    setVisible(true);
    setClosing(false);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(45);
      } catch {
        // Vibration support varies by browser.
      }
    }

    closeTimerRef.current = window.setTimeout(handleClose, AUTO_CLOSE_MS);

    return clearTimers;
  }, [clearTimers, handleClose, isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={handleClose}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.confettiField} aria-hidden="true">
        {CONFETTI.map((piece, index) => (
          <div
            key={index}
            className={styles.piece}
            style={{
              '--tx': piece.tx,
              '--ty': piece.ty,
              '--r': piece.r,
              '--c': piece.c,
              '--w': piece.w,
              '--h': piece.h,
              '--br': piece.br,
              '--delay': piece.delay,
              '--dur': piece.dur,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div
        className={`${styles.card} ${closing ? styles.cardClosing : ''}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Waitlist confirmation"
      >
        <div className={styles.floatingImages} aria-hidden="true">
          <Image
            src="/optimized/product-packaging.webp"
            width={320}
            height={178}
            alt=""
            className={styles.productImage}
            sizes="(max-width: 520px) 180px, 320px"
          />
        </div>

        <div className={styles.cardContent}>
          <div className={styles.checkWrap} aria-hidden="true">
            <svg className={styles.checkSvg} viewBox="0 0 80 80">
              <circle className={styles.checkCircle} cx="40" cy="40" r="36" />
              <path className={styles.checkPath} d="M 22 42 L 35 56 L 58 26" />
            </svg>
            <div className={styles.checkPulseRing} />
          </div>

          <h2 className={styles.headline}>
            <span className={styles.headlineText}>YOU&apos;RE IN! 🎉</span>
          </h2>

          <p className={styles.subtext}>
            You&apos;re officially on the VIP list.<br />
            Get ready for a <strong>breakfast revolution.</strong>
          </p>

          {email && (
            <div className={styles.emailBadge}>
              <div className={styles.emailBadgeGlow} />
              <span className={styles.emailDot} aria-hidden="true" />
              <span className={styles.emailText}>{email}</span>
            </div>
          )}

          <div className={styles.countdownWrap} aria-hidden="true">
            <div className={styles.countdownBar} />
          </div>

          <button className={styles.closeBtn} onClick={handleClose}>
            <span className={styles.closeBtnText}>AWESOME</span>
          </button>
        </div>
      </div>
    </div>
  );
}
