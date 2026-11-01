import { ServiceStatus } from '../../types';

interface StatusBadgeProps {
  status: ServiceStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Submitted':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'In Review':
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-300';
      break;
    case 'Awaiting Customer':
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-300';
      break;
    case 'In Progress':
    case 'Processing':
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-300';
      break;
    case 'Completed':
    case 'Delivered':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'Ready for Delivery':
      colorClasses = 'bg-teal-50 text-teal-800 border-teal-300';
      break;
    case 'Cancelled':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-300';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-800 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-medium ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
};
