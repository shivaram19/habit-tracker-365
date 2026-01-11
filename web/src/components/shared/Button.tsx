import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseStyles = `
    font-mono font-bold
    border-3 border-ink
    transition-transform duration-75
    cursor-pointer select-none
    flex items-center justify-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-burnt-orange text-paper hover:bg-[#b34a00]',
    secondary: 'bg-cerulean text-paper hover:bg-[#006a91]',
    danger: 'bg-brick-red text-paper hover:bg-[#b33847]',
    ghost: 'bg-transparent text-ink hover:bg-ink/10',
    outline: 'bg-paper text-ink hover:bg-dandelion/30',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.button
      ref={ref}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        borderRadius: '15px 10px 13px 11px / 11px 13px 10px 15px',
        borderWidth: '3px',
        borderColor: 'var(--ink-color, #2c2c2c)',
        backgroundColor: variant === 'primary' ? 'var(--burnt-orange, #cc5500)' : 
                         variant === 'secondary' ? 'var(--cerulean, #007ba7)' :
                         variant === 'danger' ? 'var(--brick-red, #cb4154)' :
                         variant === 'ghost' ? 'transparent' : 'var(--paper-bg, #fdfbf7)',
        color: variant === 'ghost' || variant === 'outline' ? 'var(--ink-color, #2c2c2c)' : 'var(--paper-bg, #fdfbf7)',
      }}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98, y: disabled ? 0 : 2 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={iconSize[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={iconSize[size]} />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
