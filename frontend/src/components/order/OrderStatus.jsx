import { BadgeCheck, ChefHat, CircleX, ClipboardList, Hourglass, PackageCheck } from 'lucide-react';
import Badge from '../common/Badge';
import { ORDER_STATUS, ORDER_STATUS_FLOW } from '../../utils/constants';

const STATUS_META = {
  [ORDER_STATUS.PENDING]: { icon: Hourglass, variant: 'warning', hint: 'We have received your order.' },
  [ORDER_STATUS.CONFIRMED]: { icon: ClipboardList, variant: 'info', hint: 'The cafe has confirmed your order.' },
  [ORDER_STATUS.PREPARING]: { icon: ChefHat, variant: 'caramel', hint: 'Our kitchen is preparing your order.' },
  [ORDER_STATUS.READY]: { icon: PackageCheck, variant: 'success', hint: 'Your order is ready!' },
  [ORDER_STATUS.COMPLETED]: { icon: BadgeCheck, variant: 'brand', hint: 'Enjoy! Thanks for visiting Brew & Bean.' },
  [ORDER_STATUS.CANCELLED]: { icon: CircleX, variant: 'danger', hint: 'This order was cancelled.' },
};

export const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META[ORDER_STATUS.PENDING];
  return (
    <Badge variant={meta.variant} icon={meta.icon}>
      {status}
    </Badge>
  );
};

const OrderStatus = ({ status }) => {
  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <CircleX className="h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Order cancelled.</span> Please speak to our staff if you have any questions.
        </p>
      </div>
    );
  }

  const currentIndex = Math.max(0, ORDER_STATUS_FLOW.indexOf(status));
  const progress = (currentIndex / (ORDER_STATUS_FLOW.length - 1)) * 100;

  return (
    <div>
      <div className="relative">
        <div className="absolute top-5 right-[10%] left-[10%] h-1 rounded-full bg-beige" aria-hidden="true">
          <div
            className="h-full rounded-full bg-caramel transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      <ol className="relative grid grid-cols-5" aria-label="Order progress">
        {ORDER_STATUS_FLOW.map((step, index) => {
          const { icon: Icon } = STATUS_META[step];
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              key={step}
              className="relative flex flex-col items-center gap-2 text-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                  isCurrent
                    ? 'border-caramel bg-caramel text-white shadow-[0_0_0_6px_rgba(197,139,85,0.18)]'
                    : isDone
                      ? 'border-caramel bg-white text-caramel'
                      : 'border-beige bg-white text-espresso/30'
                }`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span
                className={`text-[11px] font-medium sm:text-xs ${isCurrent ? 'text-espresso' : isDone ? 'text-espresso/70' : 'text-espresso/40'}`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
      </div>
      <p className="mt-4 text-center text-sm text-espresso/65">{STATUS_META[ORDER_STATUS_FLOW[currentIndex]].hint}</p>
    </div>
  );
};

export default OrderStatus;
