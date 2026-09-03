'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Backpack, BicepsFlexed, Check, CircleHelp, CreditCard, Crown, Leaf, Mail, MapPin, Menu, PackageCheck, ShoppingBag, ShoppingCart, Sparkles, Store, Utensils, X, Zap } from 'lucide-react';
import { CSSProperties, PointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PUBLIC_NAV_LINKS } from '@/lib/public-navigation';
import styles from './landing-hero.module.css';

const heroTitle = 'MORNING FUEL'.split('');

const heroRainIngredients = [
  { src: '/PNG/OAT.png', x: '2.5%', size: '30px', delay: '-1.2s', duration: '8.4s', drift: '18px', rotate: '210deg' },
  { src: '/PNG/POHA.png', x: '5.5%', size: '23px', delay: '-7.8s', duration: '9.6s', drift: '-10px', rotate: '-170deg' },
  { src: '/PNG/PEANUTS.png', x: '9%', size: '36px', delay: '-5.1s', duration: '10.2s', drift: '-15px', rotate: '-240deg' },
  { src: '/PNG/DATES.png', x: '12.5%', size: '25px', delay: '-8.8s', duration: '11.4s', drift: '11px', rotate: '230deg' },
  { src: '/PNG/ELAICHI.png', x: '15.5%', size: '27px', delay: '-3.4s', duration: '9.1s', drift: '12px', rotate: '190deg' },
  { src: '/PNG/JAGGERY.png', x: '18%', size: '22px', delay: '-.4s', duration: '10.7s', drift: '-9px', rotate: '-205deg' },
  { src: '/PNG/PEANUTS.png', x: '1%', size: '21px', delay: '-9.6s', duration: '12.1s', drift: '12px', rotate: '260deg' },
  { src: '/PNG/OAT.png', x: '82%', size: '24px', delay: '-4.5s', duration: '9.4s', drift: '10px', rotate: '185deg' },
  { src: '/PNG/DATES.png', x: '84.5%', size: '34px', delay: '-6.3s', duration: '10.8s', drift: '-14px', rotate: '-205deg' },
  { src: '/PNG/ELAICHI.png', x: '88%', size: '22px', delay: '-.8s', duration: '8.9s', drift: '9px', rotate: '200deg' },
  { src: '/PNG/JAGGERY.png', x: '91%', size: '31px', delay: '-2.6s', duration: '9.7s', drift: '16px', rotate: '225deg' },
  { src: '/PNG/PEANUTS.png', x: '94%', size: '24px', delay: '-8.1s', duration: '11.6s', drift: '-12px', rotate: '-250deg' },
  { src: '/PNG/POHA.png', x: '97%', size: '29px', delay: '-7.2s', duration: '11.1s', drift: '-11px', rotate: '-180deg' },
  { src: '/PNG/DATES.png', x: '99%', size: '20px', delay: '-4s', duration: '9.9s', drift: '-13px', rotate: '215deg' },
] as const;

const storyIngredients = [
  { name: 'Oats', src: '/PNG/OAT.png', kicker: 'Wholegrain fibre', title: 'Fuller for longer.', body: 'Oats contribute soluble fibre and satisfying texture, helping breakfast feel more substantial.', fact: 'Supports fullness', side: 1, y: '-17vh', rotate: '-24deg' },
  { name: 'Peanuts', src: '/PNG/PEANUTS.png', kicker: 'Protein + good fats', title: 'Energy with staying power.', body: 'Peanuts bring plant protein and unsaturated fats that help make each bite more satisfying.', fact: 'Part of 9.3g protein', side: 1, y: '-10vh', rotate: '22deg' },
  { name: 'Dates', src: '/PNG/DATES.png', kicker: 'Natural carbohydrate', title: 'Quick morning energy.', body: 'Dates supply naturally occurring sugars, fibre, and a soft texture that binds the bar together.', fact: 'Naturally sweet', side: -1, y: '14vh', rotate: '16deg' },
  { name: 'Poha', src: '/PNG/POHA.png', kicker: 'Familiar breakfast grain', title: 'Light, practical fuel.', body: 'Poha contributes easy-to-carry carbohydrate energy while keeping the recipe rooted in Indian breakfast.', fact: 'Breakfast made portable', side: 1, y: '16vh', rotate: '-18deg' },
  { name: 'Jaggery', src: '/PNG/JAGGERY.png', kicker: 'Warm, rounded sweetness', title: 'Flavour without the flatness.', body: 'Jaggery gives the recipe its deep caramel character and complements the grains and nuts.', fact: 'Traditional taste', side: -1, y: '-8vh', rotate: '-15deg' },
  { name: 'Elaichi', src: '/PNG/ELAICHI.png', kicker: 'Big aroma, tiny ingredient', title: 'More flavour in every chew.', body: 'Elaichi adds a bright, familiar aroma that makes the bar taste fuller and more comforting.', fact: 'Naturally aromatic', side: 1, y: '-15vh', rotate: '27deg' },
  { name: 'Chocolate', src: '/PNG/CHOCOLATE.png', kicker: 'Craveable cocoa finish', title: 'A breakfast worth wanting.', body: 'Chocolate rounds out the nutty, grain-forward recipe so the nutritious choice is enjoyable too.', fact: 'Taste that brings it together', side: -1, y: '9vh', rotate: '19deg' },
] as const;

