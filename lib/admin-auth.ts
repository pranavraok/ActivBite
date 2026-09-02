import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'activbite_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const getSessionSecret = () => process.env.ADMIN_SESSION_SECRET?.trim() || '';

const sign = (expiresAt: string) =>
  createHmac('sha256', getSessionSecret()).update(expiresAt).digest('base64url');

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export const adminAuthIsConfigured = () =>
  Boolean(
    process.env.ADMIN_EMAIL?.trim() &&
      process.env.ADMIN_PASSWORD &&
      getSessionSecret()
  );

export const adminCredentialsMatch = (email: string, password: string) => {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || '';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';

  return (
    adminAuthIsConfigured() &&
    safeEqual(email.trim().toLowerCase(), expectedEmail) &&
    safeEqual(password, expectedPassword)
  );
};

export const createAdminSessionToken = () => {
  const expiresAt = String(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
};

export const verifyAdminSessionToken = (token?: string | null) => {
  if (!token || !adminAuthIsConfigured()) return false;

  const [expiresAt, signature, ...rest] = token.split('.');
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;

  return safeEqual(signature, sign(expiresAt));
};
