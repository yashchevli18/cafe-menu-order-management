export const normalizePhone = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.slice(-10);
};

export const maskPhone = (phone) => {
  const value = String(phone ?? '');
  if (value.length < 4) return value;
  return `${'*'.repeat(value.length - 4)}${value.slice(-4)}`;
};
