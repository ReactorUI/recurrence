import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('Utils Tests', () => {
  test('TIME_OPTIONS has correct values', () => {
    const { TIME_OPTIONS, DEFAULT_TIME } = require('../utils');
    expect(TIME_OPTIONS).toContain('9:00 AM');
    expect(TIME_OPTIONS).toContain('5:00 PM');
    expect(DEFAULT_TIME).toBe('9:00 AM');
  });

  test('formatDateTime works correctly', () => {
    const { formatDateTime } = require('../utils');
    const date = new Date('2025-08-14T10:30:00');
    expect(formatDateTime(date)).toBe('2025-08-14');
  });

  test('validateTimeRange works correctly', () => {
    const { validateTimeRange } = require('../utils');
    expect(validateTimeRange('9:00 AM', '5:00 PM')).toBe(true);
    expect(validateTimeRange('5:00 PM', '9:00 AM')).toBe(false);
  });

  test('buildRecurrenceSummary generates correct text', () => {
    const {
      buildRecurrenceSummary,
      createDefaultSettings,
    } = require('../utils');
    const settings = createDefaultSettings();
    const summary = buildRecurrenceSummary(settings);
    expect(summary).toContain('Occurs every day');
    expect(summary).toContain('with no end date');
  });
});

describe('Hooks Tests', () => {
  test('useRecurrence hook provides expected interface', async () => {
    const { renderHook } = await import('@testing-library/react');
    const { useRecurrence } = await import('../hooks');

    const { result } = renderHook(() => useRecurrence());

    expect(result.current.settings).toBeDefined();
    expect(result.current.summary).toBeDefined();
    expect(result.current.updateSettings).toBeDefined();
    expect(typeof result.current.updateSettings).toBe('function');
  });

  test('useTimeSlots hook manages time slots correctly', async () => {
    const { renderHook, act } = await import('@testing-library/react');
    const { useTimeSlots } = await import('../hooks');

    const { result } = renderHook(() => useTimeSlots(['9:00 AM'], 3));

    expect(result.current.timeSlots).toHaveLength(1);
    expect(result.current.canAddMore).toBe(true);
    expect(result.current.canRemove).toBe(false);

    // Test adding a time slot
    act(() => {
      result.current.addTimeSlot();
    });

    expect(result.current.timeSlots).toHaveLength(2);
  });
});

describe('ThemeProvider Tests', () => {
  test('ThemeProvider provides theme context', async () => {
    const { ThemeProvider, useTheme } = await import(
      '../components/ThemeProvider'
    );

    function TestComponent() {
      const { theme, mode } = useTheme();
      return (
        <div>
          <span data-testid="mode">{mode}</span>
          <span data-testid="primary">{theme.colors.primary}</span>
        </div>
      );
    }

    render(
      <ThemeProvider defaultMode="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(screen.getByTestId('primary')).toHaveTextContent('#3b82f6');
  });

  test('Theme toggle works', async () => {
    const { ThemeProvider, useTheme } = await import(
      '../components/ThemeProvider'
    );
    const user = userEvent.setup();

    function TestComponent() {
      const { mode, toggleMode } = useTheme();
      return (
        <div>
          <span data-testid="mode">{mode}</span>
          <button onClick={toggleMode} data-testid="toggle">
            Toggle
          </button>
        </div>
      );
    }

    render(
      <ThemeProvider defaultMode="light" enableSystemTheme={false}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');

    await user.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });
});

describe('RecurrenceBuilder Integration Tests', () => {
  test('RecurrenceBuilder renders and functions', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={mockOnChange} collapsible={false} />
      </ThemeProvider>
    );

    // Check basic elements render
    expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();

    // Check summary is shown
    expect(screen.getByText(/Occurs every day/)).toBeInTheDocument();

    // Test type switching
    await user.click(screen.getByText('Weekly'));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  test('RecurrenceBuilder works without ThemeProvider', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const mockOnChange = jest.fn();

    // Should not throw error when used without ThemeProvider
    expect(() => {
      render(<RecurrenceBuilder onChange={mockOnChange} collapsible={false} />);
    }).not.toThrow();

    // Check basic elements still render
    expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
    expect(screen.getByText(/Occurs every day/)).toBeInTheDocument();
  });

  test('Collapsible functionality works', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={jest.fn()} defaultCollapsed={true} />
      </ThemeProvider>
    );

    // Should be collapsed initially - look for the summary text instead
    expect(screen.getByText(/Occurs every day/)).toBeInTheDocument();
    expect(screen.queryByText('Recurrence Pattern')).not.toBeInTheDocument();

    // Click the header button to expand (look for the button with the summary)
    const headerButton = screen.getByRole('button');
    await user.click(headerButton);

    await waitFor(() => {
      expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
    });
  });

  test('Auto-scroll functionality works when expanded', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={jest.fn()} defaultCollapsed={true} />
      </ThemeProvider>
    );

    const headerButton = screen.getByRole('button');
    await user.click(headerButton);

    // Wait for the auto-scroll to trigger
    await waitFor(
      () => {
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  test('Frequency options work correctly', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={jest.fn()} collapsible={false} />
      </ThemeProvider>
    );

    // Check frequency options are present
    expect(screen.getByText('Occurs once at')).toBeInTheDocument();
    expect(
      screen.getByText('Occurs multiple times per day')
    ).toBeInTheDocument();

    // Test switching to multiple times
    await user.click(screen.getByLabelText('Occurs multiple times per day'));

    await waitFor(() => {
      expect(screen.getByText('Number of occurrences:')).toBeInTheDocument();
      // Check that the occurrence count is styled as text, not input
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  test('Time slots display horizontally', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={jest.fn()} collapsible={false} />
      </ThemeProvider>
    );

    // Switch to multiple times
    await user.click(screen.getByLabelText('Occurs multiple times per day'));

    await waitFor(() => {
      expect(screen.getByText('Time slots:')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    // Test adding a time slot
    await user.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('#2')).toBeInTheDocument();
    });
  });

  test('End options work correctly', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <RecurrenceBuilder onChange={jest.fn()} collapsible={false} />
      </ThemeProvider>
    );

    // Check end options are present
    expect(screen.getByText('No end date')).toBeInTheDocument();
    expect(screen.getByText(/End after/)).toBeInTheDocument();
    expect(screen.getByText(/End by/)).toBeInTheDocument();

    // Test switching to "End after"
    await user.click(screen.getByLabelText(/End after/));

    await waitFor(() => {
      const input = screen.getByDisplayValue('10');
      expect(input).toBeInTheDocument();
    });
  });

  test('Theme toggle in RecurrenceBuilder works', async () => {
    const { RecurrenceBuilder } = await import(
      '../components/RecurrenceBuilder'
    );
    const { ThemeProvider } = await import('../components/ThemeProvider');
    const user = userEvent.setup();

    render(
      <ThemeProvider enableSystemTheme={false}>
        <RecurrenceBuilder
          onChange={jest.fn()}
          showThemeToggle={true}
          collapsible={false}
        />
      </ThemeProvider>
    );

    const themeButton = screen.getByRole('button', { name: /switch to/i });
    expect(themeButton).toBeInTheDocument();

    await user.click(themeButton);
    // Should not crash and button should still be there
    expect(themeButton).toBeInTheDocument();
  });
});
