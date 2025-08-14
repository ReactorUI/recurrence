import { useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { FrequencySettings, FrequencyType } from '../types';
import { useTimeSlots } from '../hooks';
import {
  TIME_OPTIONS,
  DEFAULT_TIME,
  DEFAULT_END_TIME,
  validateTimeRange,
} from '../utils';

interface FrequencyOptionsProps {
  settings: FrequencySettings;
  onChange: (settings: FrequencySettings) => void;
  maxOccurrences?: number;
  showOptions?: {
    showSingleTime?: boolean;
    showMultipleTimes?: boolean;
    showTimeRange?: boolean;
  };
}

export function FrequencyOptions({
  settings,
  onChange,
  maxOccurrences = 3,
  showOptions = {
    showSingleTime: true,
    showMultipleTimes: true,
    showTimeRange: true,
  },
}: FrequencyOptionsProps) {
  const {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    canAddMore,
    canRemove,
    times,
  } = useTimeSlots(settings.times || [DEFAULT_TIME], maxOccurrences);

  const handleTypeChange = (type: FrequencyType) => {
    let newSettings: FrequencySettings = { type };

    switch (type) {
      case 'once':
        newSettings.singleTime = settings.singleTime || DEFAULT_TIME;
        break;
      case 'multiple':
        newSettings.count = times.length;
        newSettings.times = times;
        break;
      case 'range':
        newSettings.startTime = settings.startTime || DEFAULT_TIME;
        newSettings.endTime = settings.endTime || DEFAULT_END_TIME;
        break;
    }

    onChange(newSettings);
  };

  const handleStartTimeChange = (startTime: string) => {
    let endTime = settings.endTime || DEFAULT_END_TIME;

    // Validate and adjust end time if necessary
    if (!validateTimeRange(startTime, endTime)) {
      const startIndex = TIME_OPTIONS.indexOf(startTime);
      const newEndIndex = Math.min(startIndex + 1, TIME_OPTIONS.length - 1);
      endTime = TIME_OPTIONS[newEndIndex];
    }

    onChange({ ...settings, startTime, endTime });
  };

  // Update settings when time slots change (remove the useEffect to prevent loops)
  // The parent component will handle this through the onChange prop

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Daily Frequency
      </h3>

      <div className="space-y-4">
        {showOptions.showSingleTime && (
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="frequency-type"
              checked={settings.type === 'once'}
              onChange={() => handleTypeChange('once')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Occurs once at
            </span>
            <select
              value={settings.singleTime || DEFAULT_TIME}
              onChange={(e) =>
                onChange({ ...settings, singleTime: e.target.value })
              }
              disabled={settings.type !== 'once'}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        )}

        {showOptions.showMultipleTimes && (
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="radio"
                name="frequency-type"
                checked={settings.type === 'multiple'}
                onChange={() => handleTypeChange('multiple')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Occurs multiple times per day
              </span>
            </label>

            {settings.type === 'multiple' && (
              <div className="ml-7 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Time slots:
                  </span>
                  <span className="text-sm font-bold text-gray-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    {times.length}
                  </span>
                  <span className="text-xs text-gray-500">
                    (Max: {maxOccurrences})
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {timeSlots.map((slot, index) => (
                      <div key={slot.id} className="flex items-center gap-1">
                        <select
                          value={slot.time}
                          onChange={(e) =>
                            updateTimeSlot(slot.id, e.target.value)
                          }
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        {canRemove && (
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(slot.id)}
                            className="p-1 text-red-500 hover:text-red-700 rounded transition-colors"
                            title="Remove time slot"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {canAddMore && (
                      <button
                        type="button"
                        onClick={addTimeSlot}
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Add time slot"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showOptions.showTimeRange && (
          <div>
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="radio"
                name="frequency-type"
                checked={settings.type === 'range'}
                onChange={() => handleTypeChange('range')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Occurs during time range
              </span>
            </label>

            {settings.type === 'range' && (
              <div className="ml-7 flex items-center space-x-3 flex-wrap">
                <span className="text-sm text-gray-700">From</span>
                <select
                  value={settings.startTime || DEFAULT_TIME}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">to</span>
                <select
                  value={settings.endTime || DEFAULT_END_TIME}
                  onChange={(e) =>
                    onChange({ ...settings, endTime: e.target.value })
                  }
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
