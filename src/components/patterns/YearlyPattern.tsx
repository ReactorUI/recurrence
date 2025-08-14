import React from 'react';
import { YearlySettings } from '../../types';
import { MONTHS, WEEK_POSITIONS, WEEKDAY_OPTIONS } from '../../utils';

interface YearlyPatternProps {
  settings: YearlySettings;
  onChange: (settings: YearlySettings) => void;
}

export function YearlyPattern({ settings, onChange }: YearlyPatternProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center space-x-3 flex-wrap">
          <input
            type="radio"
            name="yearly-type"
            checked={settings.useDate}
            onChange={() => onChange({ ...settings, useDate: true })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Every</span>
          <select
            value={settings.month}
            onChange={(e) =>
              onChange({ ...settings, month: parseInt(e.target.value) })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
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
        </label>

        <label className="flex items-center space-x-3 flex-wrap">
          <input
            type="radio"
            name="yearly-type"
            checked={!settings.useDate}
            onChange={() => onChange({ ...settings, useDate: false })}
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
          <span className="text-sm text-gray-700">of</span>
          <select
            value={settings.patternMonth}
            onChange={(e) =>
              onChange({ ...settings, patternMonth: parseInt(e.target.value) })
            }
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
