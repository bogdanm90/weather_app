import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CitySearch from '@/features/weather/components/CitySearch';

// Mock the geocodeCity function
vi.mock('@/features/weather/api/geocode', () => ({
  geocodeCity: vi.fn(),
}));

const mockGeocodeCity = vi.mocked(
  await import('@/features/weather/api/geocode')
).geocodeCity;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CitySearch', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<CitySearch onSelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByPlaceholderText('Search for a city...')
    ).toBeInTheDocument();
  });

  it('shows search results after typing', async () => {
    const mockCities = [
      {
        id: 1,
        name: 'Belgrade',
        country: 'Serbia',
        lat: 44.7866,
        lon: 20.4489,
      },
      {
        id: 2,
        name: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
      },
    ];

    mockGeocodeCity.mockResolvedValue(mockCities);

    render(<CitySearch onSelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'belgrade' } });

    await waitFor(() => {
      expect(screen.getByText('Belgrade')).toBeInTheDocument();
      expect(screen.getByText('Serbia')).toBeInTheDocument();
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });

  it('calls onSelect when city is clicked', async () => {
    const mockCities = [
      {
        id: 1,
        name: 'Belgrade',
        country: 'Serbia',
        lat: 44.7866,
        lon: 20.4489,
      },
    ];

    mockGeocodeCity.mockResolvedValue(mockCities);

    render(<CitySearch onSelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'belgrade' } });

    await waitFor(() => {
      expect(screen.getByText('Belgrade')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Belgrade'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockCities[0]);
  });

  it('handles keyboard navigation', async () => {
    const mockCities = [
      {
        id: 1,
        name: 'Belgrade',
        country: 'Serbia',
        lat: 44.7866,
        lon: 20.4489,
      },
      {
        id: 2,
        name: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
      },
    ];

    mockGeocodeCity.mockResolvedValue(mockCities);

    render(<CitySearch onSelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'belgrade' } });

    await waitFor(() => {
      expect(screen.getByText('Belgrade')).toBeInTheDocument();
    });

    // Press arrow down
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Press enter to select
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith(mockCities[0]);
  });

  it('clears input after city selection', async () => {
    const mockCities = [
      {
        id: 1,
        name: 'Belgrade',
        country: 'Serbia',
        lat: 44.7866,
        lon: 20.4489,
      },
    ];

    mockGeocodeCity.mockResolvedValue(mockCities);

    render(<CitySearch onSelect={mockOnSelect} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'belgrade' } });

    await waitFor(() => {
      expect(screen.getByText('Belgrade')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Belgrade'));

    expect(input).toHaveValue('Belgrade, Serbia');
  });
});
