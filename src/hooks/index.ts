import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { RecurrenceSettings, TimeSlot } from '../types';
import {
  createDefaultSettings,
  buildRecurrenceSummary,
  generateId,
  getNextTimeSlot,
} from '../utils';

export function useRecurrence(
  initialValue?: Partial<RecurrenceSettings>,
  onChange?: (settings: RecurrenceSettings) => void,
  onSummaryChange?: (summary: string) => void
) {
  const [settings, setSettings] = useState<RecurrenceSettings>(() => ({
    ...createDefaultSettings(),
    ...initialValue,
  }));

  // Use refs to store callbacks to avoid dependency issues
  const onChangeRef = useRef(onChange);
  const onSummaryChangeRef = useRef(onSummaryChange);

  // Update refs when callbacks change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSummaryChangeRef.current = onSummaryChange;
  }, [onSummaryChange]);

  const updateSettings = useCallback((updates: Partial<RecurrenceSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      // Call onChange immediately with new settings
      if (onChangeRef.current) {
        onChangeRef.current(newSettings);
      }
      return newSettings;
    });
  }, []);

  // Generate summary and call onSummaryChange
  const summary = useMemo(() => {
    const newSummary = buildRecurrenceSummary(settings);
    // Call onSummaryChange when summary changes
    if (onSummaryChangeRef.current) {
      onSummaryChangeRef.current(newSummary);
    }
    return newSummary;
  }, [settings]);

  return {
    settings,
    summary,
    updateSettings,
  };
}

export function useTimeSlots(
  initialTimes: string[] = [],
  maxSlots: number = 3
) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() =>
    initialTimes.length > 0
      ? initialTimes.map((time) => ({ id: generateId(), time }))
      : [{ id: generateId(), time: '9:00 AM' }]
  );

  const addTimeSlot = useCallback(() => {
    if (timeSlots.length >= maxSlots) return;

    const lastTime = timeSlots[timeSlots.length - 1]?.time || '9:00 AM';
    const nextTime = getNextTimeSlot(lastTime);

    setTimeSlots((prev) => [...prev, { id: generateId(), time: nextTime }]);
  }, [timeSlots, maxSlots]);

  const removeTimeSlot = useCallback((id: string) => {
    setTimeSlots((prev) =>
      prev.length > 1 ? prev.filter((slot) => slot.id !== id) : prev
    );
  }, []);

  const updateTimeSlot = useCallback((id: string, time: string) => {
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, time } : slot))
    );

    // Sort time slots after update
    setTimeout(() => {
      setTimeSlots((prev) =>
        [...prev].sort((a, b) => {
          const timeOptions = [
            '12:00 AM',
            '12:30 AM',
            '1:00 AM',
            '1:30 AM',
            '2:00 AM',
            '2:30 AM',
            '3:00 AM',
            '3:30 AM',
            '4:00 AM',
            '4:30 AM',
            '5:00 AM',
            '5:30 AM',
            '6:00 AM',
            '6:30 AM',
            '7:00 AM',
            '7:30 AM',
            '8:00 AM',
            '8:30 AM',
            '9:00 AM',
            '9:30 AM',
            '10:00 AM',
            '10:30 AM',
            '11:00 AM',
            '11:30 AM',
            '12:00 PM',
            '12:30 PM',
            '1:00 PM',
            '1:30 PM',
            '2:00 PM',
            '2:30 PM',
            '3:00 PM',
            '3:30 PM',
            '4:00 PM',
            '4:30 PM',
            '5:00 PM',
            '5:30 PM',
            '6:00 PM',
            '6:30 PM',
            '7:00 PM',
            '7:30 PM',
            '8:00 PM',
            '8:30 PM',
            '9:00 PM',
            '9:30 PM',
            '10:00 PM',
            '10:30 PM',
            '11:00 PM',
            '11:30 PM',
          ];
          return timeOptions.indexOf(a.time) - timeOptions.indexOf(b.time);
        })
      );
    }, 0);
  }, []);

  const canAddMore = timeSlots.length < maxSlots;
  const canRemove = timeSlots.length > 1;

  return {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    canAddMore,
    canRemove,
    times: timeSlots.map((slot) => slot.time),
  };
}
