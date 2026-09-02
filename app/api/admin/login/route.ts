import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  adminAuthIsConfigured,
  adminCredentialsMatch,
  createAdminSessionToken,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!adminAuthIsConfigured()) {
    return NextResponse.json(
      { message: 'Admin login is not configured yet.' },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!adminCredentialsMatch(email, password)) {
    return NextResponse.json(
      { message: 'Incorrect email or password.' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ message: 'Signed in successfully.' });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
