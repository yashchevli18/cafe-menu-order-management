const VARIANTS = {
  neutral: 'bg-beige/70 text-brown',
  caramel: 'bg-caramel/15 text-caramel-dark',
  dark: 'bg-espresso/85 text-cream backdrop-blur',
  light: 'bg-white/90 text-espresso backdrop-blur',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  brand: 'bg-brown/10 text-brown ring-1 ring-brown/20',
};

const Badge = ({ variant = 'neutral', icon: Icon, className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${VARIANTS[variant]} ${className}`}
  >
    {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
    {children}
  </span>
);

export default Badge;
