import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const randomSegment = (length) =>
  Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');

const generateOrderNumber = (date = new Date()) => {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `BB-${yy}${mm}${dd}-${randomSegment(5)}`;
};

export default generateOrderNumber;
