import { useMemo, useState } from 'react';
import { Hash, Link2, Printer, TriangleAlert } from 'lucide-react';
import TableQrCode from '../components/qr/TableQrCode';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { DEV_LAN_ORIGIN, TABLE_LIMITS } from '../utils/constants';

const MAX_CODES_PER_SHEET = 24;
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];

const isLocalOnlyUrl = (value) => {
  try {
    return LOCAL_HOSTNAMES.includes(new URL(value).hostname);
  } catch {
    return false;
  }
};

const getDefaultBaseUrl = () =>
  isLocalOnlyUrl(window.location.origin) && DEV_LAN_ORIGIN ? DEV_LAN_ORIGIN : window.location.origin;

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateRange = (from, to) => {
  const start = Number(from);
  const end = Number(to);
  if (!Number.isInteger(start) || !Number.isInteger(end)) return 'Table numbers must be whole numbers.';
  if (start < TABLE_LIMITS.min || end > TABLE_LIMITS.max) {
    return `Tables must be between ${TABLE_LIMITS.min} and ${TABLE_LIMITS.max}.`;
  }
  if (start > end) return '"From" table must be less than or equal to "To" table.';
  if (end - start + 1 > MAX_CODES_PER_SHEET) return `Generate up to ${MAX_CODES_PER_SHEET} codes at a time.`;
  return null;
};

const TableQrPage = () => {
  useDocumentTitle('Table QR Codes');
  const [baseUrl, setBaseUrl] = useState(getDefaultBaseUrl);
  const [fromTable, setFromTable] = useState('1');
  const [toTable, setToTable] = useState('8');

  const rangeError = validateRange(fromTable, toTable);
  const urlError = isValidHttpUrl(baseUrl) ? null : 'Enter a full URL, e.g. https://your-app.vercel.app';

  const tables = useMemo(() => {
    if (rangeError) return [];
    const start = Number(fromTable);
    return Array.from({ length: Number(toTable) - start + 1 }, (_, index) => start + index);
  }, [fromTable, toTable, rangeError]);

  return (
    <div className="container-page py-10 sm:py-14 print:py-0">
      <div className="print:hidden">
        <p className="section-eyebrow">Table ordering</p>
        <h1 className="mt-2 text-4xl font-semibold text-espresso">Table QR codes</h1>
        <p className="mt-3 max-w-2xl text-espresso/65">
          Generate a QR code for each table. Guests who scan it land on the menu with their table number already
          filled in. Print this page or download individual codes for your table stands.
        </p>

        <div className="card mt-8 grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_140px_140px_auto] md:items-start">
          <Input
            label="Website URL"
            icon={Link2}
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value.trim())}
            error={urlError ?? undefined}
            hint={
              DEV_LAN_ORIGIN && baseUrl === DEV_LAN_ORIGIN
                ? 'Your computer’s Wi-Fi address. Phones must be on the same Wi-Fi network.'
                : 'Use your deployed frontend URL before printing.'
            }
          />
          <Input
            label="From table"
            icon={Hash}
            type="number"
            min={TABLE_LIMITS.min}
            max={TABLE_LIMITS.max}
            value={fromTable}
            onChange={(event) => setFromTable(event.target.value)}
          />
          <Input
            label="To table"
            icon={Hash}
            type="number"
            min={TABLE_LIMITS.min}
            max={TABLE_LIMITS.max}
            value={toTable}
            onChange={(event) => setToTable(event.target.value)}
          />
          <Button
            leftIcon={Printer}
            onClick={() => window.print()}
            disabled={Boolean(rangeError || urlError)}
            className="md:mt-7"
          >
            Print
          </Button>
        </div>
        {rangeError && <p className="mt-3 text-sm font-medium text-red-600">{rangeError}</p>}
        {!urlError && isLocalOnlyUrl(baseUrl) && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Phones can&apos;t open &ldquo;localhost&rdquo;.</strong> On a phone, localhost means the phone
              itself. Use your computer&apos;s network address{DEV_LAN_ORIGIN ? ` (${DEV_LAN_ORIGIN})` : ''} while
              testing on the same Wi-Fi, or your deployed Vercel URL.
            </span>
          </p>
        )}
      </div>

      {!urlError && tables.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:mt-0 print:grid-cols-3">
          {tables.map((table) => (
            <TableQrCode key={table} tableNumber={table} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TableQrPage;
