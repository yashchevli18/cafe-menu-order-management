import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCart from './useCart';
import { parseTableNumber } from '../utils/cartUtils';
import { TABLE_LIMITS } from '../utils/constants';

const useTableFromUrl = () => {
  const [searchParams] = useSearchParams();
  const { tableNumber, setTableNumber } = useCart();
  const tableParam = searchParams.get('table');

  useEffect(() => {
    if (tableParam === null) return;

    const parsed = parseTableNumber(tableParam);
    if (!parsed) {
      toast.error(`Invalid table number in QR code. Tables run from ${TABLE_LIMITS.min} to ${TABLE_LIMITS.max}.`, {
        id: 'invalid-table',
      });
      return;
    }

    if (parsed !== tableNumber) {
      setTableNumber(parsed);
      toast.success(`Welcome! You're ordering for Table ${parsed}`, { id: 'table-detected' });
    }
  }, [tableParam, tableNumber, setTableNumber]);
};

export default useTableFromUrl;
