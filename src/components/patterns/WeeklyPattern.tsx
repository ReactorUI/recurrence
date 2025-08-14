import React from 'react';
import { clsx } from 'clsx';
import { WeeklySettings, WeekDay } from '../../types';
import { WEEK_DAYS } from '../../utils';

interface WeeklyPatternProps {
  settings: WeeklySettings;
  onChange: (settings: WeeklySettings) => void;
}

export function WeeklyPattern({ settings, onChange }: WeeklyPatternProps) {
  const toggleDay = (day: WeekDay) => {
    const days = settings.days.includes(day)
      ? settings.days.filter((d) => d !== day)
      : [...settings.days, day].sort();
    onChange({ ...settings, days });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Every</span>
        <input
          type="number"
          min="1"
          max="52"
          value={settings.interval}
          onChange={(e) =>
            onChange({ ...settings, interval: parseInt(e.target.value) || 1 })
          }
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-sm text-gray-700">
          week{settings.interval !== 1 ? 's' : ''} on:
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {WEEK_DAYS.map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(index as WeekDay)}
            className={clsx(
              'w-10 h-10 rounded-full text-sm font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              settings.days.includes(index as WeekDay)
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {settings.days.length === 0 && (
        <p className="text-sm text-amber-600">Please select at least one day</p>
      )}
    </div>
  );
}
