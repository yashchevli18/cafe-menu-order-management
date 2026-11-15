import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Armchair, Hash, MessageSquare, Phone, ShoppingBag, User } from 'lucide-react';
import Input from '../common/Input';
import {
  INDIAN_MOBILE_REGEX,
  MAX_INSTRUCTIONS_LENGTH,
  ORDER_TYPES,
  TABLE_LIMITS,
} from '../../utils/constants';

const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

const emptyToUndefined = (value, originalValue) =>
  originalValue === '' || originalValue === null ? undefined : value;

const checkoutSchema = Yup.object({
  customerName: Yup.string()
    .trim()
    .required('Please enter your name')
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .matches(NAME_REGEX, 'Name can only contain letters, spaces, dots, apostrophes and hyphens'),
  phone: Yup.string()
    .transform((value) => (value ? value.replace(/[\s()-]/g, '') : value))
    .required('Please enter your mobile number')
    .matches(INDIAN_MOBILE_REGEX, 'Enter a valid 10-digit Indian mobile number'),
  orderType: Yup.string().oneOf(Object.values(ORDER_TYPES)).required('Choose dine-in or takeaway'),
  tableNumber: Yup.number()
    .transform(emptyToUndefined)
    .typeError('Table number must be a number')
    .integer('Table number must be a whole number')
    .min(TABLE_LIMITS.min, `Tables start at ${TABLE_LIMITS.min}`)
    .max(TABLE_LIMITS.max, `Tables go up to ${TABLE_LIMITS.max}`)
    .when('orderType', {
      is: ORDER_TYPES.DINE_IN,
      then: (schema) => schema.required('Table number is required for dine-in orders'),
      otherwise: (schema) => schema.notRequired(),
    }),
  specialInstructions: Yup.string()
    .trim()
    .max(MAX_INSTRUCTIONS_LENGTH, `Keep instructions under ${MAX_INSTRUCTIONS_LENGTH} characters`),
});

const ORDER_TYPE_OPTIONS = [
  { value: ORDER_TYPES.DINE_IN, label: 'Dine-in', description: 'Served to your table', icon: Armchair },
  { value: ORDER_TYPES.TAKEAWAY, label: 'Takeaway', description: 'Pick up at the counter', icon: ShoppingBag },
];

const SectionTitle = ({ step, children }) => (
  <h2 className="flex items-center gap-3 text-xl font-semibold text-espresso">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso font-sans text-xs font-semibold text-cream">
      {step}
    </span>
    {children}
  </h2>
);

const CheckoutForm = ({ formId, tableNumber, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      customerName: '',
      phone: '',
      orderType: tableNumber ? ORDER_TYPES.DINE_IN : ORDER_TYPES.TAKEAWAY,
      tableNumber: tableNumber ?? '',
      specialInstructions: '',
    },
    validationSchema: checkoutSchema,
    onSubmit,
  });

  const fieldError = (name) => (formik.touched[name] && formik.errors[name]) || undefined;
  const isDineIn = formik.values.orderType === ORDER_TYPES.DINE_IN;
  const tableFromQr = Boolean(tableNumber) && Number(formik.values.tableNumber) === tableNumber;

  return (
    <form id={formId} onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      <fieldset disabled={formik.isSubmitting} className="card space-y-5 p-5 sm:p-7">
        <SectionTitle step="1">Your details</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Full name"
            required
            icon={User}
            placeholder="e.g. Aarav Sharma"
            autoComplete="name"
            error={fieldError('customerName')}
            {...formik.getFieldProps('customerName')}
          />
          <Input
            label="Mobile number"
            required
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="98765 43210"
            autoComplete="tel"
            error={fieldError('phone')}
            hint="We'll use this to verify your order when you track it."
            {...formik.getFieldProps('phone')}
          />
        </div>
      </fieldset>

      <fieldset disabled={formik.isSubmitting} className="card space-y-5 p-5 sm:p-7">
        <SectionTitle step="2">How would you like it?</SectionTitle>

        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Order type">
          {ORDER_TYPE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const isSelected = formik.values.orderType === value;
            return (
              <label
                key={value}
                className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition ${
                  isSelected ? 'border-caramel bg-caramel/5' : 'border-beige bg-white hover:border-caramel/40'
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  value={value}
                  checked={isSelected}
                  onChange={formik.handleChange}
                  className="sr-only"
                />
                <Icon className={`h-5 w-5 ${isSelected ? 'text-caramel' : 'text-brown/60'}`} aria-hidden="true" />
                <span className="font-semibold text-espresso">{label}</span>
                <span className="text-xs text-espresso/55">{description}</span>
                <span
                  className={`absolute top-4 right-4 h-4.5 w-4.5 rounded-full border-2 ${
                    isSelected ? 'border-caramel bg-caramel shadow-[inset_0_0_0_3px_white]' : 'border-beige'
                  }`}
                  aria-hidden="true"
                />
              </label>
            );
          })}
        </div>

        {isDineIn && (
          <Input
            label="Table number"
            required
            icon={Hash}
            type="number"
            inputMode="numeric"
            min={TABLE_LIMITS.min}
            max={TABLE_LIMITS.max}
            placeholder="e.g. 5"
            className="animate-fade-in sm:max-w-xs"
            error={fieldError('tableNumber')}
            hint={tableFromQr ? 'Detected from the QR code on your table.' : 'You can find it on the table stand.'}
            {...formik.getFieldProps('tableNumber')}
          />
        )}

        <div>
          <Input
            label="Special instructions"
            multiline
            rows={3}
            icon={MessageSquare}
            maxLength={MAX_INSTRUCTIONS_LENGTH}
            placeholder="Allergies, less sugar, extra hot..."
            error={fieldError('specialInstructions')}
            {...formik.getFieldProps('specialInstructions')}
          />
          <p className="mt-1 text-right text-xs text-espresso/45 tabular-nums">
            {formik.values.specialInstructions.length}/{MAX_INSTRUCTIONS_LENGTH}
          </p>
        </div>
      </fieldset>
    </form>
  );
};

export default CheckoutForm;
