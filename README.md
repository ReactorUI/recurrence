# @reactorui/recurrence

A powerful, flexible recurrence rule builder for React applications. Create complex recurring schedules with an intuitive UI that generates human-readable summaries and structured data.

[![npm version](https://badge.fury.io/js/@reactorui%2Frecurrence.svg)](https://badge.fury.io/js/@reactorui%2Frecurrence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- 🔄 **Complete Recurrence Patterns**: Daily, weekly, monthly, and yearly schedules
- ⏰ **Flexible Timing**: Single time, multiple times per day, or time ranges
- 📅 **Smart End Conditions**: Never ending, after X occurrences, or by specific date
- 📊 **Human-Readable Output**: "Occurs every 2 weeks on Monday, Wednesday at 9:00 AM"
- 🎛️ **Highly Configurable**: Customize visible options, limits, and default behaviors
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔧 **TypeScript First**: Full type safety with comprehensive interfaces
- 🎨 **Customizable Styling**: Tailwind CSS with optional theming and dark mode
- ✅ **Production Ready**: Battle-tested with comprehensive test suite

## Installation

```bash
npm install @reactorui/recurrence
# or
yarn add @reactorui/recurrence
# or
pnpm add @reactorui/recurrence
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { RecurrenceBuilder } from '@reactorui/recurrence';

function App() {
  const [recurrence, setRecurrence] = useState(null);
  const [summary, setSummary] = useState('');

  return (
    <div>
      <RecurrenceBuilder
        onChange={setRecurrence}
        onSummaryChange={setSummary}
      />

      <div>
        <h3>Summary: {summary}</h3>
        <pre>{JSON.stringify(recurrence, null, 2)}</pre>
      </div>
    </div>
  );
}
```

## Recurrence Patterns

### Daily Schedules

```tsx
// Every day at 9:00 AM
<RecurrenceBuilder
  value={{
    type: 'daily',
    daily: { isWeekday: false, interval: 1 },
    frequency: { type: 'once', singleTime: '9:00 AM' }
  }}
/>

// Weekdays only (Mon-Fri) with multiple times
<RecurrenceBuilder
  value={{
    type: 'daily',
    daily: { isWeekday: true, interval: 1 },
    frequency: {
      type: 'multiple',
      times: ['9:00 AM', '1:00 PM', '5:00 PM']
    }
  }}
/>

// Every 3 days during business hours
<RecurrenceBuilder
  value={{
    type: 'daily',
    daily: { isWeekday: false, interval: 3 },
    frequency: {
      type: 'range',
      startTime: '9:00 AM',
      endTime: '5:00 PM'
    }
  }}
/>
```

### Weekly Schedules

```tsx
// Every Monday, Wednesday, Friday at 10:00 AM
<RecurrenceBuilder
  value={{
    type: 'weekly',
    weekly: { interval: 1, days: [1, 3, 5] }, // 0=Sunday, 1=Monday, etc.
    frequency: { type: 'once', singleTime: '10:00 AM' }
  }}
/>

// Every 2 weeks on Tuesday and Thursday
<RecurrenceBuilder
  value={{
    type: 'weekly',
    weekly: { interval: 2, days: [2, 4] },
    frequency: { type: 'once', singleTime: '2:00 PM' }
  }}
/>
```

### Monthly Schedules

```tsx
// 15th of every month
<RecurrenceBuilder
  value={{
    type: 'monthly',
    monthly: {
      useDay: true,
      day: 15,
      interval: 1
    }
  }}
/>

// First Monday of every quarter (every 3 months)
<RecurrenceBuilder
  value={{
    type: 'monthly',
    monthly: {
      useDay: false,
      week: 'first',
      weekday: 1, // Monday
      patternInterval: 3
    }
  }}
/>

// Last Friday of every month
<RecurrenceBuilder
  value={{
    type: 'monthly',
    monthly: {
      useDay: false,
      week: 'last',
      weekday: 5 // Friday
    }
  }}
/>
```

### Yearly Schedules

```tsx
// Every December 25th (Christmas)
<RecurrenceBuilder
  value={{
    type: 'yearly',
    yearly: {
      useDate: true,
      month: 11, // 0-based index: 11 = December
      day: 25
    }
  }}
/>

// Second Tuesday of March every year (e.g., election day)
<RecurrenceBuilder
  value={{
    type: 'yearly',
    yearly: {
      useDate: false,
      week: 'second',
      weekday: 2, // Tuesday
      patternMonth: 2 // March
    }
  }}
/>
```

## End Conditions

Control when the recurrence should stop:

```tsx
// Never ends (default)
<RecurrenceBuilder
  value={{
    end: { type: 'never' }
  }}
/>

// Ends after 10 occurrences
<RecurrenceBuilder
  value={{
    end: { type: 'after', occurrences: 10 }
  }}
/>

// Ends by December 31, 2025
<RecurrenceBuilder
  value={{
    end: { type: 'by', endDate: '2025-12-31' }
  }}
/>
```

## Time Frequency Options

Configure how often the event occurs each day:

```tsx
// Single time per day (default)
<RecurrenceBuilder
  value={{
    frequency: { type: 'once', singleTime: '9:00 AM' }
  }}
/>

// Multiple specific times per day
<RecurrenceBuilder
  value={{
    frequency: {
      type: 'multiple',
      times: ['9:00 AM', '1:00 PM', '5:00 PM'],
      count: 3
    }
  }}
  maxOccurrences={5}
/>

// During a time range
<RecurrenceBuilder
  value={{
    frequency: {
      type: 'range',
      startTime: '9:00 AM',
      endTime: '5:00 PM'
    }
  }}
/>
```

## Configuration Options

### Customize Available Options

```tsx
<RecurrenceBuilder
  // Hide time range option, show only single and multiple times
  showFrequencyOptions={{
    showSingleTime: true,
    showMultipleTimes: true,
    showTimeRange: false,
  }}
  // Allow up to 5 time slots for multiple frequency
  maxOccurrences={5}
  // Default to multiple times when component loads
  defaultFrequency="multiple"
  onChange={handleChange}
/>
```

### Layout Options

```tsx
// Always expanded (not collapsible)
<RecurrenceBuilder
  collapsible={false}
  onChange={handleChange}
/>

// Collapsible, starts collapsed
<RecurrenceBuilder
  collapsible={true}
  defaultCollapsed={true}
  onChange={handleChange}
/>

// Collapsible, starts expanded
<RecurrenceBuilder
  collapsible={true}
  defaultCollapsed={false}
  onChange={handleChange}
/>
```

### Event Handling

```tsx
function ScheduleManager() {
  const handleRecurrenceChange = (settings) => {
    console.log('Recurrence updated:', settings);
    // Save to database, validate, etc.
  };

  const handleSummaryChange = (summary) => {
    console.log('Human readable summary:', summary);
    // Show to user, store for display, etc.
  };

  return (
    <RecurrenceBuilder
      onChange={handleRecurrenceChange}
      onSummaryChange={handleSummaryChange}
    />
  );
}
```

## API Reference

### RecurrenceBuilder Props

| Prop                   | Type                                     | Default  | Description                                     |
| ---------------------- | ---------------------------------------- | -------- | ----------------------------------------------- |
| `value`                | `Partial<RecurrenceSettings>`            | -        | Initial or controlled recurrence settings       |
| `onChange`             | `(settings: RecurrenceSettings) => void` | -        | Called when settings change                     |
| `onSummaryChange`      | `(summary: string) => void`              | -        | Called when human-readable summary updates      |
| `maxOccurrences`       | `number`                                 | `3`      | Maximum time slots for multiple frequency type  |
| `showFrequencyOptions` | `FrequencyOptions`                       | All true | Which frequency options to display              |
| `defaultFrequency`     | `'once' \| 'multiple' \| 'range'`        | `'once'` | Default frequency type when component loads     |
| `collapsible`          | `boolean`                                | `true`   | Whether the component can be collapsed/expanded |
| `defaultCollapsed`     | `boolean`                                | `true`   | Initial collapsed state (if collapsible)        |
| `className`            | `string`                                 | -        | Additional CSS classes for styling              |

### RecurrenceSettings Type

The main data structure returned by `onChange`:

```typescript
interface RecurrenceSettings {
  startDate: string; // ISO date string (YYYY-MM-DD)
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';

  daily: {
    isWeekday: boolean; // true = Mon-Fri only, false = every day
    interval: number; // Every N days (1 = every day, 2 = every other day)
  };

  weekly: {
    interval: number; // Every N weeks
    days: WeekDay[]; // Array of weekdays [0=Sunday, 1=Monday, ..., 6=Saturday]
  };

  monthly: {
    useDay: boolean; // true = specific day (e.g., 15th), false = pattern (e.g., first Monday)
    day: number; // Day of month (1-31) when useDay=true
    interval: number; // Every N months when useDay=true
    week: 'first' | 'second' | 'third' | 'fourth' | 'last'; // Week position when useDay=false
    weekday: WeekDay | 'day'; // Weekday or 'day' for any day when useDay=false
    patternInterval: number; // Every N months when useDay=false
  };

  yearly: {
    useDate: boolean; // true = specific date, false = pattern
    month: number; // Month (0-11) when useDate=true
    day: number; // Day of month when useDate=true
    week: 'first' | 'second' | 'third' | 'fourth' | 'last'; // Week position when useDate=false
    weekday: WeekDay | 'day'; // Weekday when useDate=false
    patternMonth: number; // Month (0-11) when useDate=false
  };

  end: {
    type: 'never' | 'after' | 'by';
    occurrences: number; // Number of occurrences when type='after'
    endDate: string; // ISO date string when type='by'
  };

  frequency: {
    type: 'once' | 'multiple' | 'range';
    singleTime?: string; // Time string (e.g., "9:00 AM") when type='once'
    count?: number; // Number of times when type='multiple'
    times?: string[]; // Array of time strings when type='multiple'
    startTime?: string; // Start time when type='range'
    endTime?: string; // End time when type='range'
  };
}
```

## Advanced Usage

### Custom Hooks

Build your own recurrence UI using the provided hooks:

```tsx
import { useRecurrence } from '@reactorui/recurrence';

function CustomRecurrenceForm() {
  const { settings, summary, updateSettings } = useRecurrence();

  return (
    <div>
      <h3>Custom Recurrence Builder</h3>

      <button onClick={() => updateSettings({ type: 'weekly' })}>
        Switch to Weekly
      </button>

      <button
        onClick={() =>
          updateSettings({
            type: 'daily',
            daily: { isWeekday: true, interval: 1 },
          })
        }
      >
        Weekdays Only
      </button>

      <p>Current: {summary}</p>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
}
```

### Time Slot Management

Manage multiple time slots with the `useTimeSlots` hook:

```tsx
import { useTimeSlots } from '@reactorui/recurrence';

function TimeSlotEditor({ maxSlots = 5 }) {
  const {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    canAddMore,
    canRemove,
    times,
  } = useTimeSlots(['9:00 AM'], maxSlots);

  return (
    <div>
      <h3>Time Slots</h3>

      {timeSlots.map((slot, index) => (
        <div key={slot.id} className="flex gap-2 mb-2">
          <select
            value={slot.time}
            onChange={(e) => updateTimeSlot(slot.id, e.target.value)}
          >
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          {canRemove && (
            <button onClick={() => removeTimeSlot(slot.id)}>Remove</button>
          )}
        </div>
      ))}

      {canAddMore && <button onClick={addTimeSlot}>Add Time Slot</button>}

      <p>Selected times: {times.join(', ')}</p>
    </div>
  );
}
```

## Utility Functions

### Summary Generation

Generate human-readable descriptions from settings:

```tsx
import { buildRecurrenceSummary } from '@reactorui/recurrence';

const settings = {
  type: 'weekly',
  weekly: { interval: 2, days: [1, 3, 5] },
  frequency: { type: 'once', singleTime: '9:00 AM' },
  end: { type: 'after', occurrences: 10 },
  // ... other required fields
};

const summary = buildRecurrenceSummary(settings);
// Output: "Occurs every 2 weeks on Monday, Wednesday, Friday at 9:00 AM for 10 occurrences, effective Thursday, August 14, 2025"
```

### Validation

Validate time ranges and other inputs:

```tsx
import { validateTimeRange } from '@reactorui/recurrence';

const isValid = validateTimeRange('9:00 AM', '5:00 PM'); // true
const isInvalid = validateTimeRange('5:00 PM', '9:00 AM'); // false
```

### Date Formatting

Format dates for display or input:

```tsx
import { formatDateTime, formatDateForSummary } from '@reactorui/recurrence';

const date = new Date('2025-08-14');
const inputFormat = formatDateTime(date); // "2025-08-14"
const displayFormat = formatDateForSummary(date); // "Thursday, August 14, 2025"
```

## Real-World Examples

### Meeting Scheduler

```tsx
function MeetingScheduler() {
  const [meeting, setMeeting] = useState({
    title: '',
    recurrence: null,
  });

  return (
    <form>
      <input
        placeholder="Meeting title"
        value={meeting.title}
        onChange={(e) =>
          setMeeting((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <RecurrenceBuilder
        value={{
          type: 'weekly',
          weekly: { interval: 1, days: [1] }, // Default to Monday
          frequency: { type: 'once', singleTime: '10:00 AM' },
          end: { type: 'never' },
        }}
        onChange={(recurrence) =>
          setMeeting((prev) => ({ ...prev, recurrence }))
        }
        showFrequencyOptions={{
          showSingleTime: true,
          showMultipleTimes: false,
          showTimeRange: false,
        }}
      />

      <button type="submit">Schedule Meeting</button>
    </form>
  );
}
```

### Task Automation

```tsx
function TaskScheduler() {
  const commonTasks = {
    backup: {
      type: 'daily',
      daily: { isWeekday: false, interval: 1 },
      frequency: { type: 'once', singleTime: '2:00 AM' },
      end: { type: 'never' },
    },
    weeklyReport: {
      type: 'weekly',
      weekly: { interval: 1, days: [0] }, // Sunday
      frequency: { type: 'once', singleTime: '11:00 PM' },
      end: { type: 'never' },
    },
    monthlyCleanup: {
      type: 'monthly',
      monthly: { useDay: true, day: 1, interval: 1 }, // 1st of month
      frequency: { type: 'once', singleTime: '6:00 AM' },
      end: { type: 'never' },
    },
  };

  return (
    <div>
      <h3>Quick Task Templates</h3>
      {Object.entries(commonTasks).map(([name, config]) => (
        <button key={name} onClick={() => setTaskConfig(config)}>
          {name}
        </button>
      ))}

      <RecurrenceBuilder
        value={taskConfig}
        onChange={setTaskConfig}
        collapsible={false}
      />
    </div>
  );
}
```

### Subscription Billing

```tsx
function BillingSchedule() {
  const billingTemplates = {
    monthly: {
      type: 'monthly',
      monthly: { useDay: true, day: 1, interval: 1 },
      frequency: { type: 'once', singleTime: '9:00 AM' },
      end: { type: 'after', occurrences: 12 },
    },
    quarterly: {
      type: 'monthly',
      monthly: { useDay: true, day: 1, interval: 3 },
      frequency: { type: 'once', singleTime: '9:00 AM' },
      end: { type: 'after', occurrences: 4 },
    },
    annual: {
      type: 'yearly',
      yearly: { useDate: true, month: 0, day: 1 }, // January 1st
      frequency: { type: 'once', singleTime: '9:00 AM' },
      end: { type: 'never' },
    },
  };

  return (
    <div>
      <label>
        Billing Frequency:
        <select onChange={(e) => setBilling(billingTemplates[e.target.value])}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
      </label>

      <RecurrenceBuilder
        value={billing}
        onChange={setBilling}
        showFrequencyOptions={{
          showSingleTime: true,
          showMultipleTimes: false,
          showTimeRange: false,
        }}
      />
    </div>
  );
}
```

## Styling & Theming

### Default Styling

The component uses Tailwind CSS by default. Ensure Tailwind is installed:

```bash
npm install tailwindcss
```

Configure Tailwind to include the component styles:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@reactorui/recurrence/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Custom CSS Classes

Add your own styling with the `className` prop:

```tsx
<RecurrenceBuilder
  className="border-2 border-purple-500 rounded-xl shadow-lg"
  onChange={handleChange}
/>
```

### Dark Mode & Theming

For advanced theming capabilities, wrap with the optional `ThemeProvider`:

```tsx
import { ThemeProvider, RecurrenceBuilder } from '@reactorui/recurrence';

// Basic dark mode
<ThemeProvider defaultMode="dark">
  <RecurrenceBuilder onChange={handleChange} />
</ThemeProvider>

// With toggle button
<ThemeProvider defaultMode="system">
  <RecurrenceBuilder
    showThemeToggle={true}
    onChange={handleChange}
  />
</ThemeProvider>

// Custom brand colors
const brandTheme = {
  light: {
    colors: {
      primary: '#8b5cf6',      // Purple primary
      background: '#ffffff',
      surface: '#f8fafc',
      border: '#e2e8f0',
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        accent: '#8b5cf6'
      }
    }
  },
  dark: {
    colors: {
      primary: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      border: '#334155',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        accent: '#a78bfa'
      }
    }
  }
};

<ThemeProvider customTheme={brandTheme}>
  <RecurrenceBuilder
    useCustomStyling={true}
    showThemeToggle={true}
    onChange={handleChange}
  />
</ThemeProvider>
```

## TypeScript Support

The library is built with TypeScript and provides full type safety:

```typescript
import type {
  RecurrenceSettings,
  RecurrenceType,
  FrequencyType,
  EndType,
  WeekDay,
  DailySettings,
  WeeklySettings,
  MonthlySettings,
  YearlySettings,
  EndSettings,
  FrequencySettings,
} from '@reactorui/recurrence';

// Type-safe event handlers
const handleRecurrenceChange = (settings: RecurrenceSettings) => {
  // settings is fully typed
  console.log(settings.type); // 'daily' | 'weekly' | 'monthly' | 'yearly'
};

// Type-safe initial values
const initialRecurrence: Partial<RecurrenceSettings> = {
  type: 'weekly',
  weekly: {
    interval: 1,
    days: [1, 3, 5], // TypeScript knows this should be WeekDay[]
  },
};
```

## Testing

The library includes comprehensive tests. Run them with:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test coverage includes:

- ✅ All recurrence pattern combinations
- ✅ User interactions and state management
- ✅ Edge cases and input validation
- ✅ Hook functionality and custom logic
- ✅ Theme switching and styling
- ✅ TypeScript type safety

## Browser Compatibility

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+
- **React** 16.8+ (requires hooks support)

## Performance

The component is optimized for performance:

- ⚡ Minimal re-renders with proper memoization
- 📦 Tree-shakeable exports (import only what you need)
- 🔄 Efficient state updates and callback handling
- 💾 Small bundle size (~15KB gzipped)

## Contributing

We welcome contributions! To get started:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/recurrence.git`
3. **Install** dependencies: `npm install`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes and add tests
6. **Test** your changes: `npm test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Create** a Pull Request

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 **Documentation**: Check this README and inline TypeScript types
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ReactorUI/recurrence/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/ReactorUI/recurrence/discussions)
- 💬 **Community**: [Discord Server](https://discord.gg/reactorui) (if available)

## Related Projects

Part of the ReactorUI ecosystem:

- 📊 [@reactorui/datagrid](https://www.npmjs.com/package/@reactorui/datagrid) - Advanced data grid component
- 🔜 More components coming soon!

---

**Made with ❤️ by ReactorUI**

## Author

**Name:** Miracle<br>
**GitHub:** [@code-Miracle49](https://github.com/code-Miracle49)
