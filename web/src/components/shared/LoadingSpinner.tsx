import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  color,
  text,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 64,
  };

  const spinnerSize = sizeMap[size];
  const borderWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="rounded-full"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: borderWidth,
          borderStyle: 'solid',
          borderColor: color || 'var(--burnt-orange, #cc5500)',
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        }}
      />
      {text && (
        <motion.p
          className="font-mono text-sm"
          style={{ color: 'var(--ink-color, #2c2c2c)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
