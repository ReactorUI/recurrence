import { useState, useRef, useEffect, useContext } from 'react';
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Make theme optional - use default values if no ThemeProvider
  let theme, mode, toggleMode;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    mode = themeContext.mode;
    toggleMode = themeContext.toggleMode;
  } catch (error) {
    // Fallback to default theme when no ThemeProvider is available
    const defaultTheme = {
      colors: {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f8fafc',
        border: '#e2e8f0',
        text: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#3b82f6',
        },
        accent: {
          background: '#dbeafe',
          border: '#93c5fd',
          text: '#1e40af',
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
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    };
    theme = defaultTheme;
    mode = 'light';
    toggleMode = () => {}; // No-op function when no provider
  }

  // Auto-scroll to content when expanded - scroll to middle
  useEffect(() => {
    if (!isCollapsed && collapsible && contentRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // Changed to 'center' to scroll to middle
        });
      }, 100);
    }
  }, [isCollapsed, collapsible]);

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
      {/* Sticky Header */}
      <div
        className={clsx(
          !useCustomStyling && 'sticky top-0 z-20 bg-white',
          !isCollapsed &&
            !useCustomStyling &&
            'shadow-md border-b border-gray-200'
        )}
        style={
          useCustomStyling
            ? {
                position: 'sticky',
                top: 0,
                zIndex: 20,
                backgroundColor: theme.colors.background,
                ...(!isCollapsed && {
                  boxShadow: theme.shadows.md,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }),
              }
            : {}
        }
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
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <ChevronRight
              className={clsx(
                'h-5 w-5 flex-shrink-0 transition-transform duration-200 ease-in-out',
                !useCustomStyling && 'text-blue-600',
                !isCollapsed ? 'rotate-90' : 'rotate-0'
              )}
              style={
                useCustomStyling
                  ? {
                      color: theme.colors.text.accent,
                      transform: !isCollapsed
                        ? 'rotate(90deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out',
                      flexShrink: 0,
                    }
                  : {}
              }
            />
            <span
              className={
                !useCustomStyling ? 'text-sm text-gray-700 flex-1 min-w-0' : ''
              }
              style={
                useCustomStyling
                  ? {
                      fontSize: '0.875rem',
                      color: theme.colors.text.primary,
                      flex: 1,
                      minWidth: 0,
                    }
                  : {}
              }
            >
              {summary}
            </span>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
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
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div
          ref={contentRef}
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
