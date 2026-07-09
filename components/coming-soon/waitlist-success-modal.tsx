'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './waitlist-success-modal.module.css';

/* ── Confetti particle data (hardcoded for SSR safety) ── */
const CONFETTI = [
  // Top
  { tx: '0px',    ty: '-460px', r: '540deg',  c: '#FF6B00', w: '14px', h: '14px', br: '50%',  delay: '0.04s', dur: '1.4s' },
  { tx: '120px',  ty: '-420px', r: '-480deg', c: '#FFC61B', w: '12px', h: '12px', br: '2px',  delay: '0.08s', dur: '1.2s' },
  { tx: '-120px', ty: '-420px', r: '600deg',  c: '#FF4757', w: '16px', h: '6px',  br: '2px',  delay: '0.02s', dur: '1.5s' },
  { tx: '255px',  ty: '-350px', r: '-360deg', c: '#2ED573', w: '10px', h: '10px', br: '2px',  delay: '0.12s', dur: '1.3s' },
  { tx: '-255px', ty: '-350px', r: '480deg',  c: '#A855F7', w: '12px', h: '12px', br: '50%',  delay: '0.06s', dur: '1.4s' },
  { tx: '325px',  ty: '-250px', r: '-540deg', c: '#FFE135', w: '15px', h: '5px',  br: '2px',  delay: '0.15s', dur: '1.25s' },
  { tx: '-325px', ty: '-250px', r: '420deg',  c: '#1E90FF', w: '11px', h: '11px', br: '2px',  delay: '0.05s', dur: '1.35s' },
  // Upper-right
  { tx: '400px',  ty: '-150px', r: '-480deg', c: '#FF8C42', w: '13px', h: '13px', br: '50%',  delay: '0.10s', dur: '1.4s' },
  { tx: '450px',  ty: '-50px',  r: '560deg',  c: '#FFD700', w: '16px', h: '6px',  br: '2px',  delay: '0.07s', dur: '1.3s' },
  { tx: '460px',  ty: '50px',   r: '-400deg', c: '#FF6B00', w: '10px', h: '10px', br: '2px',  delay: '0.18s', dur: '1.45s' },
  { tx: '420px',  ty: '150px',  r: '480deg',  c: '#FFC61B', w: '14px', h: '14px', br: '50%',  delay: '0.03s', dur: '1.35s' },
  { tx: '380px',  ty: '250px',  r: '-540deg', c: '#2ED573', w: '11px', h: '4px',  br: '2px',  delay: '0.13s', dur: '1.2s' },
  // Right
  { tx: '320px',  ty: '350px',  r: '360deg',  c: '#FF4757', w: '15px', h: '15px', br: '2px',  delay: '0.09s', dur: '1.4s' },
  { tx: '250px',  ty: '420px',  r: '-440deg', c: '#A855F7', w: '12px', h: '12px', br: '50%',  delay: '0.06s', dur: '1.35s' },
  { tx: '150px',  ty: '460px',  r: '520deg',  c: '#1E90FF', w: '10px', h: '4px',  br: '2px',  delay: '0.14s', dur: '1.25s' },
  { tx: '50px',   ty: '480px',  r: '-360deg', c: '#FFE135', w: '16px', h: '16px', br: '2px',  delay: '0.03s', dur: '1.4s' },
  // Bottom
  { tx: '0px',    ty: '490px',  r: '480deg',  c: '#FF8C42', w: '14px', h: '14px', br: '50%',  delay: '0.17s', dur: '1.3s' },
  { tx: '-100px', ty: '460px',  r: '-520deg', c: '#FFD700', w: '11px', h: '4px',  br: '2px',  delay: '0.08s', dur: '1.45s' },
  { tx: '-180px', ty: '420px',  r: '440deg',  c: '#FF6B00', w: '15px', h: '15px', br: '2px',  delay: '0.11s', dur: '1.35s' },
  { tx: '-280px', ty: '350px',  r: '-360deg', c: '#FFC61B', w: '12px', h: '12px', br: '50%',  delay: '0.05s', dur: '1.3s' },
  { tx: '-380px', ty: '250px',  r: '560deg',  c: '#FF4757', w: '10px', h: '4px',  br: '2px',  delay: '0.16s', dur: '1.25s' },
  // Lower-left
  { tx: '-420px', ty: '150px',  r: '-480deg', c: '#2ED573', w: '16px', h: '16px', br: '2px',  delay: '0.02s', dur: '1.4s' },
  { tx: '-460px', ty: '50px',   r: '400deg',  c: '#A855F7', w: '11px', h: '11px', br: '50%',  delay: '0.10s', dur: '1.35s' },
  { tx: '-450px', ty: '-50px',  r: '-520deg', c: '#FFE135', w: '14px', h: '5px',  br: '2px',  delay: '0.07s', dur: '1.3s' },
  { tx: '-400px', ty: '-150px', r: '480deg',  c: '#1E90FF', w: '15px', h: '15px', br: '2px',  delay: '0.14s', dur: '1.4s' },
  { tx: '-320px', ty: '-250px', r: '-360deg', c: '#FF8C42', w: '12px', h: '12px', br: '50%',  delay: '0.04s', dur: '1.3s' },
  // Tiny sparkles
  { tx: '250px',  ty: '-200px', r: '720deg',  c: '#ffffff', w: '6px',  h: '6px',  br: '50%',  delay: '0.20s', dur: '1.5s' },
  { tx: '-250px', ty: '-200px', r: '-660deg', c: '#ffffff', w: '5px',  h: '5px',  br: '50%',  delay: '0.22s', dur: '1.45s' },
  { tx: '180px',  ty: '300px',  r: '600deg',  c: '#ffffff', w: '6px',  h: '6px',  br: '50%',  delay: '0.19s', dur: '1.4s' },
  { tx: '-180px', ty: '300px',  r: '-540deg', c: '#ffffff', w: '5px',  h: '5px',  br: '50%',  delay: '0.21s', dur: '1.5s' },
  { tx: '350px',  ty: '-100px', r: '480deg',  c: '#FFD700', w: '7px',  h: '7px',  br: '50%',  delay: '0.25s', dur: '1.45s' },
  { tx: '-350px', ty: '-100px', r: '-480deg', c: '#FFD700', w: '7px',  h: '7px',  br: '50%',  delay: '0.23s', dur: '1.3s' },
  { tx: '80px',   ty: '-350px', r: '540deg',  c: '#FF9500', w: '8px',  h: '8px',  br: '50%',  delay: '0.26s', dur: '1.5s' },
  { tx: '-80px',  ty: '-350px', r: '-600deg', c: '#FF9500', w: '8px',  h: '8px',  br: '50%',  delay: '0.24s', dur: '1.45s' },
];

