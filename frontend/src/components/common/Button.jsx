import { LoaderCircle } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brown text-white shadow-soft hover:bg-brown-dark hover:shadow-lift',
  secondary: 'bg-caramel text-white shadow-soft hover:bg-caramel-dark hover:shadow-lift',
  dark: 'bg-espresso text-cream shadow-soft hover:bg-black',
  outline: 'border border-brown/30 bg-white/60 text-brown hover:border-brown hover:bg-white',
  ghost: 'text-brown hover:bg-beige/60',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  light: 'bg-cream text-espresso hover:bg-white',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
  icon: 'h-10 w-10',
};

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  className = '',
  children,
  type,
  ...props
}) => {
  const isButton = Component === 'button';
  const isDisabled = disabled || isLoading;

  return (
    <Component
      type={isButton ? (type ?? 'button') : undefined}
      disabled={isButton ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap',
        'transition-all duration-200 active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />
      )}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
    </Component>
  );
};

export default Button;
