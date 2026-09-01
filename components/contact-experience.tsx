'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Store,
  Sunrise,
  Truck,
  Zap,
} from 'lucide-react';
import styles from './contact-experience.module.css';
import PublicHeader from './public-header';

type ContactForm = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  topic: string;
  message: string;
  consent: boolean;
};

type ContactErrors = Partial<Record<keyof ContactForm | 'submit', string>>;

const TOPICS = [
  'Order help',
  'Delivery issue',
  'Product question',
  'Wholesale',
  'Collab / idea',
] as const;

const STARTING_FORM: ContactForm = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  topic: TOPICS[0],
  message: '',
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const supportCards = [
  {
    icon: Mail,
    label: 'Email',
    title: 'support@activbite.com',
    href: 'mailto:support@activbite.com',
    note: 'Best for order support, product questions, and feedback.',
  },
  {
    icon: MapPin,
    label: 'Launch campus',
    title: 'NITK first',
    note: 'Current delivery starts with National Institute of Technology Karnataka.',
  },
  {
    icon: Store,
    label: 'Wholesale',
    title: 'Shop/cafe enquiry',
    href: '/wholesale',
    note: 'For bulk supply, retail, canteen, or campus seller enquiries.',
  },
];

export default function ContactExperience() {
  const [form, setForm] = useState<ContactForm>(STARTING_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const signalMood = useMemo(() => {
    if (form.topic === 'Delivery issue') {
      return 'Priority ping';
    }

    if (form.topic === 'Wholesale') {
      return 'Bulk bite radar';
    }

    if (form.topic === 'Collab / idea') {
      return 'Big brain mode';
    }

    return 'Campus signal';
  }, [form.topic]);

  const updateField = <Field extends keyof ContactForm>(
    field: Field,
    value: ContactForm[Field]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
    setSuccessMessage('');
  };

  const validate = () => {
    const nextErrors: ContactErrors = {};
    const cleanedPhone = form.phone.replace(/\D/g, '');

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your name.';
    }

    if (!PHONE_PATTERN.test(cleanedPhone)) {
      nextErrors.phone = 'Enter a valid 10 digit phone number.';
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (form.location.trim().length < 2) {
      nextErrors.location = 'Tell us your hostel, campus, shop, or area.';
    }

    if (!form.topic) {
      nextErrors.topic = 'Pick the signal type.';
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = 'Add a little more detail.';
    }

    if (!form.consent) {
      nextErrors.consent = 'Please allow the team to contact you.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fullName: form.fullName.trim(),
          phone: form.phone.replace(/\D/g, ''),
          email: form.email.trim(),
          location: form.location.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not send the signal right now.');
      }

      setSuccessMessage(data.message || 'Signal received. The ActivBite team will contact you soon.');
      setForm(STARTING_FORM);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Could not send the signal right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.contactPage} data-brand-page="contact">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
        <div className={styles.copy}>
          <p className={styles.microText}>Campus desk · Human replies · No robot vibes</p>

          <h1>
            Send a
            <span>Signal.</span>
          </h1>

          <div className={styles.decorativeRule} aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <p className={styles.lead}>
            Order doubt? Delivery scene? Wholesale idea? Product feedback? Drop it
            here — the ActivBite team will pick it up.
          </p>

          <div className={styles.quickSignalGrid}>
            <span>
              <Phone size={18} />
              Real humans
            </span>
            <span>
              <Truck size={18} />
              Campus help
            </span>
            <span>
              <Zap size={18} />
              Fast pings
            </span>
          </div>
        </div>

        <aside className={styles.radarCard} aria-label="ActivBite contact radar">
          <div className={styles.radarTop}>
            <span>{signalMood}</span>
            <strong>ONLINE</strong>
          </div>

          <div className={styles.radarDial} aria-hidden="true">
            <span className={styles.ringOne} />
            <span className={styles.ringTwo} />
            <span className={styles.ringThree} />
            <i className={styles.radarDot} />
            <Image
              src="/optimized/product-packaging.webp"
              alt=""
              width={1600}
              height={887}
              sizes="(max-width: 900px) 70vw, 28vw"
              priority
            />
          </div>

          <div className={styles.chipCloud}>
            <span>Order support</span>
            <span>Delivery help</span>
            <span>Wholesale</span>
            <span>Ideas</span>
          </div>
        </aside>
      </section>

      <section className={styles.contactDock} data-nav-theme="light">
        <div className={styles.formIntro}>
          <div>
            <span>Signal console</span>
            <h2>Tell us what’s cooking.</h2>
          </div>
          <p>
            If it&apos;s urgent during delivery, report it then and there. For
            everything else, this desk works beautifully.
          </p>
        </div>

        <div className={styles.dockGrid}>
          <form className={styles.contactConsole} onSubmit={handleSubmit} noValidate>
            <div className={styles.topicGrid} aria-label="Choose message type">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className={form.topic === topic ? styles.activeTopic : undefined}
                  onClick={() => updateField('topic', topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
            {errors.topic && <small className={styles.topicError}>{errors.topic}</small>}

            <div className={styles.formGrid}>
              <label>
                Name
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
                {errors.fullName && <small>{errors.fullName}</small>}
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="9876543210"
                  inputMode="numeric"
                  autoComplete="tel"
                />
                {errors.phone && <small>{errors.phone}</small>}
              </label>

              <label>
                Email
                <input
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@email.com"
                  type="email"
                  autoComplete="email"
                />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label>
                Campus / area
                <input
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  placeholder="Eg: NITK hostel, shop, city"
                />
                {errors.location && <small>{errors.location}</small>}
              </label>

              <label className={styles.fullWidth}>
                Message
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Tell us the scene..."
                  rows={5}
                />
                {errors.message && <small>{errors.message}</small>}
              </label>
            </div>

            <label className={styles.consentRow}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => updateField('consent', event.target.checked)}
              />
              <span>
                I confirm these details are correct and ActivBite may contact me
                about this message.
              </span>
            </label>
            {errors.consent && <p className={styles.checkboxError}>{errors.consent}</p>}

            {errors.submit && (
              <p className={styles.submitError} role="alert">
                {errors.submit}
              </p>
            )}

            {successMessage && (
              <p className={styles.successPanel} role="status">
                <CheckCircle2 size={19} />
                {successMessage}
              </p>
            )}

            <button type="submit" className={styles.sendButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Sending signal...
                </>
              ) : (
                <>
                  Send signal
                  <Send size={20} />
                </>
              )}
            </button>
          </form>

          <aside className={styles.directGrid} aria-label="Direct contact details">
            {supportCards.map(({ icon: Icon, label, title, href, note }) => {
              const content = (
                <>
                  <div className={styles.directIcon}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <span>{label}</span>
                    <strong>{title}</strong>
                    <p>{note}</p>
                  </div>
                  {href && <ArrowRight size={18} />}
                </>
              );

              return href ? (
                <Link key={label} href={href} className={styles.directCard}>
                  {content}
                </Link>
              ) : (
                <div key={label} className={styles.directCard}>
                  {content}
                </div>
              );
            })}

            <div className={styles.promiseCard}>
              <ShieldCheck size={22} />
              <div>
                <strong>Food issue rule</strong>
                <p>
                  Wrong, missing, damaged, or broken-seal pack issues should be
                  reported during delivery.
                </p>
              </div>
            </div>
          </aside>
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
