# @reactorui/recurrence

A powerful, flexible recurrence rule builder for React applications.  
Build complex recurring schedules with an intuitive UI that generates **human-readable summaries** and **structured data**.

---

## ✨ Features

- 🔄 **Complete Patterns** — Daily, weekly, monthly, yearly
- ⏰ **Flexible Timing** — Single time, multiple times, or ranges
- 📅 **Smart End Conditions** — Never, after X occurrences, or until date
- 🎨 **Modern UI** — Accessible, Tailwind-powered design
- 📱 **Responsive** — Works on desktop & mobile
- 🔧 **TypeScript Ready** — Full type safety
- 🎯 **Customizable** — Options, styling, behaviors
- 📊 **Readable Output** — Natural language summaries

---

## 📦 Installation

```bash
npm install @reactorui/recurrence
# or
yarn add @reactorui/recurrence
# or
pnpm add @reactorui/recurrence
```

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { RecurrenceBuilder, RecurrenceSettings } from '@reactorui/recurrence';

function MyApp() {
  const [settings, setSettings] = useState<RecurrenceSettings | null>(null);

  return (
    <RecurrenceBuilder
      onChange={setSettings}
      onSummaryChange={(summary) => console.log(summary)}
    />
  );
}
```

## 📚 API Reference

**<RecurrenceBuilder /> Props**

| Prop                   | Type                                     | Default  | Description                           |
| ---------------------- | ---------------------------------------- | -------- | ------------------------------------- |
| `value`                | `Partial<RecurrenceSettings>`            | -        | Initial recurrence settings           |
| `onChange`             | `(settings: RecurrenceSettings) => void` | -        | Called when settings change           |
| `onSummaryChange`      | `(summary: string) => void`              | -        | Called when summary changes           |
| `className`            | `string`                                 | -        | Extra CSS classes                     |
| `maxOccurrences`       | `number`                                 | `3`      | Max time slots for multiple frequency |
| `showFrequencyOptions` | `object`                                 | All true | Which frequency options to show       |
| `defaultFrequency`     | `'once' \| 'multiple' \| 'range'`        | `'once'` | Default frequency type                |
| `collapsible`          | `boolean`                                | `true`   | Collapsible component                 |
| `defaultCollapsed`     | `boolean`                                | `true`   | Initial collapsed state               |

**RecurrenceSettings Interface**

```ts
interface RecurrenceSettings {
  startDate: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  daily: DailySettings;
  weekly: WeeklySettings;
  monthly: MonthlySettings;
  yearly: YearlySettings;
  end: EndSettings;
  frequency: FrequencySettings;
}
```

## 🛠 Examples

**Basic Usage**

```tsx
<RecurrenceBuilder
  onChange={(settings) => console.log('Changed:', settings)}
  onSummaryChange={(summary) => console.log('Summary:', summary)}
/>
```

**With Initial Values**

```tsx
<RecurrenceBuilder
  value={{
    type: 'weekly',
    weekly: { interval: 2, days: [1, 3, 5] }, // Mon, Wed, Fri
    frequency: { type: 'once', singleTime: '10:00 AM' },
  }}
  onChange={handleChange}
/>
```

**Customized Options**

```tsx
<RecurrenceBuilder
  maxOccurrences={5}
  showFrequencyOptions={{
    showSingleTime: true,
    showMultipleTimes: true,
    showTimeRange: false,
  }}
  defaultFrequency="multiple"
  collapsible={false}
  className="my-custom-class"
  onChange={handleChange}
/>
```

## 🪝 Hooks

**useRecurrence**

```tsx
import { useRecurrence } from '@reactorui/recurrence';

function MyComponent() {
  const { settings, summary, updateSettings } = useRecurrence(
    initialValue,
    onChange,
    onSummaryChange
  );

  updateSettings({
    type: 'weekly',
    weekly: { interval: 1, days: [1, 2, 3, 4, 5] },
  });
}
```

**useTimeSlots**

```tsx
import { useTimeSlots } from '@reactorui/recurrence';

function TimeSlotManager() {
  const {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    canAddMore,
    canRemove,
    times,
  } = useTimeSlots(['9:00 AM', '2:00 PM'], 3);
}
```

## 🧩 Utilities

**Summary Generation**

```tsx
import { buildRecurrenceSummary } from '@reactorui/recurrence';

const summary = buildRecurrenceSummary(settings);
// "Occurs every week on Monday, Wednesday, Friday at 9:00 AM with no end date..."
```

Validation
