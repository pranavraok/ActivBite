'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Rocket,
  Send,
  ShieldCheck,
  Soup,
  Sunrise,
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

const FIELD_LABELS: Record<keyof ContactForm, string> = {
  fullName: 'Name',
  phone: 'Phone',
  email: 'Email',
  location: 'Campus / area',
  topic: 'Message topic',
  message: 'Message',
  consent: 'Confirmation checkbox',
};

export default function ContactExperience() {
  const [form, setForm] = useState<ContactForm>(STARTING_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof ContactForm>(
    field: Field,
    value: ContactForm[Field]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
  };

  const validate = () => {
    const nextErrors: ContactErrors = {};
    const cleanedPhone = form.phone.replace(/\D/g, '');

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your name.';
    }

    if (!PHONE_PATTERN.test(cleanedPhone)) {
      nextErrors.phone = 'Please enter a valid 10 digit phone number.';
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (form.location.trim().length < 2) {
      nextErrors.location = 'Please enter your campus, hostel, shop, or area.';
    }

    if (!form.topic) {
      nextErrors.topic = 'Please choose what your message is about.';
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Please enter your message.';
    }

    if (!form.consent) {
      nextErrors.consent = 'Please allow the ActivBite team to contact you.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      const fieldsToCheck = (Object.keys(nextErrors) as Array<keyof ContactForm>)
        .map((field) => FIELD_LABELS[field])
        .join(', ');
      setErrors({
        ...nextErrors,
        submit: `Please check: ${fieldsToCheck}.`,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setIsTakingLonger(false);
    const slowRequestTimer = window.setTimeout(() => setIsTakingLonger(true), 5000);

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
        throw new Error(data.message || 'Could not send your message right now.');
      }

      setForm(STARTING_FORM);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Could not send your message right now.',
      });
    } finally {
      window.clearTimeout(slowRequestTimer);
      setIsTakingLonger(false);
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
          <p className={styles.eyebrow}>Contact ActivBite</p>
          <h1>
            Talk to us. <span>We’re listening.</span>
          </h1>
          <p className={styles.lead}>
            Order question, delivery issue, product feedback, or a fresh idea —
            tell us what happened and we’ll help you take the next step.
          </p>

          <div className={styles.supportList} aria-label="ActivBite support details">
            <Link href="mailto:support@activbite.com">
              <Mail size={20} aria-hidden="true" />
              <span>
                <small>Email</small>
                <strong>support@activbite.com</strong>
              </span>
            </Link>
            <div>
              <Clock3 size={20} aria-hidden="true" />
              <span>
                <small>Response time</small>
                <strong>Usually within one working day</strong>
              </span>
            </div>
            <div>
              <ShieldCheck size={20} aria-hidden="true" />
              <span>
                <small>Delivery support</small>
                <strong>Report pack issues during delivery</strong>
              </span>
            </div>
          </div>
        </div>

        <section className={styles.formCard} aria-label="Contact ActivBite form">
          <div className={styles.formHeading}>
            <div>
              <p>Message desk</p>
              <h2>Tell us what’s up.</h2>
            </div>
            <span>2 min</span>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            <fieldset className={styles.topicFieldset}>
              <legend>What is this about?</legend>
              <div className={styles.topicGrid}>
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={form.topic === topic ? styles.activeTopic : undefined}
                    onClick={() => updateField('topic', topic)}
                    aria-pressed={form.topic === topic}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              {errors.topic && <small>{errors.topic}</small>}
            </fieldset>

            <div className={styles.formGrid}>
              <label>
                Name
                <input
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
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
                  aria-invalid={Boolean(errors.phone)}
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
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label>
                Campus / area
                <input
                  value={form.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  placeholder="Hostel, campus, shop, or city"
                  aria-invalid={Boolean(errors.location)}
                />
                {errors.location && <small>{errors.location}</small>}
              </label>

              <label className={styles.fullWidth}>
                Message
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Share the details so we can help quickly."
                  rows={3}
                  aria-invalid={Boolean(errors.message)}
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

            {errors.consent && (
              <p className={styles.formError} role="alert">
                {errors.consent}
              </p>
            )}
            {errors.submit && (
              <p className={styles.formError} role="alert">
                {errors.submit}
              </p>
            )}

            <button type="submit" className={styles.sendButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Sending message...
                </>
              ) : (
                <>
                  Send message
                  <Send size={20} aria-hidden="true" />
                </>
              )}
            </button>

            {isSubmitting && (
              <p
                className={`${styles.submitStatus} ${
                  isTakingLonger ? styles.submitStatusSlow : ''
                }`}
                role="status"
                aria-live="polite"
              >
                {isTakingLonger
                  ? 'Still saving securely. Please keep this page open — we’re almost done.'
                  : 'Saving your message securely to Google Sheets…'}
              </p>
            )}
          </form>
        </section>
      </section>

      <section className={styles.bottomStrip} data-nav-theme="light" aria-label="ActivBite promise">
        <span><Sunrise size={32} /> ONE BAR.</span>
        <span><Soup size={32} /> REAL BREAKFAST.</span>
        <span><Rocket size={32} fill="currentColor" /> ZERO MORNING DRAMA.</span>
      </section>

      {isSubmitted && (
        <div className={styles.successModalBackdrop}>
          <section
            className={styles.successModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-confirmation-title"
          >
            <CheckCircle2 size={58} aria-hidden="true" />
            <p>Message sent successfully</p>
            <h2 id="contact-confirmation-title">Your message is confirmed.</h2>
            <div className={styles.confirmationCopy}>
              <MessageCircle size={19} aria-hidden="true" />
              <span>We received your details and will get back to you soon.</span>
            </div>
            <button
              type="button"
              className={styles.doneButton}
              onClick={() => setIsSubmitted(false)}
              autoFocus
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
