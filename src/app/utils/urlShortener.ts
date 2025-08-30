import { nanoid as id } from 'nanoid'
const nanoid = id(5)

export function generateShortCode(): string {
  return nanoid;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function buildShortUrl(code: string, baseUrl: string): string {
  return `${baseUrl}/${code}`;
}

export function buildAnalyticsUrl(code: string, baseUrl: string): string {
  return `${baseUrl}/analytics/${code}`;
}