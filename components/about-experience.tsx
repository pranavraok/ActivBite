'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BicepsFlexed,
  Flame,
  HeartPulse,
  Home,
  Leaf,
  MapPin,
  MessageCircleHeart,
  PackageCheck,
  Rocket,
  Soup,
  Sparkles,
  Star,
  Store,
  Sunrise,
  Trophy,
  Utensils,
  Zap,
} from 'lucide-react';
import styles from './about-experience.module.css';
import PublicHeader from './public-header';

const nutritionHighlights = [
  { icon: Flame, value: '300', label: 'kcal' },
  { icon: BicepsFlexed, value: '9.3g', label: 'Protein' },
  { icon: Leaf, value: '6.5g', label: 'Fibre' },
];

const storyBeats = [
  {
    label: 'The problem',
    title: 'Skipping breakfast was not “just college life”.',
    body:
      'After two years of missed breakfasts, the effect was real: weakness, sleepy classes, and marks taking a hit. Then came the bigger shock — many students around campus were stuck in the same loop.',
  },
  {
    label: 'The push',
    title: 'A Launchpad pitch turned into a ₹50K start.',
    body:
      'The idea was pitched at a Launchpad event and received a ₹50,000 grant to initiate the business. That one push pulled ActivBite deeper into food, testing, recipes, and the real student morning problem.',
  },
  {
    label: 'The almost-end',
    title: 'It almost stopped before it started.',
    body:
      'At one point, the plan was to drop the idea and return the grant. A mentor said, “Try until the ₹50K is gone. If you still do not want it, stop.” That advice gave the idea one more honest chance.',
  },
  {
    label: 'The turning point',
    title: '200+ tastings changed everything.',
    body:
      'After 50+ recipe trials, one recipe was tasted by 200+ people — and not one person said it was less than good. That was the moment ActivBite stopped being only an idea and started becoming a brand.',
  },
];

const ingredientBadges = [
  'Oats',
  'Peanuts',
  'Dates',
  'Poha',
  'Jaggery',
  'Elaichi',
  'Chocolate',
];

const values = [
  {
    icon: HeartPulse,
    title: 'Health with heart',
    body:
      'We are building for students who miss meals because mornings move too fast. The goal is simple: make carrying something better easier.',
  },
  {
    icon: Utensils,
    title: 'Traditional taste memory',
    body:
      'Many early tasters said the bar reminded them of a familiar traditional sweet. That warm, home-style feeling is part of the ActivBite soul.',
  },
  {
    icon: Home,
    title: 'Student-led, family-backed',
    body:
      'This is a founder-led brand in spirit, but the ground work is family-backed. Less reel-making, more real making.',
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

          <div className={styles.heroActions}>
            <Link href="/shop">
              Shop packs
              <ArrowRight size={19} />
            </Link>
            <Link href="/wholesale" className={styles.secondaryAction}>
              Wholesale enquiry
            </Link>
          </div>
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
              <strong>₹50K</strong>
              <span>Launchpad grant</span>
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

      <section className={styles.storySection} aria-labelledby="story-heading">
        <div className={styles.sectionIntro}>
          <span>Initial start</span>
          <h2 id="story-heading">The story was never only about a bar.</h2>
          <p>
            A student problem became a tested recipe, then a breakfast brand.
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

      <section className={styles.missionBand} aria-labelledby="mission-heading">
        <div className={styles.missionCopy}>
          <span>Mission</span>
          <h2 id="mission-heading">No student should skip a meal because mornings are messy.</h2>
          <p>
            ActivBite is building simple, ready-to-eat foods that are easy to
            carry, familiar to taste, and practical for student life — so a busy
            day does not have to start empty.
          </p>
        </div>

        <div className={styles.locationCard}>
          <MapPin size={24} />
          <div>
            <strong>NITK idea. Padukone unit.</strong>
            <p>
              The problem was noticed at NITK. The manufacturing journey is being
              built from Padukone, close to home, with family on the ground.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.productSection} aria-labelledby="food-heading">
        <div className={styles.foodVisual}>
          <Image
            src="/PNG/PACKOF30.png"
            alt="ActivBite pack of 30"
            width={1440}
            height={1080}
            sizes="(max-width: 900px) 82vw, 34vw"
            unoptimized
          />
        </div>

        <div className={styles.foodCopy}>
          <span>Food direction</span>
          <h2 id="food-heading">Familiar flavours. Made for student mornings.</h2>
          <p>
            The bar is made with familiar ingredients and a taste direction that
            feels close to an Indian sweet memory — not some cold, gym-only food
            that students cannot emotionally connect with.
          </p>

          <div className={styles.ingredients}>
            {ingredientBadges.map((ingredient) => (
              <span key={ingredient}>{ingredient}</span>
            ))}
          </div>

          <div className={styles.nutritionGrid} aria-label="Nutrition highlights">
            {nutritionHighlights.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon size={24} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <p className={styles.note}>
            Iron and calcium details will be added after the final nutrition report.
            Contains peanuts. Please check allergens before consuming.
          </p>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="values-heading">
        <div className={styles.sectionIntro}>
          <span>How we want to build</span>
          <h2 id="values-heading">Ground-first, not hype-first.</h2>
          <p>
            ActivBite can be founder-led without becoming a “camera on all day”
            brand. The focus is product, campus, family effort, and honest student
            feedback.
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map(({ icon: Icon, title, body }) => (
            <article key={title}>
              <Icon size={26} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ctaBand} data-nav-theme="light">
        <div>
          <span>Breakfast line</span>
          <h2>Breakfast that keeps up with you.</h2>
          <p>#NoMoreHungryMornings</p>
        </div>
        <div className={styles.ctaActions}>
          <Link href="/shop">
            Shop now
            <ArrowRight size={18} />
          </Link>
          <Link href="/wholesale">
            <Store size={18} />
            Partner with us
          </Link>
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
