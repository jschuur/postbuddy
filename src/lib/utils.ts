import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return String(error);
}

export const dateOrNull = (d: string) =>
  new Date(d).toString() !== 'Invalid Date' ? new Date(d) : null;

export function buildURL(path: string) {
  let base: string;

  if (typeof window !== 'undefined') {
    base = '';
  } else {
    const hostname = process.env.SITE_DOMAIN || process.env.VERCEL_URL;
    base = hostname ? `https://${hostname}` : 'http://localhost:3000';
  }

  return `${base}${path}`;
}

export const isAdmin = (session: Record<string, any> | null | undefined) =>
  Boolean(session?.admin) || Boolean(session?.user?.publicMetadata?.admin);
