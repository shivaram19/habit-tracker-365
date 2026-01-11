import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  rotate?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  rotate = false,
  className = '',
  style,
  ...props
}, ref) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--paper-bg, #fdfbf7)',
      borderColor: 'var(--ink-color, #2c2c2c)',
    },
    elevated: {
      backgroundColor: 'var(--paper-bg, #fdfbf7)',
      borderColor: 'var(--ink-color, #2c2c2c)',
      boxShadow: '4px 4px 0px 0px var(--ink-color, #2c2c2c)',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'var(--ink-color, #2c2c2c)',
    },
    filled: {
      backgroundColor: 'var(--ink-color, #2c2c2c)',
      borderColor: 'var(--ink-color, #2c2c2c)',
      color: 'var(--paper-bg, #fdfbf7)',
    },
  };

  const rotation = rotate ? (Math.random() > 0.5 ? -1.5 : 1.5) : 0;

  return (
    <motion.div
      ref={ref}
      className={`
        border-3
        ${paddingStyles[padding]}
        ${className}
      `}
      style={{
        borderRadius: '20px 15px 18px 16px / 16px 18px 15px 20px',
        borderWidth: '3px',
        transform: `rotate(${rotation}deg)`,
        ...variantStyles[variant],
        ...style,
      }}
      whileHover={hover ? { scale: 1.02, rotate: rotation + 1 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
