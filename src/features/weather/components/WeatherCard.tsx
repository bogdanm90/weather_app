import { WeatherResponse, Units } from '../api/types';
import { formatTemperature, formatTime } from '@/lib/format';
import { ClockIcon } from './icons';
import WeatherIcon from './WeatherIcon';

interface WeatherCardProps {
  weather: WeatherResponse;
  cityName: string;
  country: string;
  units: Units;
  className?: string;
}

export default function WeatherCard({
  weather,
  cityName,
  country,
  units,
  className = '',
}: WeatherCardProps) {
  const { current_weather, hourly } = weather;

  const hourlyForecasts = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      weatherCode: hourly.weathercode[index],
    }))
    .filter((_, index) => index % 3 === 0)
    .slice(1, 4);

  return (
    <div className={`weather-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{cityName}</h2>
          <p className="text-gray-600">{country}</p>
        </div>
        <WeatherIcon weatherCode={current_weather.weathercode} size="xl" />
      </div>

      <div className="mb-8">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-5xl font-bold text-gray-900">
            {formatTemperature(current_weather.temperature, units)}
          </span>
        </div>
        <p className="text-lg text-gray-600">
          <WeatherIcon
            weatherCode={current_weather.weathercode}
            size="sm"
            showDescription={true}
            className="inline-block mr-2"
          />
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Last updated: {formatTime(current_weather.time)}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ClockIcon />
          <h3 className="text-lg font-semibold text-gray-800">
            Hourly Forecast
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {hourlyForecasts.map((forecast, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {formatTime(forecast.time)}
              </div>
              <WeatherIcon weatherCode={forecast.weatherCode} size="lg" />
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {formatTemperature(forecast.temperature, units)}
              </div>
              <div className="text-xs text-gray-500">
                {forecast.humidity}% humidity
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Timezone:</span>
            <span className="ml-2 font-medium text-gray-900">
              {weather.timezone_abbreviation}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Coordinates:</span>
            <span className="ml-2 font-medium text-gray-900">
              {weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
