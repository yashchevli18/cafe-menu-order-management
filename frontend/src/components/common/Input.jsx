import { useId } from 'react';

const Input = ({
  label,
  error,
  hint,
  icon: Icon,
  multiline = false,
  required = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const Field = multiline ? 'textarea' : 'input';

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-espresso">
          {label}
          {required && <span className="ml-0.5 text-caramel">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className={`pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-brown/50 ${multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}`}
            aria-hidden="true"
          />
        )}
        <Field
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            'w-full rounded-2xl border bg-white px-4 text-[15px] text-espresso placeholder:text-espresso/35',
            'transition focus:ring-4 focus:outline-none',
            multiline ? 'min-h-24 resize-y py-3' : 'h-12',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-beige focus:border-caramel focus:ring-caramel/15',
          ].join(' ')}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-espresso/55">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default Input;
