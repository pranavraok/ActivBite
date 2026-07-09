'use client';

import Image from 'next/image';
import { FormEvent, PointerEvent, useState } from 'react';
import { CheckCircle2, Loader2, Mail, Zap } from 'lucide-react';
import IngredientStage from './ingredient-stage';
import WaitlistSuccessModal from './waitlist-success-modal';
import styles from './coming-soon.module.css';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    event.currentTarget.style.setProperty('--mx', x.toFixed(3));
    event.currentTarget.style.setProperty('--my', y.toFixed(3));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'Please try again.');
      }

      setStatus('success');
      setMessage(payload.message || "You're on the list.");
      setSavedEmail(email.trim());
      setShowSuccessModal(true);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    }
  };

  const isLoading = status === 'loading';

  return (
    <section className={styles.launchPage} onPointerMove={handlePointerMove}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />
      <IngredientStage />

      <header className={styles.brandMark} aria-label="ActivBite">
        <Image
          src="/AB-LOGO.png"
          alt="ActivBite"
          width={190}
          height={190}
          priority
        />
      </header>

      <main className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.title} aria-label="Coming soon">
            <svg
              viewBox="0 0 760 430"
              role="presentation"
              aria-hidden="true"
            >
              <text
                className={styles.titleWhite}
                x="50%"
                y="178"
                textAnchor="middle"
                textLength="690"
                lengthAdjust="spacingAndGlyphs"
              >
                COMING
              </text>
              <text
                className={styles.titleYellow}
                x="50%"
                y="388"
                textAnchor="middle"
                textLength="510"
                lengthAdjust="spacingAndGlyphs"
              >
                SOON
              </text>
            </svg>
          </h1>

          <p className={styles.tagline}>
            A <strong>better</strong> breakfast is on the way.
          </p>

          <form
            className={styles.notifyForm}
            onSubmit={handleSubmit}
            suppressHydrationWarning
          >
            <div className={styles.mailIcon} aria-hidden="true">
              <Mail size={22} strokeWidth={2} />
            </div>
            <label className={styles.srOnly} htmlFor="launch-email">
              Email address
            </label>
            <input
              id="launch-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              required
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? (
                <Loader2 size={20} className={styles.spinner} />
              ) : status === 'success' ? (
                <CheckCircle2 size={20} />
              ) : null}
              <span>{isLoading ? 'Saving' : 'Notify me'}</span>
            </button>
          </form>

          <div className={styles.statusLine} aria-live="polite">
            {message}
          </div>

          <div className={styles.proofLine}>
            <span>High Protein. High Fibre. Real Ingredients.</span>
          </div>
        </div>

        <div className={styles.productStage} aria-hidden="true">
          <div className={styles.launchBeam} />
          <span className={`${styles.launchSpark} ${styles.sparkOne}`} />
          <span className={`${styles.launchSpark} ${styles.sparkTwo}`} />
          <span className={`${styles.launchSpark} ${styles.sparkThree}`} />
          <Image
            className={styles.productBar}
            src="/PNG/PRODUCT-PACKAGING.png"
            alt=""
            width={2400}
            height={1330}
            priority
            sizes="(max-width: 900px) 94vw, 64vw"
          />
          <Image
            className={styles.productBox}
            src="/PNG/Product-Box.png"
            alt=""
            width={1448}
            height={1086}
            priority
            sizes="(max-width: 900px) 60vw, 33vw"
          />
          <div className={styles.productShadow} />
        </div>
      </main>

      <div className={styles.social}>
        <span>Follow us for updates</span>
        <a
          href="https://www.instagram.com/activbite/"
          target="_blank"
          rel="noreferrer"
          aria-label="Follow ActivBite on Instagram"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.75 2.75h8.5a5 5 0 0 1 5 5v8.5a5 5 0 0 1-5 5h-8.5a5 5 0 0 1-5-5v-8.5a5 5 0 0 1 5-5Z"
              stroke="currentColor"
              strokeWidth="2.05"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.55 11.47a3.75 3.75 0 1 1-7.41 1.1 3.75 3.75 0 0 1 7.41-1.1Z"
              stroke="currentColor"
              strokeWidth="2.05"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.35 6.65h.01"
              stroke="currentColor"
              strokeWidth="2.9"
              strokeLinecap="round"
            />
          </svg>
        </a>
      </div>

      <div className={styles.bottomWave} aria-hidden="true" />
      <div className={styles.bottomCream} aria-hidden="true" />
      
      <WaitlistSuccessModal 
        isOpen={showSuccessModal} 
        email={savedEmail} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </section>
  );
}
