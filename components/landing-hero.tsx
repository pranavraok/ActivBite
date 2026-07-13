'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { PointerEvent, useEffect, useState } from 'react';
import styles from './landing-hero.module.css';

const heroTitle = 'BREAKFAST BAR'.split('');

export default function LandingHero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--mx', x.toFixed(3));
    event.currentTarget.style.setProperty('--my', y.toFixed(3));
  };

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '0');
    event.currentTarget.style.setProperty('--my', '0');
  };

  return (
    <main className={styles.page}>
    <section className={`${styles.hero} ${loading ? styles.isLoading : styles.heroReady}`} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className={`${styles.loader} ${!loading ? styles.loaderExit : ''}`} aria-hidden={!loading}>
        <div className={styles.loaderGlow} />
        <div className={styles.loaderBurst} />
        <div className={styles.loaderWord} aria-label="Breakfast Bar">
          {heroTitle.map((letter, index) => <span style={{'--i': index} as React.CSSProperties} key={`${letter}-${index}`}>{letter === ' ' ? '\u00A0' : letter}</span>)}
        </div>
        <div className={styles.loaderCrumbs}>{Array.from({length: 14}, (_, index) => <i style={{'--i': index} as React.CSSProperties} key={index} />)}</div>
        <Image className={styles.loaderBar} src="/PNG/LANDINGPAGEBAR.png" alt="" width={1448} height={1086} priority />
        <p>Breakfast, ready.</p>
      </div>
      <div className={styles.texture} aria-hidden="true" />
      <div className={styles.rays} aria-hidden="true" />
      <div className={`${styles.botanical} ${styles.botanicalLeft}`} aria-hidden="true">❧</div>
      <div className={`${styles.botanical} ${styles.botanicalRight}`} aria-hidden="true">❧</div>

      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="ActivBite home">
          <Image src="/optimized/ab-logo.webp" alt="ActivBite" width={640} height={640} priority />
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About us</Link>
          <a href="#how-it-works">How it works</a>
          <a href="#ingredients">Ingredients</a>
          <Link href="/wholesale">Wholesale</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </header>

      <section className={styles.intro}>
        <h1 aria-label="Breakfast Bar">{heroTitle.map((letter, index) => <span key={`${letter}-${index}`}>{letter === ' ' ? '\u00A0' : letter}</span>)}</h1>
      </section>

      <div className={styles.foodScene} id="ingredients" aria-hidden="true">
        <figure className={`${styles.food} ${styles.oats}`}><Image src="/PNG/OATINBOWL.png" alt="" width={720} height={480} priority /><figcaption>Oats</figcaption></figure>
        <figure className={`${styles.food} ${styles.poha}`}><Image src="/PNG/POHAONBOWL.png" alt="" width={720} height={480} priority /><figcaption>Poha</figcaption></figure>
        <figure className={`${styles.food} ${styles.jaggery}`}><Image src="/PNG/JAGGERYONBOWL.png" alt="" width={720} height={480} priority /><figcaption>Jaggery</figcaption></figure>
        <figure className={`${styles.food} ${styles.peanuts}`}><Image src="/PNG/PEANUTSONBOWL.png" alt="" width={720} height={480} priority /><figcaption>Peanuts</figcaption></figure>
        <figure className={`${styles.food} ${styles.elaichi}`}><Image src="/PNG/ELAICHIINBOWL.png" alt="" width={720} height={540} priority /><figcaption>Elaichi</figcaption></figure>
        <figure className={`${styles.food} ${styles.dates}`}><Image src="/PNG/DATESINBOWL.png" alt="" width={720} height={480} priority /><figcaption>Dates</figcaption></figure>
      </div>

      <section className={styles.product} aria-label="ActivBite Breakfast Bar">
        <Image src="/PNG/LANDINGPAGEBAR.png" alt="ActivBite balanced breakfast bar" width={1448} height={1086} priority sizes="(max-width: 700px) 110vw, 58vw" />
        <Link href="/shop" className={styles.buyButton}>
          <ShoppingCart aria-hidden="true" /> <span>Buy Now</span>
        </Link>
      </section>

    </section>

    <section className={styles.blankScroll} id="how-it-works" aria-label="More ActivBite content coming soon">
      <div className={styles.scrollCue}><span>Scroll to play</span><i>↓</i></div>
    </section>

    </main>
  );
}
