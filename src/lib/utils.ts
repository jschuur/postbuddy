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
