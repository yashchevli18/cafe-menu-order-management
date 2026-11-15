import { CircleAlert, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({ title = 'Something went wrong', message, details = [], onRetry, className = '' }) => (
  <div role="alert" className={`rounded-3xl border border-red-200 bg-red-50/70 p-5 sm:p-6 ${className}`}>
    <div className="flex items-start gap-3">
      <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h3 className="font-sans text-base font-semibold text-red-800">{title}</h3>
        {message && <p className="mt-1 text-sm text-red-700">{message}</p>}
        {details.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
        {onRetry && (
          <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={onRetry} className="mt-4">
            Try again
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default ErrorMessage;
