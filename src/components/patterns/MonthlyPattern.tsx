import { MonthlySettings } from '../../types';
import { WEEK_POSITIONS, WEEKDAY_OPTIONS } from '../../utils';

interface MonthlyPatternProps {
  settings: MonthlySettings;
  onChange: (settings: MonthlySettings) => void;
}

export function MonthlyPattern({ settings, onChange }: MonthlyPatternProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="monthly-type"
            checked={settings.useDay}
            onChange={() => onChange({ ...settings, useDay: true })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Day</span>
          <select
            value={settings.day}
            onChange={(e) =>
              onChange({ ...settings, day: parseInt(e.target.value) })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">of every</span>
          <input
            type="number"
            min="1"
            max="12"
            value={settings.interval}
            onChange={(e) =>
              onChange({ ...settings, interval: parseInt(e.target.value) || 1 })
            }
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-700">
            month{settings.interval !== 1 ? 's' : ''}
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="monthly-type"
            checked={!settings.useDay}
            onChange={() => onChange({ ...settings, useDay: false })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">The</span>
          <select
            value={settings.week}
            onChange={(e) =>
              onChange({ ...settings, week: e.target.value as any })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {WEEK_POSITIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={settings.weekday}
            onChange={(e) =>
              onChange({
                ...settings,
                weekday:
                  e.target.value === 'day'
                    ? 'day'
                    : (parseInt(e.target.value) as any),
              })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {WEEKDAY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">of every</span>
          <input
            type="number"
            min="1"
            max="12"
            value={settings.patternInterval}
            onChange={(e) =>
              onChange({
                ...settings,
                patternInterval: parseInt(e.target.value) || 1,
              })
            }
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-700">
            month{settings.patternInterval !== 1 ? 's' : ''}
          </span>
        </label>
      </div>
    </div>
  );
}
