import { Coffee } from 'lucide-react';

const EmptyState = ({ icon: Icon = Coffee, title, description, action, compact = false, className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center text-center ${compact ? 'px-4 py-10' : 'px-6 py-16 sm:py-20'} ${className}`}
  >
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-beige/70 text-brown">
      <Icon className="h-7 w-7" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-semibold text-espresso sm:text-2xl">{title}</h3>
    {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-espresso/65">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
