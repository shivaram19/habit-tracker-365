// Country to currency mapping
export const COUNTRY_CURRENCIES: Record<string, string> = {
  // Asia
  IN: 'INR', // India
  JP: 'JPY', // Japan
  CN: 'CNY', // China
  KR: 'KRW', // South Korea
  SG: 'SGD', // Singapore
  MY: 'MYR', // Malaysia
  TH: 'THB', // Thailand
  ID: 'IDR', // Indonesia
  PH: 'PHP', // Philippines
  VN: 'VND', // Vietnam
  PK: 'PKR', // Pakistan
  BD: 'BDT', // Bangladesh
  LK: 'LKR', // Sri Lanka
  NP: 'NPR', // Nepal
  AE: 'AED', // UAE
  SA: 'SAR', // Saudi Arabia
  
  // Europe
  GB: 'GBP', // United Kingdom
  DE: 'EUR', // Germany
  FR: 'EUR', // France
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  PT: 'EUR', // Portugal
  IE: 'EUR', // Ireland
  FI: 'EUR', // Finland
  GR: 'EUR', // Greece
  CH: 'CHF', // Switzerland
  SE: 'SEK', // Sweden
  NO: 'NOK', // Norway
  DK: 'DKK', // Denmark
  PL: 'PLN', // Poland
  CZ: 'CZK', // Czech Republic
  RU: 'RUB', // Russia
  UA: 'UAH', // Ukraine
  TR: 'TRY', // Turkey
  
  // Americas
  US: 'USD', // United States
  CA: 'CAD', // Canada
  MX: 'MXN', // Mexico
  BR: 'BRL', // Brazil
  AR: 'ARS', // Argentina
  CL: 'CLP', // Chile
  CO: 'COP', // Colombia
  PE: 'PEN', // Peru
  
  // Oceania
  AU: 'AUD', // Australia
  NZ: 'NZD', // New Zealand
  
  // Africa
  ZA: 'ZAR', // South Africa
  NG: 'NGN', // Nigeria
  EG: 'EGP', // Egypt
  KE: 'KES', // Kenya
  
  // Default
  DEFAULT: 'USD',
};

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  SGD: 'S$',
  MYR: 'RM',
  THB: '฿',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  BRL: 'R$',
  MXN: 'MX$',
  ZAR: 'R',
  AED: 'د.إ',
  SAR: '﷼',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  RUB: '₽',
  TRY: '₺',
};

export interface GeoLocation {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  timezone?: string;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
}

/**
 * Get user's location using a free geolocation API
 * Uses geojs.io which is free and doesn't require API key
 */
export async function fetchUserLocation(): Promise<GeoLocation | null> {
  try {
    // Try geojs.io first (free, no API key required)
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || '',
        countryCode: data.country_code || '',
        city: data.city || '',
        region: data.region || '',
        timezone: data.timezone || '',
      };
    }
  } catch (error) {
    console.warn('[GeoLocation] geojs.io failed, trying fallback...');
  }

  try {
    // Fallback to ip-api.com (free for non-commercial use)
    const response = await fetch('http://ip-api.com/json/?fields=country,countryCode,city,regionName,timezone');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || '',
        countryCode: data.countryCode || '',
        city: data.city || '',
        region: data.regionName || '',
        timezone: data.timezone || '',
      };
    }
  } catch (error) {
    console.warn('[GeoLocation] ip-api.com failed');
  }

  return null;
}

/**
 * Get currency code for a country
 */
export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCIES[countryCode.toUpperCase()] || COUNTRY_CURRENCIES.DEFAULT;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

/**
 * Get locale string for a country (used for Intl formatting)
 */
export function getLocaleForCountry(countryCode: string): string {
  const localeMap: Record<string, string> = {
    US: 'en-US',
    GB: 'en-GB',
    IN: 'en-IN',
    DE: 'de-DE',
    FR: 'fr-FR',
    JP: 'ja-JP',
    CN: 'zh-CN',
    BR: 'pt-BR',
    MX: 'es-MX',
    ES: 'es-ES',
    IT: 'it-IT',
    AU: 'en-AU',
    CA: 'en-CA',
  };
  
  return localeMap[countryCode.toUpperCase()] || navigator.language || 'en-US';
}

/**
 * Format a number as currency using Intl.NumberFormat
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'USD',
  locale?: string
): string {
  const effectiveLocale = locale || navigator.language || 'en-US';
  
  try {
    return new Intl.NumberFormat(effectiveLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Format currency with compact notation (e.g., $1.2K, $3.4M)
 */
export function formatCurrencyCompact(
  amount: number,
  currencyCode: string = 'USD',
  locale?: string
): string {
  const effectiveLocale = locale || navigator.language || 'en-US';
  
  try {
    return new Intl.NumberFormat(effectiveLocale, {
      style: 'currency',
      currency: currencyCode,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch (error) {
    const symbol = getCurrencySymbol(currencyCode);
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
    return `${symbol}${amount.toFixed(0)}`;
  }
}
