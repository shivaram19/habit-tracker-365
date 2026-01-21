import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  fetchUserLocation,
  getCurrencyForCountry,
  getCurrencySymbol,
  getLocaleForCountry,
  formatCurrency,
  formatCurrencyCompact,
} from '../utils/currency';
import type { GeoLocation, CurrencyInfo } from '../utils/currency';

interface CurrencyContextType {
  // Location info
  location: GeoLocation | null;
  isLoading: boolean;
  error: string | null;
  
  // Currency info
  currency: CurrencyInfo;
  
  // Formatting functions
  format: (amount: number) => string;
  formatCompact: (amount: number) => string;
  
  // Manual override
  setCurrency: (currencyCode: string) => void;
  resetToDetected: () => void;
}

const defaultCurrency: CurrencyInfo = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'chromalife_currency';
const LOCATION_STORAGE_KEY = 'chromalife_location';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [detectedCurrency, setDetectedCurrency] = useState<CurrencyInfo>(defaultCurrency);
  const [overrideCurrency, setOverrideCurrency] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Check if we have a cached location (valid for 24 hours)
        const cachedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (cachedLocation) {
          const { data, timestamp } = JSON.parse(cachedLocation);
          const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60);
          
          if (hoursSinceCache < 24 && data) {
            setLocation(data);
            const currencyCode = getCurrencyForCountry(data.countryCode);
            setDetectedCurrency({
              code: currencyCode,
              symbol: getCurrencySymbol(currencyCode),
              locale: getLocaleForCountry(data.countryCode),
            });
            setIsLoading(false);
            return;
          }
        }

        // Fetch fresh location
        const locationData = await fetchUserLocation();
        
        if (locationData) {
          setLocation(locationData);
          const currencyCode = getCurrencyForCountry(locationData.countryCode);
          setDetectedCurrency({
            code: currencyCode,
            symbol: getCurrencySymbol(currencyCode),
            locale: getLocaleForCountry(locationData.countryCode),
          });
          
          // Cache the location
          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
            data: locationData,
            timestamp: Date.now(),
          }));
        }
      } catch (err: any) {
        console.error('[CurrencyProvider] Failed to detect location:', err);
        setError(err.message || 'Failed to detect location');
      } finally {
        setIsLoading(false);
      }
    };

    // Check for user's currency preference
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (savedCurrency) {
      setOverrideCurrency(savedCurrency);
    }

    detectLocation();
  }, []);

  // Get the effective currency (override or detected)
  const currency: CurrencyInfo = overrideCurrency
    ? {
        code: overrideCurrency,
        symbol: getCurrencySymbol(overrideCurrency),
        locale: detectedCurrency.locale,
      }
    : detectedCurrency;

  // Format amount with current currency
  const format = useCallback(
    (amount: number) => formatCurrency(amount, currency.code, currency.locale),
    [currency.code, currency.locale]
  );

  // Format amount with compact notation
  const formatCompact = useCallback(
    (amount: number) => formatCurrencyCompact(amount, currency.code, currency.locale),
    [currency.code, currency.locale]
  );

  // Manually set currency
  const setCurrency = useCallback((currencyCode: string) => {
    setOverrideCurrency(currencyCode);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currencyCode);
  }, []);

  // Reset to detected currency
  const resetToDetected = useCallback(() => {
    setOverrideCurrency(null);
    localStorage.removeItem(CURRENCY_STORAGE_KEY);
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        location,
        isLoading,
        error,
        currency,
        format,
        formatCompact,
        setCurrency,
        resetToDetected,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}

// Standalone hook for simple currency formatting without context
export function useCurrencyFormatter(currencyCode: string = 'USD') {
  const format = useCallback(
    (amount: number) => formatCurrency(amount, currencyCode),
    [currencyCode]
  );

  const formatCompact = useCallback(
    (amount: number) => formatCurrencyCompact(amount, currencyCode),
    [currencyCode]
  );

  return { format, formatCompact, symbol: getCurrencySymbol(currencyCode) };
}
