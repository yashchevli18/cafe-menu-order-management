import { Coffee } from 'lucide-react';

const Loader = ({ label = 'Loading...', fullScreen = false, className = '' }) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex flex-col items-center justify-center gap-4 text-brown ${fullScreen ? 'min-h-[60vh]' : 'py-16'} ${className}`}
  >
    <div className="relative flex h-16 w-16 items-center justify-center">
      <span className="absolute inset-0 animate-spin rounded-full border-4 border-beige border-t-caramel" />
      <Coffee className="h-6 w-6" aria-hidden="true" />
    </div>
    <p className="text-sm font-medium text-espresso/70">{label}</p>
  </div>
);

export default Loader;
