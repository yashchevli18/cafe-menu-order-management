import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

const buildTableUrl = (baseUrl, tableNumber) => {
  const url = new URL('/menu', baseUrl);
  url.searchParams.set('table', String(tableNumber));
  return url.toString();
};

const TableQrCode = ({ tableNumber, baseUrl, size = 168 }) => {
  const wrapperRef = useRef(null);
  const url = buildTableUrl(baseUrl, tableNumber);

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `brew-and-bean-table-${tableNumber}.png`;
    link.click();
  };

  return (
    <article className="card flex break-inside-avoid flex-col items-center p-5 text-center print:border-espresso/30 print:shadow-none">
      <p className="section-eyebrow">Scan to order</p>
      <h3 className="mt-1 text-2xl font-semibold text-espresso">Table {tableNumber}</h3>
      <div ref={wrapperRef} className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-beige">
        <QRCodeCanvas
          value={url}
          size={size}
          level="M"
          marginSize={1}
          fgColor="#2C211B"
          bgColor="#FFFFFF"
          title={`QR code for table ${tableNumber}`}
        />
      </div>
      <p className="mt-3 max-w-full truncate text-[11px] text-espresso/50" title={url}>
        {url}
      </p>
      <Button variant="ghost" size="sm" leftIcon={Download} onClick={handleDownload} className="mt-2 print:hidden">
        Download PNG
      </Button>
    </article>
  );
};

export default TableQrCode;
