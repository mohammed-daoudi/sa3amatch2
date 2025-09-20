import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700',
        ghost: 'hover:bg-gray-100 active:bg-gray-200 text-gray-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
        link: 'underline-offset-4 hover:underline text-primary-600 p-0 h-auto',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 rounded-md text-xs',
        lg: 'h-12 px-8 rounded-md text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
