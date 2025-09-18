import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
  'aria-label'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  size = 'md',
  variant = 'primary',
  className,
  text,
  'aria-label': ariaLabel,
}) => {
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const spinnerColors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const defaultAriaLabel = text || 'Loading content, please wait';

  return (
    <div
      className={cn('flex flex-col items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || defaultAriaLabel}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-t-transparent border-current',
          spinnerSizes[size],
          spinnerColors[variant]
        )}
        aria-hidden="true"
      />
      {text && (
        <p
          className={cn(
            'mt-2 text-gray-600',
            textSizes[size]
          )}
          aria-hidden="true"
        >
          {text}
        </p>
      )}
      {/* Screen reader only text */}
      <span className="sr-only">
        {ariaLabel || defaultAriaLabel}
      </span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
