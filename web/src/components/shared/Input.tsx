import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block font-mono text-sm font-bold mb-2"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full font-mono text-base
            transition-colors duration-200
            ${leftIcon ? 'pl-12' : 'pl-4'}
            ${rightIcon ? 'pr-12' : 'pr-4'}
            py-3
            ${error ? 'border-brick-red' : ''}
            ${className}
          `}
          style={{
            backgroundColor: 'var(--paper-bg, #fdfbf7)',
            color: 'var(--ink-color, #2c2c2c)',
            borderWidth: '3px',
            borderStyle: 'solid',
            borderColor: error ? 'var(--brick-red, #cb4154)' : 'var(--ink-color, #2c2c2c)',
            borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
            outline: 'none',
          }}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.5 }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 font-mono text-xs"
          style={{ color: 'var(--brick-red, #cb4154)' }}
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p 
          className="mt-1 font-mono text-xs"
          style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.6 }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
