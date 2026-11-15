import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Hash, Phone, Search } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { INDIAN_MOBILE_REGEX, ORDER_NUMBER_REGEX } from '../../utils/constants';

const trackSchema = Yup.object({
  orderNumber: Yup.string()
    .transform((value) => (value ? value.trim().toUpperCase() : value))
    .required('Please enter your order number')
    .matches(ORDER_NUMBER_REGEX, 'Order numbers look like BB-261115-AB3CD'),
  phone: Yup.string()
    .transform((value) => (value ? value.replace(/[\s()-]/g, '') : value))
    .required('Please enter the mobile number used for the order')
    .matches(INDIAN_MOBILE_REGEX, 'Enter a valid 10-digit Indian mobile number'),
});

const TrackOrderForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: { orderNumber: '', phone: '', ...initialValues },
    validationSchema: trackSchema,
    onSubmit: (values) =>
      onSubmit({ orderNumber: values.orderNumber.trim().toUpperCase(), phone: values.phone.trim() }),
  });

  const fieldError = (name) => (formik.touched[name] && formik.errors[name]) || undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="card space-y-5 p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Order number"
          required
          icon={Hash}
          placeholder="BB-261115-AB3CD"
          autoCapitalize="characters"
          spellCheck={false}
          className="[&_input]:uppercase [&_input]:placeholder:normal-case"
          error={fieldError('orderNumber')}
          {...formik.getFieldProps('orderNumber')}
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
          {...formik.getFieldProps('phone')}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        fullWidth
        leftIcon={Search}
        isLoading={formik.isSubmitting}
        loadingText="Finding your order..."
      >
        Track order
      </Button>
    </form>
  );
};

export default TrackOrderForm;
