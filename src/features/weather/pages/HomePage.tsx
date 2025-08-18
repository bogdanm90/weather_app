import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../api/weather';
import { queryKeys } from '../api/keys';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRecentCities } from '../hooks/useRecentCities';
import { City, Units } from '../api/types';
import CitySearch from '../components/CitySearch';
import RecentSearches from '../components/RecentSearches';
import WeatherCard from '../components/WeatherCard';
import UnitToggle from '../components/UnitToggle';
import ErrorBanner from '../components/ErrorBanner';
import SkeletonCard from '../components/SkeletonCard';
import { getInitialUnits } from '../components/UnitToggle';

const DEFAULT_CITY: City = {
  id: 1,
  name: 'Belgrade',
  country: 'Serbia',
  lat: 44.7866,
  lon: 20.4489,
};

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [units, setUnits] = useState<Units>(getInitialUnits());

  const {
    coords: geolocationCoords,
    error: geolocationError,
    isLoading: geolocationLoading,
  } = useGeolocation();
  const { addCity } = useRecentCities();

  useEffect(() => {
    if (!selectedCity && !geolocationLoading) {
      if (geolocationCoords) {
        const geoCity: City = {
          id: 0,
          name: 'Current Location',
          country: 'Your Location',
          lat: geolocationCoords.lat,
          lon: geolocationCoords.lon,
        };
        setSelectedCity(geoCity);
      } else if (geolocationError) {
        setSelectedCity(DEFAULT_CITY);
      }
    }
  }, [geolocationCoords, geolocationError, geolocationLoading, selectedCity]);

  const {
    data: weather,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.weather(
      selectedCity?.lat || 0,
      selectedCity?.lon || 0,
      units
    ),
    queryFn: () =>
      fetchWeather({
        lat: selectedCity!.lat,
        lon: selectedCity!.lon,
        units,
      }),
    enabled: !!selectedCity,
    staleTime: 10 * 60 * 1000,
  });

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    addCity(city);
  };

  const handleUnitsChange = (newUnits: Units) => {
    setUnits(newUnits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Weather SPA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get current weather conditions and forecasts for any city around the
            world
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1 space-y-6">
            <div className="weather-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Search City
              </h2>
              <CitySearch onSelect={handleCitySelect} />
            </div>

            <div className="weather-card p-6">
              <UnitToggle units={units} onUnitsChange={handleUnitsChange} />
            </div>

            {geolocationError && (
              <div className="weather-card p-4">
                <div className="flex items-center space-x-2 text-amber-700">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{geolocationError}</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {!selectedCity ? (
              <div className="weather-card p-8 text-center">
                <div className="text-6xl mb-4">🌤️</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome to Weather SPA
                </h2>
                <p className="text-gray-600">
                  Search for a city above or allow location access to see your
                  local weather
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {isPending && <SkeletonCard />}

                {error && (
                  <ErrorBanner
                    error={error.message || 'Failed to fetch weather data'}
                    onRetry={refetch}
                  />
                )}

                {weather && (
                  <WeatherCard
                    weather={weather}
                    cityName={selectedCity.name}
                    country={selectedCity.country}
                    units={units}
                  />
                )}

                {weather && (
                  <RecentSearches onSelect={handleCitySelect} units={units} />
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Open-Meteo
            </a>{' '}
            Weather API
          </p>
        </footer>
      </div>
    </div>
  );
}
