import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Backend uses naive UTC dates. This function ensures they are parsed correctly as UTC.
export function parseUTC(dateString: string): Date {
  if (!dateString) return new Date();
  // If the date string doesn't end with 'Z' and doesn't have a timezone offset, append 'Z'
  const hasTimezone = /(Z|[+-]\d{2}:\d{2})$/.test(dateString);
  const normalizedString = hasTimezone ? dateString : `${dateString}Z`;
  return new Date(normalizedString);
}
