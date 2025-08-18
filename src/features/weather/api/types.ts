export type Units = 'c' | 'f';

export interface City {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  time: string;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weathercode: number[];
}

export interface WeatherResponse {
  current_weather: CurrentWeather;
  hourly: HourlyData;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

export interface GeocodingResponse {
  results: Array<{
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
  generationtime_ms: number;
}
