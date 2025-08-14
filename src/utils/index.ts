import { RecurrenceSettings, WeekDay } from '../types';

export const TIME_OPTIONS = [
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

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEK_POSITIONS = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
  { value: 'fourth', label: 'Fourth' },
  { value: 'last', label: 'Last' },
];

export const WEEKDAY_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const DEFAULT_TIME = '9:00 AM';
export const DEFAULT_END_TIME = '5:00 PM';

export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateForSummary(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function getNextTimeSlot(currentTime: string): string {
  const currentIndex = TIME_OPTIONS.indexOf(currentTime);
  const nextIndex = (currentIndex + 1) % TIME_OPTIONS.length;
  return TIME_OPTIONS[nextIndex];
}

export function validateTimeRange(startTime: string, endTime: string): boolean {
  const startIndex = TIME_OPTIONS.indexOf(startTime);
  const endIndex = TIME_OPTIONS.indexOf(endTime);
  return endIndex > startIndex;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function createDefaultSettings(): RecurrenceSettings {
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    startDate: formatDateTime(now),
    type: 'daily',
    daily: {
      isWeekday: false,
      interval: 1,
    },
    weekly: {
      interval: 1,
      days: [now.getDay() as WeekDay],
    },
    monthly: {
      useDay: true,
      day: now.getDate(),
      interval: 1,
      week: 'first',
      weekday: 'day',
      patternInterval: 1,
    },
    yearly: {
      useDate: true,
      month: now.getMonth(),
      day: now.getDate(),
      week: 'first',
      weekday: 'day',
      patternMonth: now.getMonth(),
    },
    end: {
      type: 'never',
      occurrences: 10,
      endDate: formatDateTime(thirtyDaysLater),
    },
    frequency: {
      type: 'once',
      singleTime: DEFAULT_TIME,
    },
  };
}

export function buildRecurrenceSummary(settings: RecurrenceSettings): string {
  const startDate = new Date(settings.startDate);

  // Build range text
  const rangeText = buildRangeText(settings.end);

  // Build frequency text
  const frequencyText = buildFrequencyText(settings.frequency);

  // Build pattern text
  let patternText = '';

  switch (settings.type) {
    case 'daily':
      patternText = buildDailyPattern(settings.daily);
      break;
    case 'weekly':
      patternText = buildWeeklyPattern(settings.weekly);
      break;
    case 'monthly':
      patternText = buildMonthlyPattern(settings.monthly);
      break;
    case 'yearly':
      patternText = buildYearlyPattern(settings.yearly);
      break;
  }

  return `${patternText}${frequencyText} ${rangeText}, effective ${formatDateForSummary(startDate)}`;
}

function buildRangeText(end: RecurrenceSettings['end']): string {
  switch (end.type) {
    case 'never':
      return 'with no end date';
    case 'after':
      return `for ${end.occurrences} occurrence${end.occurrences > 1 ? 's' : ''}`;
    case 'by':
      const endDate = new Date(end.endDate);
      return `until ${formatDateForSummary(endDate)}`;
    default:
      return '';
  }
}

function buildFrequencyText(
  frequency: RecurrenceSettings['frequency']
): string {
  switch (frequency.type) {
    case 'once':
      return frequency.singleTime ? ` at ${frequency.singleTime}` : '';
    case 'multiple':
      if (frequency.times && frequency.times.length > 1) {
        return ` ${frequency.count} times daily at ${frequency.times.join(', ')}`;
      } else if (frequency.times && frequency.times.length === 1) {
        return ` at ${frequency.times[0]}`;
      }
      return '';
    case 'range':
      if (frequency.startTime && frequency.endTime) {
        return ` from ${frequency.startTime} to ${frequency.endTime}`;
      }
      return '';
    default:
      return '';
  }
}

function buildDailyPattern(daily: RecurrenceSettings['daily']): string {
  if (daily.isWeekday) {
    return 'Occurs every weekday';
  }
  return `Occurs every ${daily.interval > 1 ? daily.interval + ' days' : 'day'}`;
}

function buildWeeklyPattern(weekly: RecurrenceSettings['weekly']): string {
  const selectedDays = weekly.days.map((day) => WEEK_DAYS[day]);
  const daysText =
    selectedDays.length > 0 ? selectedDays.join(', ') : 'no days selected';

  return `Occurs every ${weekly.interval > 1 ? weekly.interval + ' weeks' : 'week'} on ${daysText}`;
}

function buildMonthlyPattern(monthly: RecurrenceSettings['monthly']): string {
  if (monthly.useDay) {
    return `Occurs on day ${monthly.day} of every ${monthly.interval > 1 ? monthly.interval + ' months' : 'month'}`;
  } else {
    const weekLabel =
      WEEK_POSITIONS.find((w) => w.value === monthly.week)?.label || 'First';
    const weekdayLabel =
      monthly.weekday === 'day' ? 'day' : WEEK_DAYS[monthly.weekday as WeekDay];
    return `Occurs on the ${weekLabel.toLowerCase()} ${weekdayLabel} of every ${monthly.patternInterval > 1 ? monthly.patternInterval + ' months' : 'month'}`;
  }
}

function buildYearlyPattern(yearly: RecurrenceSettings['yearly']): string {
  if (yearly.useDate) {
    const monthName = MONTHS[yearly.month];
    return `Occurs every ${monthName} ${yearly.day}`;
  } else {
    const weekLabel =
      WEEK_POSITIONS.find((w) => w.value === yearly.week)?.label || 'First';
    const weekdayLabel =
      yearly.weekday === 'day' ? 'day' : WEEK_DAYS[yearly.weekday as WeekDay];
    const monthName = MONTHS[yearly.patternMonth];
    return `Occurs on the ${weekLabel.toLowerCase()} ${weekdayLabel} of ${monthName}`;
  }
}
