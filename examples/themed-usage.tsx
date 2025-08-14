import React, { useState } from 'react';
import {
  RecurrenceBuilder,
  ThemeProvider,
  RecurrenceSettings,
  RecurrenceTheme,
} from '@reactorui/recurrence';

// Custom theme example
const customTheme: Partial<RecurrenceTheme> = {
  light: {
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f1f5f9',
      border: '#e2e8f0',
      text: {
        primary: '#0f172a',
        secondary: '#64748b',
        accent: '#8b5cf6',
      },
      accent: {
        background: '#f3e8ff',
        border: '#c4b5fd',
        text: '#6b21a8',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
  },
  dark: {
    colors: {
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      border: '#334155',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        accent: '#a78bfa',
      },
      accent: {
        background: '#581c87',
        border: '#8b5cf6',
        text: '#f3e8ff',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
    },
  },
};

export function ThemedUsageExample() {
  const [recurrenceSettings, setRecurrenceSettings] =
    useState<RecurrenceSettings | null>(null);
  const [summary, setSummary] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          @reactorui/recurrence - Themed Examples
        </h1>

        {/* Default Theme with Theme Toggle */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Default Theme with Toggle
          </h2>
          <ThemeProvider defaultMode="light" enableSystemTheme={true}>
            <RecurrenceBuilder
              onChange={setRecurrenceSettings}
              onSummaryChange={setSummary}
              showThemeToggle={true}
              collapsible={true}
              defaultCollapsed={false}
            />
          </ThemeProvider>
        </div>

        {/* Custom Styled Theme */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Custom Purple Theme with CSS-in-JS
          </h2>
          <ThemeProvider
            customTheme={customTheme}
            defaultMode="light"
            enableSystemTheme={true}
          >
            <RecurrenceBuilder
              onChange={setRecurrenceSettings}
              onSummaryChange={setSummary}
              showThemeToggle={true}
              useCustomStyling={true}
              collapsible={true}
              defaultCollapsed={false}
              maxOccurrences={5}
            />
          </ThemeProvider>
        </div>

        {/* Dark Mode Only */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Dark Mode Only
          </h2>
          <ThemeProvider defaultMode="dark" enableSystemTheme={false}>
            <RecurrenceBuilder
              onChange={setRecurrenceSettings}
              onSummaryChange={setSummary}
              useCustomStyling={true}
              collapsible={false}
              showFrequencyOptions={{
                showSingleTime: true,
                showMultipleTimes: true,
                showTimeRange: false,
              }}
            />
          </ThemeProvider>
        </div>

        {/* Settings Display */}
        {recurrenceSettings && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Generated Settings
            </h3>
            <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded border overflow-auto text-gray-800 dark:text-gray-200">
              {JSON.stringify(recurrenceSettings, null, 2)}
            </pre>
          </div>
        )}

        {summary && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Human-Readable Summary
            </h3>
            <p className="text-blue-800 dark:text-blue-200">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Usage with custom CSS classes (if not using CSS-in-JS)
export function TailwindThemedExample() {
  return (
    <ThemeProvider defaultMode="system">
      <div className="dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto p-6">
          <RecurrenceBuilder
            className="dark:bg-gray-800 dark:border-gray-700"
            showThemeToggle={true}
            onChange={(settings) => console.log(settings)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ThemedUsageExample;
