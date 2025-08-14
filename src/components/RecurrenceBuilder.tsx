import React, { useState } from 'react';
import { ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import { clsx } from 'clsx';
import { RecurrenceBuilderProps, RecurrenceType } from '../types';
import { useRecurrence } from '../hooks';
import { useTheme, generateThemeStyles } from './ThemeProvider';
import { RecurrenceOptions } from './RecurrenceOptions';
import { DailyPattern } from './patterns/DailyPattern';
import { WeeklyPattern } from './patterns/WeeklyPattern';
import { MonthlyPattern } from './patterns/MonthlyPattern';
import { YearlyPattern } from './patterns/YearlyPattern';
import { FrequencyOptions } from './FrequencyOptions';
import { EndOptions } from './EndOptions';

export function RecurrenceBuilder({
  value,
  onChange,
  onSummaryChange,
  className,
  maxOccurrences = 3,
  showFrequencyOptions = {
    showSingleTime: true,
    showMultipleTimes: true,
    showTimeRange: true,
  },
  defaultFrequency = 'once',
  collapsible = true,
  defaultCollapsed = true,
  showThemeToggle = false,
  useCustomStyling = false,
}: RecurrenceBuilderProps) {
  const { settings, summary, updateSettings } = useRecurrence(
    value,
    onChange,
    onSummaryChange
  );
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { theme, mode, toggleMode } = useTheme();

  const handleTypeChange = (type: RecurrenceType) => {
    updateSettings({ type });
  };

  const renderPattern = () => {
    switch (settings.type) {
      case 'daily':
        return (
          <DailyPattern
            settings={settings.daily}
            onChange={(daily) => updateSettings({ daily })}
          />
        );
      case 'weekly':
        return (
          <WeeklyPattern
            settings={settings.weekly}
            onChange={(weekly) => updateSettings({ weekly })}
          />
        );
      case 'monthly':
        return (
          <MonthlyPattern
            settings={settings.monthly}
            onChange={(monthly) => updateSettings({ monthly })}
          />
        );
      case 'yearly':
        return (
          <YearlyPattern
            settings={settings.yearly}
            onChange={(yearly) => updateSettings({ yearly })}
          />
        );
      default:
        return null;
    }
  };

  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Generate styles based on theme
  const styles = useCustomStyling ? generateThemeStyles(theme) : {};

  const content = (
    <div
      className="space-y-6"
      style={useCustomStyling ? { padding: theme.spacing.lg } : {}}
    >
      <RecurrenceOptions
        selectedType={settings.type}
        onTypeChange={handleTypeChange}
      />

      <div
        className={
          useCustomStyling
            ? ''
            : 'bg-gray-50 rounded-lg p-4 border border-gray-200'
        }
        style={useCustomStyling ? styles.surface : {}}
      >
        {renderPattern()}
      </div>

      <FrequencyOptions
        settings={settings.frequency}
        onChange={(frequency) => updateSettings({ frequency })}
        maxOccurrences={maxOccurrences}
        showOptions={showFrequencyOptions}
        defaultType={defaultFrequency}
      />

      <EndOptions
        settings={settings.end}
        onChange={(end) => updateSettings({ end })}
      />

      <div
        className={
          useCustomStyling
            ? ''
            : 'bg-blue-50 border-l-4 border-blue-400 p-4 rounded'
        }
        style={useCustomStyling ? styles.accent : {}}
      >
        <p
          className={
            useCustomStyling ? '' : 'text-sm font-medium text-blue-900'
          }
          style={
            useCustomStyling
              ? {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: theme.spacing.xs,
                }
              : {}
          }
        >
          Recurrence Summary
        </p>
        <p
          className={useCustomStyling ? '' : 'text-sm text-blue-800 mt-1'}
          style={useCustomStyling ? { fontSize: '0.875rem', margin: 0 } : {}}
        >
          {summary}
        </p>
      </div>
    </div>
  );

  if (!collapsible) {
    return (
      <div
        className={clsx(
          !useCustomStyling && 'bg-white border border-gray-200 rounded-lg p-6',
          className
        )}
        style={
          useCustomStyling
            ? { ...styles.container, padding: theme.spacing.xl }
            : {}
        }
      >
        {showThemeToggle && (
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMode}
              className={
                useCustomStyling
                  ? ''
                  : 'p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors'
              }
              style={
                useCustomStyling
                  ? {
                      ...styles.buttonSecondary,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.sm,
                    }
                  : {}
              }
              title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
            >
              {getThemeIcon()}
            </button>
          </div>
        )}
        {content}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        !useCustomStyling && 'bg-white border border-gray-200 rounded-lg',
        className
      )}
      style={useCustomStyling ? styles.container : {}}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={clsx(
          !useCustomStyling &&
            'w-full flex items-center justify-between p-4 text-left bg-blue-50 hover:bg-blue-100 transition-colors border-b border-gray-200',
          !useCustomStyling && (isCollapsed ? 'rounded-lg' : 'rounded-t-lg')
        )}
        style={
          useCustomStyling
            ? {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.surface,
                border: 'none',
                borderBottom: `1px solid ${theme.colors.border}`,
                borderRadius: isCollapsed
                  ? theme.borderRadius.lg
                  : `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }
            : {}
        }
      >
        <div className="flex items-center space-x-3">
          <ChevronRight
            className={clsx(
              'h-5 w-5 transition-transform',
              !useCustomStyling && 'text-blue-600',
              !isCollapsed && 'transform rotate-90'
            )}
            style={
              useCustomStyling
                ? {
                    color: theme.colors.text.accent,
                    transform: !isCollapsed ? 'rotate(90deg)' : 'none',
                  }
                : {}
            }
          />
          <span
            className={!useCustomStyling ? 'font-medium text-gray-900' : ''}
            style={
              useCustomStyling
                ? {
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                  }
                : {}
            }
          >
            Recurrence Settings
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={
              !useCustomStyling ? 'text-sm text-gray-600 truncate max-w-md' : ''
            }
            style={
              useCustomStyling
                ? {
                    fontSize: '0.875rem',
                    color: theme.colors.text.secondary,
                    maxWidth: '24rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }
                : {}
            }
          >
            {summary}
          </span>
          {showThemeToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMode();
              }}
              className={
                useCustomStyling
                  ? ''
                  : 'p-1 rounded hover:bg-blue-200 transition-colors'
              }
              style={
                useCustomStyling
                  ? {
                      padding: theme.spacing.xs,
                      borderRadius: theme.borderRadius.sm,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.colors.text.accent,
                      cursor: 'pointer',
                    }
                  : {}
              }
              title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
            >
              {getThemeIcon()}
            </button>
          )}
        </div>
      </button>

      {!isCollapsed && (
        <div
          style={
            useCustomStyling
              ? { padding: theme.spacing.xl }
              : { padding: '1.5rem' }
          }
        >
          {content}
        </div>
      )}
    </div>
  );
}
