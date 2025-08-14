import { DailySettings } from '../../types';

interface DailyPatternProps {
  settings: DailySettings;
  onChange: (settings: DailySettings) => void;
}

export function DailyPattern({ settings, onChange }: DailyPatternProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="daily-type"
            checked={!settings.isWeekday}
            onChange={() => onChange({ ...settings, isWeekday: false })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Every</span>
          <input
            type="number"
            min="1"
            max="365"
            value={settings.interval}
            onChange={(e) =>
              onChange({ ...settings, interval: parseInt(e.target.value) || 1 })
            }
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-700">
            day{settings.interval !== 1 ? 's' : ''}
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="daily-type"
            checked={settings.isWeekday}
            onChange={() => onChange({ ...settings, isWeekday: true })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            Every weekday (Monday to Friday)
          </span>
        </label>
      </div>
    </div>
  );
}
