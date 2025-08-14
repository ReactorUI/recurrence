import React from 'react';
import { EndSettings, EndType } from '../types';
import { formatDateTime } from '../utils';

interface EndOptionsProps {
  settings: EndSettings;
  onChange: (settings: EndSettings) => void;
}

export function EndOptions({ settings, onChange }: EndOptionsProps) {
  const handleTypeChange = (type: EndType) => {
    let newSettings = { ...settings, type };

    if (type === 'by' && !settings.endDate) {
      // Set default end date to 1 year from now
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      newSettings.endDate = formatDateTime(oneYearLater);
    }

    onChange(newSettings);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Range of Recurrence
      </h3>

      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="end-type"
            checked={settings.type === 'never'}
            onChange={() => handleTypeChange('never')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">No end date</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="end-type"
            checked={settings.type === 'after'}
            onChange={() => handleTypeChange('after')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">End after</span>
          <input
            type="number"
            min="1"
            max="999"
            value={settings.occurrences}
            onChange={(e) =>
              onChange({
                ...settings,
                occurrences: parseInt(e.target.value) || 1,
              })
            }
            disabled={settings.type !== 'after'}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <span className="text-sm text-gray-700">
            occurrence{settings.occurrences !== 1 ? 's' : ''}
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="end-type"
            checked={settings.type === 'by'}
            onChange={() => handleTypeChange('by')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">End by</span>
          <input
            type="date"
            value={settings.endDate}
            onChange={(e) => onChange({ ...settings, endDate: e.target.value })}
            disabled={settings.type !== 'by'}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </label>
      </div>
    </div>
  );
}
