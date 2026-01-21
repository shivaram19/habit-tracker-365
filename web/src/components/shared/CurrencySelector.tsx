import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

// Popular currencies for the selector
const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
];

interface CurrencySelectorProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export function CurrencySelector({ onOpenChange }: CurrencySelectorProps) {
  const { currency, location, setCurrency, resetToDetected } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Notify parent when open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleSelect = (currencyCode: string) => {
    setCurrency(currencyCode);
    setIsOpen(false);
  };

  const handleReset = () => {
    resetToDetected();
    setIsOpen(false);
  };

  return (
    <div className="relative" style={{ zIndex: isOpen ? 100 : 'auto' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 border-2 transition-colors hover:bg-opacity-50"
        style={{
          borderColor: 'var(--ink-color, #2c2c2c)',
          borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
          backgroundColor: isOpen ? 'var(--dandelion, #ffd700)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          <Globe size={20} style={{ color: 'var(--burnt-orange, #cc5500)' }} />
          <div className="text-left">
            <span
              className="font-mono font-bold text-sm sm:text-base block"
              style={{ color: 'var(--ink-color, #2c2c2c)' }}
            >
              Currency
            </span>
            {location && (
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
              >
                Detected: {location.country}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono font-bold text-base sm:text-lg"
            style={{ color: 'var(--burnt-orange, #cc5500)' }}
          >
            {currency.symbol} {currency.code}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} style={{ color: 'var(--ink-color, #2c2c2c)' }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 border-2 overflow-hidden shadow-xl"
            style={{
              zIndex: 9999,
              borderColor: 'var(--ink-color, #2c2c2c)',
              borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
              backgroundColor: 'var(--paper-bg, #fdfbf7)',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {/* Auto-detect option */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-between p-3 hover:bg-opacity-50 transition-colors border-b"
              style={{
                borderColor: 'var(--ink-color, #2c2c2c)',
                backgroundColor: 'var(--dandelion, #ffd700)',
                opacity: 0.8,
              }}
            >
              <span
                className="font-mono text-sm"
                style={{ color: 'var(--ink-color, #2c2c2c)' }}
              >
                🌍 Auto-detect ({location?.countryCode || 'detecting...'})
              </span>
            </button>

            {/* Currency options */}
            {POPULAR_CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleSelect(curr.code)}
                className="w-full flex items-center justify-between p-3 hover:bg-opacity-20 transition-colors"
                style={{
                  backgroundColor:
                    currency.code === curr.code
                      ? 'var(--burnt-orange, #cc5500)'
                      : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono font-bold text-lg w-8"
                    style={{
                      color:
                        currency.code === curr.code
                          ? 'var(--paper-bg, #fdfbf7)'
                          : 'var(--burnt-orange, #cc5500)',
                    }}
                  >
                    {curr.symbol}
                  </span>
                  <div className="text-left">
                    <span
                      className="font-mono text-sm block"
                      style={{
                        color:
                          currency.code === curr.code
                            ? 'var(--paper-bg, #fdfbf7)'
                            : 'var(--ink-color, #2c2c2c)',
                      }}
                    >
                      {curr.code}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{
                        color:
                          currency.code === curr.code
                            ? 'var(--paper-bg, #fdfbf7)'
                            : 'var(--ink-color, #2c2c2c)',
                        opacity: 0.7,
                      }}
                    >
                      {curr.name}
                    </span>
                  </div>
                </div>
                {currency.code === curr.code && (
                  <Check size={20} style={{ color: 'var(--paper-bg, #fdfbf7)' }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
