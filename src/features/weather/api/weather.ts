import { fetchJson } from '@/lib/fetchJson';
import { WeatherResponse, Units } from './types';

export async function fetchWeather(args: {
  lat: number;
  lon: number;
  units: Units;
}): Promise<WeatherResponse> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(args.lat));
  url.searchParams.set('longitude', String(args.lon));
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set(
    'hourly',
    'temperature_2m,relative_humidity_2m,weathercode'
  );
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('timezone', 'auto');

  if (args.units === 'f') {
    url.searchParams.set('temperature_unit', 'fahrenheit');
  }

  try {
    return await fetchJson<WeatherResponse>(url.toString());
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}
