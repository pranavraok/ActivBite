'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import styles from './admin-login.module.css';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.message || 'Could not sign in.');

      const nextPath = new URLSearchParams(window.location.search).get('next');
      window.location.href = nextPath?.startsWith('/admin') ? nextPath : '/admin';
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="ActivBite admin introduction">
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <Image
              src="/optimized/ab-logo.webp"
              alt="ActivBite"
              fill
              sizes="(max-width: 920px) 192px, 352px"
              priority
            />
          </div>
          <p className={styles.brandEyebrow}>Admin command centre</p>
          <h2>
            Keep mornings <span>moving.</span>
          </h2>
          <p className={styles.brandDescription}>
            One secure place to manage partner enquiries, orders, products, and
            everything behind the breakfast rush.
          </p>
          <div className={styles.brandChips} aria-label="Admin areas">
            <span>Wholesale enquiries</span>
            <span>Orders</span>
            <span>Stock</span>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.cardWrap}>
          <Link href="/" className={styles.homeLink}>
            <ArrowLeft size={16} /> Back to website
          </Link>

          <div className={styles.card}>
            <span className={styles.securityBadge}>
              <ShieldCheck size={15} /> Secure access
            </span>
            <p className={styles.formEyebrow}>Welcome back</p>
            <h1>Admin login</h1>
            <p className={styles.intro}>
              Sign in with your ActivBite admin credentials to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="admin-email">Email address</label>
                <div className={styles.inputWrap}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    {...register('email')}
                    id="admin-email"
                    type="email"
                    placeholder="admin@activbite.com"
                    autoComplete="username"
                    spellCheck={false}
                  />
                </div>
                {errors.email ? (
                  <p className={styles.fieldError}>{errors.email.message}</p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="admin-password">Password</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={18} className={styles.inputIcon} />
                  <input
                    {...register('password')}
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className={styles.visibilityButton}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className={styles.fieldError}>{errors.password.message}</p>
                ) : null}
              </div>

              {submitError ? (
                <p className={styles.submitError} role="alert">
                  {submitError}
                </p>
              ) : null}

              <button type="submit" disabled={isLoading} className={styles.submitButton}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Enter command centre <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <p className={styles.privacyNote}>
              <ShieldCheck size={13} /> Protected ActivBite team access only
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
