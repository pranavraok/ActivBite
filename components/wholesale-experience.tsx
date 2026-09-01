'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  PackageCheck,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Soup,
  Store,
  Sunrise,
  Truck,
} from 'lucide-react';
import styles from './wholesale-experience.module.css';
import PublicHeader from './public-header';

type WholesaleForm = {
  shopName: string;
  contactName: string;
  phone: string;
  email: string;
  shopType: string;
  location: string;
  monthlyRequirement: string;
  preferredPack: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof WholesaleForm | 'submit', string>>;

const INITIAL_FORM: WholesaleForm = {
  shopName: '',
  contactName: '',
  phone: '',
  email: '',
  shopType: '',
  location: '',
  monthlyRequirement: '',
  preferredPack: 'Mixed packs',
  message: '',
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

const benefits = [
  {
    icon: Store,
    title: 'Made for fast counters',
    text: 'Single breakfast bar format that is easy to display, explain, and move quickly.',
  },
  {
    icon: PackageCheck,
    title: 'Pack options ready',
    text: 'Starter, routine, and power packs are already structured for predictable stocking.',
  },
  {
    icon: Truck,
    title: 'Campus-first supply',
    text: 'Built around student demand, NITK delivery, and high-frequency breakfast needs.',
  },
];

export default function WholesaleExperience() {
  const [form, setForm] = useState<WholesaleForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof WholesaleForm>(
    field: Field,
    value: WholesaleForm[Field]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const cleanedPhone = form.phone.replace(/\D/g, '');

    if (form.shopName.trim().length < 2) {
      nextErrors.shopName = 'Please enter the shop or business name.';
    }

    if (form.contactName.trim().length < 2) {
      nextErrors.contactName = 'Please enter the contact person name.';
    }

    if (!PHONE_PATTERN.test(cleanedPhone)) {
      nextErrors.phone = 'Please enter a valid 10 digit phone number.';
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.shopType) {
      nextErrors.shopType = 'Please select the shop type.';
    }

    if (form.location.trim().length < 2) {
      nextErrors.location = 'Please enter the shop location.';
    }

    if (!form.monthlyRequirement) {
      nextErrors.monthlyRequirement = 'Please select an estimated requirement.';
    }

    if (!form.preferredPack) {
      nextErrors.preferredPack = 'Please select the preferred pack.';
    }

    if (!form.consent) {
      nextErrors.consent = 'Please confirm that we can contact you about this enquiry.';
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
      const response = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\D/g, ''),
          shopName: form.shopName.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          location: form.location.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not send the enquiry right now.');
      }

      setIsSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : 'Could not send the enquiry right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.wholesalePage} data-brand-page="wholesale">
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <PublicHeader />

      <section className={styles.hero} data-nav-theme="dark">
        <div className={styles.copy}>
          <h1>
            Stock breakfast. <span>Move mornings.</span>
          </h1>
          <p className={styles.intro}>
            For shops, cafes, canteens, gyms, and campus counters that want to stock
            ActivBite Breakfast Bars. Share your details and we’ll get back with
            availability, supply options, and wholesale next steps.
          </p>

          <div className={styles.benefits}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title}>
                  <Icon size={22} />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <section className={styles.formCard} aria-label="Wholesale enquiry form">
          {isSubmitted ? (
            <div className={styles.successCard}>
              <CheckCircle2 size={54} />
              <p className={styles.formEyebrow}>Enquiry sent</p>
              <h2>We got your wholesale request.</h2>
              <p>
                ActivBite will review your shop details and contact you soon with
                stocking options.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={styles.secondaryButton}
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <>
              <div className={styles.formHeading}>
                <div>
                  <p className={styles.formEyebrow}>Partner enquiry</p>
                  <h2>Tell us about your shop</h2>
                </div>
                <span>2 min</span>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.gridTwo}>
                  <label>
                    Shop / business name
                    <input
                      value={form.shopName}
                      onChange={(event) => updateField('shopName', event.target.value)}
                      placeholder="Eg: Campus Cafe"
                      autoComplete="organization"
                    />
                    {errors.shopName && <small>{errors.shopName}</small>}
                  </label>

                  <label>
                    Contact person
                    <input
                      value={form.contactName}
                      onChange={(event) => updateField('contactName', event.target.value)}
                      placeholder="Owner / manager name"
                      autoComplete="name"
                    />
                    {errors.contactName && <small>{errors.contactName}</small>}
                  </label>
                </div>

                <div className={styles.gridTwo}>
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
                      placeholder="shop@email.com"
                      type="email"
                      autoComplete="email"
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </label>
                </div>

                <div className={styles.gridTwo}>
                  <label>
                    Shop type
                    <select
                      value={form.shopType}
                      onChange={(event) => updateField('shopType', event.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="Campus store">Campus store</option>
                      <option value="Cafe or canteen">Cafe or canteen</option>
                      <option value="Gym or fitness center">Gym or fitness center</option>
                      <option value="Retail store">Retail store</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.shopType && <small>{errors.shopType}</small>}
                  </label>

                  <label>
                    Shop location
                    <input
                      value={form.location}
                      onChange={(event) => updateField('location', event.target.value)}
                      placeholder="Campus / area / city"
                    />
                    {errors.location && <small>{errors.location}</small>}
                  </label>
                </div>

                <div className={styles.gridTwo}>
                  <label>
                    Monthly requirement
                    <select
                      value={form.monthlyRequirement}
                      onChange={(event) =>
                        updateField('monthlyRequirement', event.target.value)
                      }
                    >
                      <option value="">Select quantity</option>
                      <option value="100-300 bars">100-300 bars</option>
                      <option value="300-750 bars">300-750 bars</option>
                      <option value="750-1500 bars">750-1500 bars</option>
                      <option value="1500+ bars">1500+ bars</option>
                    </select>
                    {errors.monthlyRequirement && (
                      <small>{errors.monthlyRequirement}</small>
                    )}
                  </label>

                  <label>
                    Preferred pack
                    <select
                      value={form.preferredPack}
                      onChange={(event) => updateField('preferredPack', event.target.value)}
                    >
                      <option value="Mixed packs">Mixed packs</option>
                      <option value="Pack of 5">Pack of 5</option>
                      <option value="Pack of 10">Pack of 10</option>
                      <option value="Pack of 20">Pack of 20</option>
                      <option value="Pack of 30">Pack of 30</option>
                      <option value="Loose bars / counter stock">Loose bars / counter stock</option>
                    </select>
                    {errors.preferredPack && <small>{errors.preferredPack}</small>}
                  </label>
                </div>

                <label>
                  Notes / requirement
                  <textarea
                    value={form.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    placeholder="Tell us expected launch date, delivery needs, or counter type."
                    rows={4}
                  />
                </label>

                <label className={styles.confirmRow}>
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => updateField('consent', event.target.checked)}
                  />
                  <span>
                    I confirm these details are correct and ActivBite may contact me
                    about wholesale supply.
                  </span>
                </label>
                {errors.consent && <p className={styles.formError}>{errors.consent}</p>}
                {errors.submit && <p className={styles.formError}>{errors.submit}</p>}

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className={styles.spinner} />
                      Sending enquiry...
                    </>
                  ) : (
                    <>
                      Send wholesale enquiry
                      <ArrowRight size={22} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </section>

      </section>

      <section className={styles.partnerStrip} data-nav-theme="dark">
        <div>
          <ShieldCheck size={20} />
          <span>Retail-friendly breakfast bar</span>
        </div>
        <div>
          <MapPin size={20} />
          <span>Campus-first operations</span>
        </div>
        <div>
          <Store size={20} />
          <span>Pack of 5, 10, 20, and 30</span>
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