const landingPacks = [
  { count: 5, label: 'Mini', price: '₹225', offer: 'No offer', image: '/PNG/PACKOF5.png' },
  { count: 10, label: 'Starter', price: '₹420', offer: '₹30 off', image: '/PNG/PACKOF10.png' },
  { count: 20, label: 'Routine', price: '₹825', offer: '₹75 off', image: '/PNG/PACKOF20.png' },
  { count: 30, label: 'Power', price: '₹1,149', offer: '₹201 off', image: '/PNG/PACKOF30.png' },
] as const;

const tickerCopy = {
  intro: ['NO BREAKFAST?', 'NO PROBLEM.', 'GRAB. BITE. GO.'],
  why: ['MADE FOR 8 A.M.S', 'BUILT FOR BUSY DAYS', 'ZERO MORNING DRAMA'],
  ingredients: ['7 FAMILIAR INGREDIENTS', 'ONE SERIOUS BREAKFAST', 'REAL FOOD. REAL FUEL.'],
  powered: ['FULLY FUELLED', 'BREAKFAST POWER: ON', 'READY FOR WHATEVER'],
  shop: ['PICK YOUR STACK', 'SAVE WHEN YOU STOCK UP', 'YOUR MORNING, SORTED'],
  steps: ['CHOOSE YOUR PACK', 'DROP YOUR DETAILS', 'PAY. RELAX. BITE.'],
  campus: ['HELLO, NITK', 'FREE CAMPUS DELIVERY', 'FRESH BITES, CLOSE BY'],
  wholesale: ['STOCK BETTER BREAKFASTS', 'CAFÉS. CANTEENS. CAMPUS STORES.', 'LET’S GROW TOGETHER'],
  faq: ['QUESTIONS?', 'WE HAVE ANSWERS.', 'NO CONFUSION AT CHECKOUT'],
} as const;

function SectionTicker({ items, order }: { items: readonly string[]; order: number }) {
  return (
    <div data-nav-theme="light" className={styles.sectionTicker} style={{ order }} aria-hidden="true">
      <div>
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}<i /></span>
        ))}
      </div>
    </div>
  );
}

type TrackPoint = { x: number; y: number };
type TrackCurve = readonly [TrackPoint, TrackPoint, TrackPoint, TrackPoint];

const desktopTrack: readonly TrackCurve[] = [
  [{ x: 75, y: 20 }, { x: 61, y: 25 }, { x: 42, y: 37 }, { x: 34, y: 55 }],
  [{ x: 34, y: 55 }, { x: 30, y: 70 }, { x: 31, y: 85 }, { x: 38, y: 100 }],
  [{ x: 38, y: 100 }, { x: 42, y: 115 }, { x: 39, y: 130 }, { x: 32, y: 145 }],
  [{ x: 32, y: 145 }, { x: 28, y: 160 }, { x: 30, y: 175 }, { x: 36, y: 190 }],
  [{ x: 36, y: 190 }, { x: 40, y: 205 }, { x: 38, y: 220 }, { x: 33, y: 235 }],
  [{ x: 33, y: 235 }, { x: 29, y: 250 }, { x: 31, y: 265 }, { x: 37, y: 280 }],
  [{ x: 37, y: 280 }, { x: 40, y: 295 }, { x: 38, y: 310 }, { x: 34, y: 325 }],
];

const mobileTrack: readonly TrackCurve[] = [
  [{ x: 72, y: 20 }, { x: 59, y: 26 }, { x: 40, y: 38 }, { x: 31, y: 55 }],
  [{ x: 31, y: 55 }, { x: 27, y: 70 }, { x: 28, y: 85 }, { x: 35, y: 100 }],
  [{ x: 35, y: 100 }, { x: 39, y: 115 }, { x: 36, y: 130 }, { x: 29, y: 145 }],
  [{ x: 29, y: 145 }, { x: 25, y: 160 }, { x: 27, y: 175 }, { x: 34, y: 190 }],
  [{ x: 34, y: 190 }, { x: 38, y: 205 }, { x: 36, y: 220 }, { x: 30, y: 235 }],
  [{ x: 30, y: 235 }, { x: 26, y: 250 }, { x: 28, y: 265 }, { x: 35, y: 280 }],
  [{ x: 35, y: 280 }, { x: 38, y: 295 }, { x: 36, y: 310 }, { x: 31, y: 325 }],
];

const ingredientCheckpoints = [1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 1] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const phaseVisibility = (progress: number, start: number, end: number, fade = .018) =>
  Math.min(clamp((progress - start) / fade), clamp((end - progress) / fade));

const getTrackPoint = (progress: number, compact: boolean) => {
  const curves = compact ? mobileTrack : desktopTrack;
  const scaled = clamp(progress) * curves.length;
  const curveIndex = Math.min(curves.length - 1, Math.floor(scaled));
  const t = curveIndex === curves.length - 1 && scaled === curves.length ? 1 : scaled - curveIndex;
  const [p0, p1, p2, p3] = curves[curveIndex];
  const mt = 1 - t;
  const x = mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x;
  const y = mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y;
  const dx = 3 * mt ** 2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t ** 2 * (p3.x - p2.x);
  const dy = 3 * mt ** 2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t ** 2 * (p3.y - p2.y);
  return { x, y, dx, dy };
};