interface Props {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export default function WaitlistSuccessModal({ isOpen, email, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);

      // Trigger a crazy level haptic vibration if supported (Mobile)
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([150, 50, 150, 50, 300]);
        } catch (err) {
          // ignore
        }
      }

      const t = setTimeout(handleClose, 7800);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      onClose();
    }, 600);
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={handleClose}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* ── Confetti ── */}
      <div className={styles.confettiField} aria-hidden="true">
        {CONFETTI.map((p, i) => (
          <div
            key={i}
            className={styles.piece}
            style={{
              '--tx': p.tx,
              '--ty': p.ty,
              '--r': p.r,
              '--c': p.c,
              '--w': p.w,
              '--h': p.h,
              '--br': p.br,
              '--delay': p.delay,
              '--dur': p.dur,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Crazy Card ── */}
      <div
        className={`${styles.card} ${closing ? styles.cardClosing : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Waitlist confirmation"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg) scale(1)`,
        }}
      >
        {/* Floating Images (Product Bar) */}
        <div className={styles.floatingImages} aria-hidden="true">
          <Image
            src="/optimized/product-packaging.webp"
            width={320}
            height={178}
            alt=""
            className={styles.productImage}
            sizes="320px"
          />
        </div>

        <div className={styles.cardContent}>
          {/* Animated checkmark */}
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
