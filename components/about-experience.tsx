'use client';

import Image from 'next/image';
import {
  MapPin,
  Rocket,
  Soup,
  Star,
  Sunrise,
  Trophy,
  Zap,
} from 'lucide-react';
import styles from './about-experience.module.css';
import PublicHeader from './public-header';

const storyBeats = [
  {
    label: 'The problem',
    title: 'It began with mornings that moved too fast.',
    body:
      'For two years at NITK, breakfast was the first thing to disappear on a rushed day. Weakness, sleepy classes, and falling focus made it clear that “just skip it” was not harmless.',
  },
  {
    label: 'The first move',
    title: 'A campus pattern became something worth testing.',
    body:
      'Early Launchpad support helped the team move from concern to recipe trials—listening, adjusting, and learning what students would actually choose on a rushed morning.',
  },
  {
    label: 'The turning point',
    title: 'The almost-ending became the reason to continue.',
    body:
      'When giving up felt easier, one mentor asked for one honest final try. More than 50 trials and 200+ tastings later, student feedback gave ActivBite the confidence to keep building.',
  },
];

export default function AboutExperience() {
  return (
    <main className={styles.aboutPage} data-brand-page="about">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
        <div className={styles.copy}>
          <p className={styles.microText}>NITK born · Padukone built · Student mornings first</p>

          <h1>
            Don&apos;t skip
            <span>breakfast.</span>
          </h1>

          <p className={styles.lead}>
            ActivBite began with one familiar student problem: rushed mornings,
            skipped breakfasts, and tired classes.
          </p>
        </div>

        <aside className={styles.heroCard} aria-label="ActivBite origin snapshot">
          <div className={styles.cardTop}>
            <span>#NoMoreHungryMornings</span>
            <strong>Real story</strong>
          </div>

          <div className={styles.productStage}>
            <Image
              src="/optimized/product-packaging.webp"
              alt="ActivBite Breakfast Bar"
              width={1600}
              height={887}
              sizes="(max-width: 900px) 80vw, 32vw"
              priority
            />
            <div className={styles.grantBadge}>
              <Trophy size={20} />
              <strong>EARLY</strong>
              <span>Launchpad support</span>
            </div>
          </div>

          <div className={styles.cardStats}>
            <span>
              <Star size={17} />
              50+ recipe trials
            </span>
            <span>
              <Zap size={17} />
              200+ early tastings
            </span>
          </div>
        </aside>
      </section>

      <section className={styles.storySection} data-nav-theme="dark" aria-labelledby="story-heading">
        <div className={styles.sectionIntro}>
          <span>Our beginning</span>
          <h2 id="story-heading">The story was never only about a bar.</h2>
          <p>
            Follow the moments that turned a rushed morning into a student-first mission.
          </p>
        </div>

        <div className={styles.storyGrid}>
          {storyBeats.map((beat, index) => (
            <article key={beat.label} className={styles.storyCard}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>{beat.label}</small>
              <h3>{beat.title}</h3>
              <p>{beat.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.missionBand} data-nav-theme="light" aria-labelledby="mission-heading">
        <div className={styles.missionCopy}>
          <span>The story continues</span>
          <h2 id="mission-heading">A student idea, now building close to home.</h2>
          <p>
            ActivBite is growing from one honest belief: no student should have
            to begin a demanding day empty simply because the morning got messy.
          </p>
        </div>

        <div className={styles.locationCard}>
          <MapPin size={24} />
          <div>
            <strong>NITK idea. Padukone unit.</strong>
            <p>
              The problem was noticed at NITK. The next chapter is being built
              from Padukone, close to home and supported by family on the ground.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaBand} data-nav-theme="dark">
        <div>
          <span>Breakfast line</span>
          <h2>Breakfast that keeps up with you.</h2>
          <p>#NoMoreHungryMornings</p>
        </div>
      </section>

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