export default function LandingHero() {
  const [loading, setLoading] = useState(true);
  const [introLocked, setIntroLocked] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [selectedPack, setSelectedPack] = useState(30);
  const [compactStory, setCompactStory] = useState(false);
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('dark');
  const [ingredientLayerActive, setIngredientLayerActive] = useState(false);
  const storyRef = useRef<HTMLElement>(null);
  const ingredientRef = useRef<HTMLDivElement>(null);
  const powerFinaleRef = useRef<HTMLElement>(null);
  const journeyLayerRef = useRef<HTMLDivElement>(null);
  const ingredientLayerActiveRef = useRef(false);
  const targetStoryProgress = useRef(0);
  const renderedStoryProgress = useRef(0);
  const lastScrollY = useRef(0);
  const journeyDismissedRef = useRef(false);

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    const resetLandingJourney = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      targetStoryProgress.current = 0;
      renderedStoryProgress.current = 0;
      ingredientLayerActiveRef.current = false;
      journeyDismissedRef.current = false;
      lastScrollY.current = 0;
      setStoryProgress(0);
      setIngredientLayerActive(false);
    };
    resetLandingJourney();
    const frame = window.requestAnimationFrame(resetLandingJourney);
    const timer = window.setTimeout(resetLandingJourney, 100);
    window.addEventListener('pageshow', resetLandingJourney);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('pageshow', resetLandingJourney);
    };
  }, []);

  const hideJourneyBeforeRouteChange = () => {
    ingredientLayerActiveRef.current = false;
    setIngredientLayerActive(false);
    journeyLayerRef.current?.style.setProperty('display', 'none');
  };

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setLoading(false), 2600);
    const unlockTimer = window.setTimeout(() => setIntroLocked(false), 3550);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  useEffect(() => {
    if (!introLocked) return;
    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscroll;
    };
  }, [introLocked]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 520px)');
    const update = () => setCompactStory(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const syncHeaderTheme = () => {
      frame = 0;
      const sampleY = Math.min(82, window.innerHeight * .1);
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme]'));
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
    window.addEventListener('scroll', onViewportChange, { passive: true });
    window.addEventListener('resize', onViewportChange);
    return () => {
      window.removeEventListener('scroll', onViewportChange);
      window.removeEventListener('resize', onViewportChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let animationFrame = 0;

    const syncToScroll = () => {
      frame = 0;
      const section = ingredientRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const finaleRect = powerFinaleRef.current?.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const nextTarget = clamp(-rect.top / distance);
      const ingredientActive = rect.top <= 1 && rect.bottom > window.innerHeight;
      const finaleActive = Boolean(finaleRect && finaleRect.top < window.innerHeight && finaleRect.bottom > 0);
      const scrollingDown = window.scrollY >= lastScrollY.current;
      if (scrollingDown && finaleRect && finaleRect.bottom <= window.innerHeight * .42) {
        journeyDismissedRef.current = true;
      } else if (!scrollingDown && (ingredientActive || Boolean(finaleRect && finaleRect.bottom > window.innerHeight * .5))) {
        journeyDismissedRef.current = false;
      }
      lastScrollY.current = window.scrollY;
      const nextActive = !journeyDismissedRef.current && (ingredientActive || finaleActive);
      const clipBottom = !ingredientActive && finaleActive && finaleRect
        ? Math.max(0, window.innerHeight - finaleRect.bottom)
        : 0;
      targetStoryProgress.current = nextTarget;
      journeyLayerRef.current?.style.setProperty('--mascot-clip-bottom', `${clipBottom}px`);

      if (nextActive !== ingredientLayerActiveRef.current) {
        ingredientLayerActiveRef.current = nextActive;
        setIngredientLayerActive(nextActive);
      }

      if (!nextActive) {
        const boundaryProgress = rect.top > 0 ? 0 : 1;
        targetStoryProgress.current = boundaryProgress;
        renderedStoryProgress.current = boundaryProgress;
        setStoryProgress(boundaryProgress);
      }
    };

    const animate = () => {
      const current = renderedStoryProgress.current;
      const target = targetStoryProgress.current;
      const settled = Math.abs(target - current) < .0001;
      const next = settled ? target : current + (target - current) * .14;
      renderedStoryProgress.current = next;
      setStoryProgress(next);
      animationFrame = settled ? 0 : window.requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          syncToScroll();
          if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
        });
      }
    };

    syncToScroll();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
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

  const introVisible = clamp((.09 - storyProgress) / .015);
  const whyVisible = phaseVisibility(storyProgress, .075, .17);
  const ingredientVisible = phaseVisibility(storyProgress, .015, .94, .018);
  const howVisible = phaseVisibility(storyProgress, .58, .69);
  const campusVisible = phaseVisibility(storyProgress, .68, .77);
  const wholesaleVisible = phaseVisibility(storyProgress, .76, .85);
  const faqVisible = phaseVisibility(storyProgress, .84, .93);
  const footerVisible = clamp((storyProgress - .93) / .04);
  // Keep the seven ingredient beats at their existing physical scroll pace,
  // but finish them near the actual end of the chapter so there is no long
  // empty tail after the strength reveal.
  const ingredientProgress = clamp((storyProgress - .025) / .895);
  const ingredientSpan = 1 / storyIngredients.length;
  const ingredientStart = 0;
  const finaleProgress = clamp((storyProgress - .76) / .18);
  const shopVisible = phaseVisibility(storyProgress, .475, .6, .012);
  const barGrowth = ingredientProgress;
  const activeIngredient = Math.min(
    storyIngredients.length - 1,
    Math.max(0, Math.floor((ingredientProgress - ingredientStart) / ingredientSpan))
  );
  const activeLocalProgress = clamp(
    (ingredientProgress - (ingredientStart + activeIngredient * ingredientSpan)) / ingredientSpan
  );
  const previousCheckpoint = activeIngredient === 0 ? 0 : ingredientCheckpoints[activeIngredient - 1];
  const targetCheckpoint = ingredientCheckpoints[activeIngredient];
  const movementProgress = clamp(activeLocalProgress / .58);
  const easedMovement = movementProgress * movementProgress * (3 - 2 * movementProgress);
  const pathProgress = previousCheckpoint + (targetCheckpoint - previousCheckpoint) * easedMovement;
  const barPoint = getTrackPoint(pathProgress, compactStory);
  const cameraY = clamp(barPoint.y - 49, 0, 276);
  const barScreenY = barPoint.y - cameraY;
  // Keep the pack readable while it follows the route: it leans into the
  // curve, but never turns over or presents its back to the viewer.
  const pathAngleOnCurve = clamp(
    Math.atan2(barPoint.dx, Math.abs(barPoint.dy)) * (180 / Math.PI),
    -11,
    11
  );
  const checkpointTurn = clamp((activeLocalProgress - .43) / .15);
  const pathAngle = pathAngleOnCurve * (1 - checkpointTurn);
  const chewPhase = clamp((activeLocalProgress - .66) / .27);
  const chew = Math.abs(Math.sin(chewPhase * Math.PI * 5))
    * (activeLocalProgress > .64 && activeLocalProgress < .94 ? 1 : 0);
  const mouthOpen = clamp((activeLocalProgress - .46) / .16) * clamp((.96 - activeLocalProgress) / .12);
  const swallow = clamp((activeLocalProgress - .7) / .2);
  const poseIn = smoothstep((storyProgress - .925) / .055);
  const powerUp = poseIn;
  const shopFlight = 0;
  const powerPulse = Math.sin(clamp((storyProgress - .925) / .055) * Math.PI * 2)
    * powerUp;
  const mascotVisible = clamp(storyProgress / .018);
  const selectedPackDetails = landingPacks.find((pack) => pack.count === selectedPack) ?? landingPacks[3];
  let journeyBarX = barPoint.x;
  let journeyBarY = barScreenY;
  let journeyBarAngle = pathAngle;
  let journeyBarFlip = 0;
  let travelPop = 0;
  // Let the character react during the flex, then become completely still.
  let barVibrate = powerPulse * (1 - powerUp) * .45;

  if (storyProgress < .005) {
    journeyBarX = compactStory ? 96 : 94;
    journeyBarY = compactStory ? 84 : 86;
    journeyBarAngle = -3;
  } else if (storyProgress < .025) {
    const t = smoothstep((storyProgress - .005) / .02);
    journeyBarX = (compactStory ? 96 : 94) + (barPoint.x - (compactStory ? 96 : 94)) * t;
    journeyBarY = (compactStory ? 84 : 86) + (barScreenY - (compactStory ? 84 : 86)) * t;
    journeyBarAngle = -3 + (pathAngle + 3) * t;
  }

  if (storyProgress >= .925) {
    const centerMove = smoothstep((storyProgress - .925) / .045);
    journeyBarX = barPoint.x + (50 - barPoint.x) * centerMove;
    journeyBarY = barScreenY + (45 - barScreenY) * centerMove;
    journeyBarAngle = pathAngle * (1 - centerMove);
    journeyBarFlip = 0;
    travelPop = Math.sin(centerMove * Math.PI) * .18;
  }

  let barScale = (compactStory ? .4 : .46) + barGrowth * (compactStory ? .29 : .3) + chew * .025;
  if (storyProgress < .08) {
    barScale = compactStory ? .3 : .4;
  } else if (storyProgress < .025) {
    barScale = compactStory ? .32 : .42;
  }
  if (storyProgress >= .925) barScale = (compactStory ? .66 : .74) + powerUp * .11 + travelPop * .05;

  const storyStyle = {
    '--story-progress': storyProgress,
    '--intro-visible': introVisible,
    '--why-visible': whyVisible,
    '--ingredient-visible': ingredientVisible,
    '--shop-visible': shopVisible,
    '--how-visible': howVisible,
    '--campus-visible': campusVisible,
    '--wholesale-visible': wholesaleVisible,
    '--faq-visible': faqVisible,
    '--footer-visible': footerVisible,
    '--bar-growth': barGrowth,
    '--finale': finaleProgress,
    '--chew': chew,
    '--mouth-open': Math.max(mouthOpen, chew * .72),
    '--swallow': swallow,
    '--bar-x': `${journeyBarX}%`,
    '--bar-y': `${journeyBarY}%`,
    '--camera-y': `${cameraY}vh`,
    '--bar-angle': `${journeyBarAngle}deg`,
    '--bar-scale': barScale,
    '--bar-flip': `${journeyBarFlip}deg`,
    '--bar-vibrate': barVibrate,
    '--mascot-visible': ingredientLayerActive ? mascotVisible : 0,
    '--track-progress': pathProgress,
    '--power-up': powerUp,
    '--power-pulse': powerPulse,
    '--shop-flight': shopFlight,
    '--pack-reveal': clamp((finaleProgress - .68) / .14),
  } as CSSProperties;

  return (
    <main className={styles.page}>
    <header className={`${styles.header} ${navTheme === 'light' ? styles.headerOnLight : styles.headerOnDark} ${loading ? styles.isLoading : styles.heroReady}`}>
      <Link className={styles.logo} href="/" aria-label="ActivBite home">
        <Image className={styles.logoWhite} src="/optimized/ab-logo.webp" alt="ActivBite" width={640} height={640} priority />
        <Image className={styles.logoOrange} src="/PNG/LOGO_ORANGE.png" alt="" width={640} height={640} priority />
      </Link>
      <nav className={mobileOpen ? styles.mobileOpen : ''} aria-label="Main navigation">
        {PUBLIC_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={'highlighted' in link ? styles.shopAction : undefined}
            onClick={() => setMobileOpen(false)}
          >
            {'highlighted' in link && <ShoppingBag size={17} aria-hidden="true" />}
            {link.label}
          </Link>
        ))}
      </nav>
      <button className={styles.menuButton} type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen((open) => !open)}>
        {mobileOpen ? <X /> : <Menu />}
      </button>
    </header>
    <section data-nav-theme="dark" className={`${styles.hero} ${loading ? styles.isLoading : styles.heroReady}`} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
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
      <div className={styles.ingredientRain} aria-hidden="true">
        {heroRainIngredients.map((ingredient, index) => (
          <span
            key={`${ingredient.src}-${index}`}
            style={{
              '--rain-x': ingredient.x,
              '--rain-size': ingredient.size,
              '--rain-delay': ingredient.delay,
              '--rain-duration': ingredient.duration,
              '--rain-drift': ingredient.drift,
              '--rain-rotate': ingredient.rotate,
            } as CSSProperties}
          >
            <Image src={ingredient.src} alt="" width={96} height={96} />
          </span>
        ))}
      </div>
      <section className={styles.intro}>
        <h1 aria-label="Morning Fuel">{heroTitle.map((letter, index) => <span key={`${letter}-${index}`}>{letter === ' ' ? '\u00A0' : letter}</span>)}</h1>
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
        <Link href="/shop" className={styles.buyButton} onClick={hideJourneyBeforeRouteChange}>
          <ShoppingCart aria-hidden="true" /> <span>Buy Now</span>
        </Link>
      </section>

    </section>

    <section ref={storyRef} className={styles.scrollStory} id="how-it-works" style={storyStyle} aria-label="How ActivBite is made">
      <div className={styles.storySticky}>
        <div className={styles.storyTexture} aria-hidden="true" />
        <div className={styles.scrollCue}><span>Scroll to follow</span><i>↓</i></div>

        <div ref={journeyLayerRef} className={`${styles.journeyMascotLayer} ${ingredientLayerActive ? styles.ingredientLayerActive : styles.ingredientLayerInactive} ${powerUp > .04 ? styles.mascotFlexing : ''} ${powerUp > .94 ? styles.mascotPowered : ''}`} aria-hidden="true">
          <svg className={`${styles.pathTrack} ${styles.pathTrackDesktop}`} viewBox="0 0 100 350" preserveAspectRatio="none">
            <path className={styles.pathTrackShadow} d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
            <path className={styles.pathTrackBase} d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
            <path className={styles.pathTrackProgress} pathLength="1" d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
          </svg>
          <svg className={`${styles.pathTrack} ${styles.pathTrackMobile}`} viewBox="0 0 100 350" preserveAspectRatio="none">
            <path className={styles.pathTrackShadow} d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
            <path className={styles.pathTrackBase} d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
            <path className={styles.pathTrackProgress} pathLength="1" d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
          </svg>
          <div className={styles.eatingStage}>
            <div className={styles.barAura} />
            <Image className={`${styles.powerArm} ${styles.powerArmLeft}`} src="/PNG/BICEPS.png" alt="" width={1256} height={1256} unoptimized />
            <div className={styles.barCharacter}>
              <Image src="/optimized/product-packaging.webp" alt="" width={1600} height={887} priority />
              <div className={styles.face}>
                <i className={styles.eye} />
                <i className={styles.mouth}>
                  <Image className={styles.mouthMorsel} src={storyIngredients[activeIngredient].src} alt="" width={80} height={80} unoptimized />
                  <b />
                </i>
              </div>
              <div className={styles.cheek} />
              <div className={styles.biteCrumbs}>{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
              <span className={styles.nomBubble}>NOM!</span>
            </div>
            <Image className={`${styles.powerArm} ${styles.powerArmRight}`} src="/PNG/BICEPS.png" alt="" width={1256} height={1256} unoptimized />
          </div>
        </div>

        <div className={styles.storyTopline} aria-hidden="true">
          <span>01 — Real ingredients</span>
          <div><i style={{ transform: `scaleX(${Math.min(1, storyProgress / .8)})` }} /></div>
          <span>02 — Pick your pack</span>
        </div>

        <svg className={`${styles.pathTrack} ${styles.pathTrackDesktop}`} viewBox="0 0 100 350" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.pathTrackShadow} d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
          <path className={styles.pathTrackBase} d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
          <path className={styles.pathTrackProgress} pathLength="1" d="M75 20 C61 25 42 37 34 55 C30 70 31 85 38 100 C42 115 39 130 32 145 C28 160 30 175 36 190 C40 205 38 220 33 235 C29 250 31 265 37 280 C40 295 38 310 34 325" />
        </svg>
        <svg className={`${styles.pathTrack} ${styles.pathTrackMobile}`} viewBox="0 0 100 350" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.pathTrackShadow} d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
          <path className={styles.pathTrackBase} d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
          <path className={styles.pathTrackProgress} pathLength="1" d="M72 20 C59 26 40 38 31 55 C27 70 28 85 35 100 C39 115 36 130 29 145 C25 160 27 175 34 190 C38 205 36 220 30 235 C26 250 28 265 35 280 C38 295 36 310 31 325" />
        </svg>

        <div id="ingredient-story" ref={ingredientRef} data-nav-theme="dark" className={styles.ingredientStory} aria-live="polite">
          <div className={styles.ingredientChapterChrome} aria-hidden="true">
            <div>
              <span>Inside every ActivBite</span>
              <b>{storyIngredients[activeIngredient].name}</b>
            </div>
            <ol>
              {storyIngredients.map((ingredient, index) => (
                <li className={index === activeIngredient ? styles.activeIngredientDot : ''} key={`dot-${ingredient.name}`} />
              ))}
            </ol>
          </div>
          <header className={styles.ingredientArchiveHeader}>
            <span>Inside every ActivBite</span>
            <h2>Familiar stuff.<br /><em>Breakfast energy.</em></h2>
            <p>Seven recognisable ingredients. Nothing hidden behind complicated language.</p>
          </header>
          <div className={styles.ingredientArchive}>
            {storyIngredients.map((ingredient, index) => (
              <article className={`${styles.ingredientArchiveItem} ${activeIngredient === index && ingredientVisible > .1 ? styles.ingredientArchiveActive : ''}`} key={`archive-${ingredient.name}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Image src={ingredient.src} alt={ingredient.name} width={300} height={300} unoptimized />
                <div>
                  <small>{ingredient.kicker}</small>
                  <h3>{ingredient.name}</h3>
                  <h4>{ingredient.title}</h4>
                  <p>{ingredient.body}</p>
                  <b><Check size={14} /> {ingredient.fact}</b>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.copyStack}>
            {storyIngredients.map((ingredient, index) => {
              const rawLocal = (ingredientProgress - (ingredientStart + index * ingredientSpan)) / ingredientSpan;
              const local = clamp(rawLocal);
              const entrance = index === 0 ? 1 : clamp((rawLocal + .08) / .2);
              const exit = clamp((1.08 - rawLocal) / .22);
              const visible = Math.min(entrance, exit);
              const checkpointPoint = getTrackPoint(ingredientCheckpoints[index], compactStory);
              const copyOnLeft = checkpointPoint.x > 50;
              return (
                <article
                  className={styles.ingredientCopy}
                  key={ingredient.name}
                  style={{
                    '--visible': visible,
                    left: copyOnLeft ? '6vw' : 'auto',
                    right: copyOnLeft ? 'auto' : '6vw',
                  } as CSSProperties}
                  aria-hidden={visible < .3}
                >
                  <span>{String(index + 1).padStart(2, '0')} / 07 · {ingredient.kicker}</span>
                  <h2>{ingredient.title}</h2>
                  <p>{ingredient.body}</p>
                  <div><Check size={15} /> {ingredient.fact}</div>
                </article>
              );
            })}
          </div>

          <div className={styles.ingredientFlight}>
            {storyIngredients.map((ingredient, index) => {
              const rawLocal = (ingredientProgress - (ingredientStart + index * ingredientSpan)) / ingredientSpan;
              const local = clamp(rawLocal);
              const arrival = smoothstep(local / .22);
              const eaten = clamp((local - .58) / .27);
              const startRotation = Number.parseFloat(ingredient.rotate);
              const point = getTrackPoint(ingredientCheckpoints[index], compactStory);
              const ingredientGrowth = .72 + arrival * .62;
              const ingredientScale = ingredientGrowth * (1 - eaten * .82);
              const centerY = point.y - cameraY;
              const originX = 50 + ingredient.side * (compactStory ? 24 : 18);
              const mouthX = point.x + (compactStory ? 15 : 11);
              const settledX = originX + (50 - originX) * arrival;
              const ingredientX = settledX + (mouthX - 50) * eaten;
              const originYOffset = Number.parseFloat(ingredient.y);
              const ingredientY = centerY
                + originYOffset * (1 - arrival)
                + Math.sin(local * Math.PI * 3) * (1 - eaten) * 1.25;
              const flightStyle = {
                left: `${ingredientX}%`,
                top: `${ingredientY}%`,
                opacity: (rawLocal >= 0 && rawLocal < .96 ? arrival : 0) * (1 - clamp((eaten - .78) / .22)),
                '--arrival': arrival,
                '--eaten': eaten,
                transform: `translate(-50%,-50%) scale(${ingredientScale}) rotate(${startRotation * (1 - arrival) + eaten * 18}deg)`,
              } as CSSProperties;
              return (
                <figure className={styles.flyingIngredient} style={flightStyle} key={ingredient.name}>
                  <Image src={ingredient.src} alt="" width={300} height={300} unoptimized />
                  <figcaption>{ingredient.name}</figcaption>
                </figure>
              );
            })}
          </div>

          <div className={styles.growthMeter} aria-hidden="true">
            <span>Building your breakfast</span>
            <div><i style={{ transform: `scaleX(${barGrowth})` }} /></div>
            <b>{Math.min(7, Math.max(0, Math.floor(ingredientProgress / ingredientSpan)))} / 7</b>
          </div>
          <small className={styles.allergenNote}>Contains peanuts. Please check allergens before consuming.</small>
        </div>

        <section ref={powerFinaleRef} data-nav-theme="dark" className={styles.powerUpChapter} aria-label="ActivBite fully fuelled">
        </section>

        <SectionTicker items={tickerCopy.powered} order={10} />

        <section data-nav-theme="light" className={`${styles.packFinale} ${shopVisible > .8 && finaleProgress > .8 ? styles.packFinaleReady : ''}`} aria-labelledby="pack-finale-title">
          <div className={styles.powerFinale} aria-hidden="true">
            <div className={styles.powerBurst} />
            <span>FULLY FUELLED!</span>
          </div>
          <div className={styles.finaleHeading}>
            <h2 id="pack-finale-title">CHOOSE YOUR<br /><em>BREAKFAST STACK.</em></h2>
            <p>Start small or stock up. Pack of 30 gives the best value.</p>
          </div>

          <div className={styles.packGrid} role="radiogroup" aria-label="Choose a pack size">
            {landingPacks.map((pack) => (
              <button
                type="button"
                role="radio"
                aria-checked={selectedPack === pack.count}
                className={selectedPack === pack.count ? styles.selectedLandingPack : ''}
                onClick={() => setSelectedPack(pack.count)}
                key={pack.count}
              >
                {pack.count === 30 && <small><Crown size={14} /><span>Best value</span></small>}
                <Image src={pack.image} alt={`ActivBite pack of ${pack.count}`} width={720} height={540} unoptimized />
                <span className={styles.packPriceRow}>
                  <b>Pack of {pack.count}</b>
                  <em><strong>{pack.price}</strong><small>{pack.offer}</small></em>
                </span>
                <i><Check size={16} /></i>
              </button>
            ))}
          </div>

          <Link className={styles.shopFinaleButton} href={`/shop?pack=${selectedPack}`} onClick={hideJourneyBeforeRouteChange}>
            <ShoppingCart size={22} />
            <span><small>Selected pack</small><b>Pack of {selectedPack} · {selectedPackDetails.price}</b></span>
            <ArrowRight size={21} />
          </Link>
        </section>

        <SectionTicker items={tickerCopy.shop} order={4} />

        <section
          data-nav-theme="light"
          className={`${styles.journeyPanel} ${styles.productIntroPanel}`}
        >
          <div className={styles.panelCopy}>
            <h2>One bar.<br /><em>Real breakfast energy.</em></h2>
            <p>ActivBite is built with familiar ingredients like oats, peanuts, sattu, dates, poha, jaggery, elaichi, and chocolate—made for students who need something quick, filling, and easy to carry.</p>
            <p className={styles.supportingCopy}>It brings the comfort of a familiar Indian breakfast into a format that fits between an early lecture, a packed commute, or a morning when there is simply no time to sit down.</p>
            <Link className={styles.panelButton} href="/shop" onClick={hideJourneyBeforeRouteChange}>Explore packs <ArrowRight size={19} /></Link>
          </div>
          <div className={styles.nutritionCards} aria-label="Nutrition highlights">
            <div><Zap /><b>300</b><span>kcal</span></div>
            <div><BicepsFlexed /><b>9.3g</b><span>protein</span></div>
            <div><Leaf /><b>6.5g</b><span>fibre</span></div>
          </div>
        </section>

        <SectionTicker items={tickerCopy.intro} order={2} />

        <section
          data-nav-theme="dark"
          className={`${styles.journeyPanel} ${styles.whyPanel}`}
        >
          <div className={styles.panelHeading}>
            <span>Why ActivBite</span>
            <h2>Made for mornings<br /><em>that don’t wait.</em></h2>
            <p className={styles.sectionLead}>Breakfast should work with your schedule—not become another task. ActivBite is designed to be practical, satisfying, and genuinely easy to carry through a busy day.</p>
          </div>
          <div className={styles.benefitGrid}>
            <article><Utensils /><b>Quick to eat</b><p>Open, bite, and move. No plate, preparation, washing up, or extra morning planning.</p></article>
            <article><Backpack /><b>Campus friendly</b><p>Made to travel easily from hostel to class, library, lab, gym, or the road home.</p></article>
            <article><Sparkles /><b>Familiar ingredients</b><p>Peanuts, sattu, and oats form the protein-forward core, rounded out with familiar Indian flavours.</p></article>
            <article><Zap /><b>A substantial bite</b><p>Each bar provides 300 kcal, with 9.3g protein and 6.5g fibre for a more satisfying breakfast.</p></article>
          </div>
        </section>

        <SectionTicker items={tickerCopy.why} order={6} />

        <section
          data-nav-theme="dark"
          className={`${styles.journeyPanel} ${styles.howPanel}`}
        >
          <div className={styles.panelHeading}><span>How it works</span><h2>Order. Pay.<br /><em>Track.</em></h2><p className={styles.sectionLead}>Three quick moves from choosing your packs to receiving your tracking ID.</p></div>
          <div className={styles.stepsJourney}>
            <article><i>01</i><PackageCheck /><b>Build your stack</b><p>Mix any pack sizes you need.</p></article>
            <article><i>02</i><MapPin /><b>Add delivery details</b><p>Tell us where to meet you on campus.</p></article>
            <article><i>03</i><CreditCard /><b>Pay and track</b><p>Confirm UPI payment and follow your order.</p></article>
          </div>
        </section>

        <SectionTicker items={tickerCopy.steps} order={12} />

        <section
          data-nav-theme="light"
          className={`${styles.journeyPanel} ${styles.campusPanel}`}
        >
          <figure className={styles.campusVisual}>
            <Image src="/PNG/NITK.png" alt="Aerial view of the NITK Surathkal campus" width={1414} height={1000} unoptimized />
            <figcaption><MapPin size={16} /> NITK, Surathkal</figcaption>
          </figure>
          <div className={styles.panelCopy}>
            <span>Campus delivery</span>
            <h2>Launching first<br /><em>at NITK.</em></h2>
            <p>ActivBite is starting with free delivery inside National Institute of Technology Karnataka campus.</p>
            <p className={styles.supportingCopy}>Our campus-first launch helps us keep delivery simple, learn directly from students, and build a breakfast experience around real college routines before expanding further.</p>
            <small>Wrong, missing, damaged, or broken-seal issues must be reported during delivery.</small>
            <Link className={styles.panelButton} href="/shop">Order for campus <ArrowRight size={19} /></Link>
          </div>
        </section>

        <SectionTicker items={tickerCopy.campus} order={14} />

        <section
          data-nav-theme="dark"
          className={`${styles.journeyPanel} ${styles.wholesalePanel}`}
        >
          <div className={styles.panelCopy}>
            <span><Store size={17} /> Wholesale</span>
            <h2>Want ActivBite for<br /><em>your shop or café?</em></h2>
            <p>Campus stores, cafés, canteens, and local retailers can send a wholesale enquiry directly from the website.</p>
            <p className={styles.supportingCopy}>Tell us about your outlet, expected quantity, and preferred contact details. Our team will follow up to discuss availability, pricing, and the right starting order.</p>
            <Link className={styles.panelButton} href="/wholesale">Send wholesale enquiry <ArrowRight size={19} /></Link>
          </div>
          <figure className={styles.wholesaleImage}>
            <span className={`${styles.shopSticker} ${styles.shopStickerOne}`}>Campus favourite!</span>
            <span className={`${styles.shopSticker} ${styles.shopStickerTwo}`}>Snack stop →</span>
            <Image
              src="/PNG/SHOP.png"
              alt="An ActivBite branded neighbourhood shop display"
              width={1536}
              height={1024}
              unoptimized
              sizes="(max-width: 700px) 88vw, 48vw"
            />
            <figcaption><Store size={17} /> ActivBite, ready for your shelves.</figcaption>
          </figure>
        </section>

        <SectionTicker items={tickerCopy.wholesale} order={16} />

        <section
          data-nav-theme="light"
          className={`${styles.journeyPanel} ${styles.faqPanel}`}
        >
          <div className={styles.panelHeading}><span>FAQ preview</span><h2>Quick answers<br /><em>before you bite.</em></h2><p className={styles.sectionLead}>Everything important about delivery, payment, pack value, and ordering—explained before you check out.</p></div>
          <div className={styles.faqList}>
            <article><CircleHelp /><div><b>Where do you deliver?</b><p>Currently, ActivBite delivers first inside NITK campus.</p></div></article>
            <article><CircleHelp /><div><b>How do I pay?</b><p>After checkout, scan the UPI QR and submit your transaction/reference ID.</p></div></article>
            <article><CircleHelp /><div><b>Which pack is best value?</b><p>Pack of 30 gives ₹201 off and is the best deal.</p></div></article>
            <Link href="/faq">View all FAQs <ArrowRight size={18} /></Link>
          </div>
        </section>

        <SectionTicker items={tickerCopy.faq} order={18} />

        <footer
          data-nav-theme="dark"
          className={`${styles.journeyPanel} ${styles.journeyFooter}`}
        >
          <div className={styles.footerBrand}>
            <Image src="/PNG/LOGO_ORANGE.png" alt="ActivBite" width={640} height={640} />
            <p>Real breakfast energy for busy mornings, campus runs, and everything in between.</p>
            <div><span>300 kcal</span><span>9.3g protein</span><span>6.5g fibre</span></div>
          </div>
          <div className={styles.footerCta}>
            <h2>Breakfast,<br /><em>activated.</em></h2>
            <Link href="/shop" onClick={hideJourneyBeforeRouteChange}>Choose your pack <ArrowRight size={20} /></Link>
          </div>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link href="/shop" onClick={hideJourneyBeforeRouteChange}>Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/wholesale">Wholesale</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/order-status">Track order</Link>
          </nav>
          <aside className={styles.footerSocialBlock} aria-label="ActivBite social profiles">
            <span>Follow ActivBite</span>
            <div className={styles.footerSocials}>
              <a href="https://www.instagram.com/activbite/" target="_blank" rel="noreferrer" aria-label="ActivBite on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="2.2"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor"/></svg><b>Instagram</b></a>
              <a href="https://in.linkedin.com/in/shaunwin-royce" target="_blank" rel="noreferrer" aria-label="ActivBite on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.5" fill="currentColor"/><circle cx="7" cy="8" r="1.35" fill="#2d1b10"/><path d="M5.8 10.2h2.4V18H5.8zm4.1 0h2.3v1.05c.65-.82 1.55-1.34 2.8-1.34 2.25 0 3.2 1.47 3.2 3.86V18h-2.45v-3.73c0-1.12-.22-2.16-1.57-2.16-1.5 0-1.83 1.13-1.83 2.72V18H9.9z" fill="#2d1b10"/></svg><b>LinkedIn</b></a>
            </div>
          </aside>
          <div className={styles.footerBottom}>
            <a className={styles.footerContact} href="mailto:support@activbite.com"><Mail /><span><small>Questions or order help?</small><strong>support@activbite.com</strong></span></a>
            <div><Link href="/terms">Terms</Link><Link href="/privacy-policy">Privacy</Link></div>
            <small>© 2026 ActivBite · Made for mornings that move.</small>
          </div>
        </footer>
      </div>
    </section>

    </main>
  );
}
