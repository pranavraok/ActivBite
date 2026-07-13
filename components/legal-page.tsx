import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  FileText,
  Mail,
  MapPin,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Sunrise,
} from 'lucide-react';
import styles from './legal-page.module.css';

export type LegalQuickCard = {
  label: string;
  value: string;
};

export type LegalSection = {
  title: string;
  body: ReactNode;
  highlight?: boolean;
};

type LegalPageProps = {
  title: string;
  intro: string;
  lastUpdated: string;
  quickCards: LegalQuickCard[];
  sections: LegalSection[];
  activeLabel: string;
  alternateHref: string;
  alternateLabel: string;
};

export default function LegalPage({
  title,
  intro,
  lastUpdated,
  quickCards,
  sections,
  activeLabel,
  alternateHref,
  alternateLabel,
}: LegalPageProps) {
  return (
    <main className={styles.legalPage}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="ActivBite home">
          <Image
            src="/optimized/ab-logo.webp"
            alt="ActivBite"
            width={640}
            height={640}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Legal navigation">
          <Link href="/shop" className={styles.navLink}>
            <ArrowLeft size={17} />
            Shop
          </Link>
          <Link href={alternateHref} className={styles.navLink}>
            <FileText size={17} />
            {alternateLabel}
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ActivBite legal</p>
          <h1>{title}</h1>
          <p className={styles.heroText}>{intro}</p>
          <div className={styles.heroMeta}>
            <span><ShieldCheck size={18} /> Clear customer terms</span>
            <span><MapPin size={18} /> NITK campus first</span>
            <span><ShoppingBag size={18} /> Breakfast bar orders</span>
          </div>
        </div>

        <aside className={styles.heroCard} aria-label={`${activeLabel} summary`}>
          <div className={styles.heroCardTop}>
            <span>Current document</span>
            <strong>{activeLabel}</strong>
          </div>
          <div className={styles.heroCardBody}>
            <div>
              <span>Last updated</span>
              <strong>{lastUpdated}</strong>
            </div>
            <div>
              <span>Support</span>
              <strong>support@activbite.com</strong>
            </div>
            <div>
              <span>Business location</span>
              <strong>Kundapura, Karnataka, India</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.contentWrap}>
        <aside className={styles.sidePanel} aria-label="Helpful legal summary">
          <p className={styles.sideTitle}>At a glance</p>
          <ul className={styles.sideList}>
            <li>ActivBite is a registered partnership firm.</li>
            <li>First launch deliveries are for NITK campus.</li>
            <li>Issues must be reported during delivery for packaged food orders.</li>
            <li>UPI QR payments are manually verified until a gateway is active.</li>
          </ul>
          <div className={styles.sideDivider} />
          <div className={styles.sideActions}>
            <Link href="/shop" className={styles.primaryAction}>
              Back to shop
            </Link>
            <Link href={alternateHref} className={styles.secondaryAction}>
              {alternateLabel}
            </Link>
          </div>
        </aside>

        <article className={styles.article}>
          <div className={styles.quickCards}>
            {quickCards.map((card) => (
              <div key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>

          <div className={styles.sections}>
            {sections.map((section, index) => (
              <section
                key={section.title}
                className={section.highlight ? styles.highlightSection : styles.section}
              >
                <span className={styles.sectionNumber}>{index + 1}</span>
                <div>
                  <h2>{section.title}</h2>
                  <div className={styles.sectionBody}>{section.body}</div>
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>

      <footer className={styles.pageFooter}>
        <p>
          Questions about {activeLabel.toLowerCase()}? Write to{' '}
          <a href="mailto:support@activbite.com">
            <Mail size={14} aria-hidden="true" /> support@activbite.com
          </a>
        </p>
        <div>
          <Link href="/shop">Shop</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy-policy">Privacy</Link>
        </div>
      </footer>

      <section className={styles.bottomStrip} aria-label="ActivBite promise">
        <span><Sunrise size={34} /> ONE BAR.</span>
        <span><Soup size={34} /> REAL BREAKFAST.</span>
        <span><Rocket size={34} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>
    </main>
  );
}
