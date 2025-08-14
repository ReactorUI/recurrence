import { clsx } from 'clsx';
import { RecurrenceType } from '../types';

interface RecurrenceOptionsProps {
  selectedType: RecurrenceType;
  onTypeChange: (type: RecurrenceType) => void;
}

const RECURRENCE_TYPES: Array<{ value: RecurrenceType; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function RecurrenceOptions({
  selectedType,
  onTypeChange,
}: RecurrenceOptionsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Recurrence Pattern
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RECURRENCE_TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onTypeChange(value)}
            className={clsx(
              'px-4 py-3 text-sm font-medium rounded-lg border transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              selectedType === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
