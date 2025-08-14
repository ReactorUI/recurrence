export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type FrequencyType = 'once' | 'multiple' | 'range';

export type EndType = 'never' | 'after' | 'by';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type WeekPosition = 'first' | 'second' | 'third' | 'fourth' | 'last';

export interface DailySettings {
  isWeekday: boolean;
  interval: number;
}

export interface WeeklySettings {
  interval: number;
  days: WeekDay[];
}

export interface MonthlySettings {
  useDay: boolean;
  day: number;
  interval: number;
  week: WeekPosition;
  weekday: WeekDay | 'day';
  patternInterval: number;
}

export interface YearlySettings {
  useDate: boolean;
  month: number;
  day: number;
  week: WeekPosition;
  weekday: WeekDay | 'day';
  patternMonth: number;
}

export interface EndSettings {
  type: EndType;
  occurrences: number;
  endDate: string;
}

export interface FrequencySettings {
  type: FrequencyType;
  singleTime?: string;
  count?: number;
  times?: string[];
  startTime?: string;
  endTime?: string;
}

export interface RecurrenceSettings {
  startDate: string;
  type: RecurrenceType;
  daily: DailySettings;
  weekly: WeeklySettings;
  monthly: MonthlySettings;
  yearly: YearlySettings;
  end: EndSettings;
  frequency: FrequencySettings;
}

export interface RecurrenceBuilderProps {
  value?: Partial<RecurrenceSettings>;
  onChange?: (settings: RecurrenceSettings) => void;
  onSummaryChange?: (summary: string) => void;
  className?: string;
  maxOccurrences?: number;
  showFrequencyOptions?: {
    showSingleTime?: boolean;
    showMultipleTimes?: boolean;
    showTimeRange?: boolean;
  };
  defaultFrequency?: FrequencyType;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showThemeToggle?: boolean;
  useCustomStyling?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
}

// Re-export theme types
export * from './theme';
