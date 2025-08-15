import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  ThemeContextValue,
  ThemeMode,
  RecurrenceTheme,
  ThemeConfig,
} from '../types/theme';

const defaultTheme: RecurrenceTheme = {
  light: {
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
  },
  dark: {
    colors: {
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#9ca3af',
      background: '#111827',
      surface: '#1f2937',
      border: '#374151',
      text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
        accent: '#60a5fa',
      },
      accent: {
        background: '#1e3a8a',
        border: '#3b82f6',
        text: '#dbeafe',
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
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    },
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Export the context for direct access
export { ThemeContext };

// Deep partial type for theme configuration
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: {
    light?: DeepPartial<ThemeConfig>;
    dark?: DeepPartial<ThemeConfig>;
  };
  defaultMode?: ThemeMode;
  enableSystemTheme?: boolean;
}

export function ThemeProvider({
  children,
  customTheme,
  defaultMode = 'light',
  enableSystemTheme = true,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light');

  // Merge custom theme with default theme using deep merge
  const mergedTheme: RecurrenceTheme = {
    light: {
      ...defaultTheme.light,
      ...customTheme?.light,
      colors: {
        ...defaultTheme.light.colors,
        ...customTheme?.light?.colors,
        text: {
          ...defaultTheme.light.colors.text,
          ...customTheme?.light?.colors?.text,
        },
        accent: {
          ...defaultTheme.light.colors.accent,
          ...customTheme?.light?.colors?.accent,
        },
      },
      spacing: {
        ...defaultTheme.light.spacing,
        ...customTheme?.light?.spacing,
      },
      borderRadius: {
        ...defaultTheme.light.borderRadius,
        ...customTheme?.light?.borderRadius,
      },
      shadows: {
        ...defaultTheme.light.shadows,
        ...customTheme?.light?.shadows,
      },
    },
    dark: {
      ...defaultTheme.dark,
      ...customTheme?.dark,
      colors: {
        ...defaultTheme.dark.colors,
        ...customTheme?.dark?.colors,
        text: {
          ...defaultTheme.dark.colors.text,
          ...customTheme?.dark?.colors?.text,
        },
        accent: {
          ...defaultTheme.dark.colors.accent,
          ...customTheme?.dark?.colors?.accent,
        },
      },
      spacing: {
        ...defaultTheme.dark.spacing,
        ...customTheme?.dark?.spacing,
      },
      borderRadius: {
        ...defaultTheme.dark.borderRadius,
        ...customTheme?.dark?.borderRadius,
      },
      shadows: {
        ...defaultTheme.dark.shadows,
        ...customTheme?.dark?.shadows,
      },
    },
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystemTheme]);

  // Determine active theme
  const activeMode = mode === 'system' ? systemMode : mode;
  const theme = mergedTheme[activeMode];

  const toggleMode = () => {
    if (enableSystemTheme) {
      setMode((current) => {
        switch (current) {
          case 'light':
            return 'dark';
          case 'dark':
            return 'system';
          case 'system':
            return 'light';
          default:
            return 'light';
        }
      });
    } else {
      setMode((current) => (current === 'light' ? 'dark' : 'light'));
    }
  };

  const value: ThemeContextValue = {
    theme,
    mode: activeMode,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// CSS-in-JS style generator
export function generateThemeStyles(
  theme: ThemeConfig
): Record<string, React.CSSProperties> {
  return {
    container: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.md,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing.lg,
    },
    button: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.background,
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    input: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.sm,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: '0.875rem',
    },
    accent: {
      backgroundColor: theme.colors.accent.background,
      color: theme.colors.accent.text,
      border: `1px solid ${theme.colors.accent.border}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    },
  };
}
