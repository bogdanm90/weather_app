import { http, HttpResponse } from 'msw';

export const handlers = [
  // Geocoding API mock
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('name');

    if (query === 'belgrade') {
      return HttpResponse.json({
        results: [
          {
            id: 1,
            name: 'Belgrade',
            country: 'Serbia',
            latitude: 44.7866,
            longitude: 20.4489,
          },
        ],
        generationtime_ms: 0.1,
      });
    }

    if (query === 'london') {
      return HttpResponse.json({
        results: [
          {
            id: 2,
            name: 'London',
            country: 'United Kingdom',
            latitude: 51.5074,
            longitude: -0.1278,
          },
        ],
        generationtime_ms: 0.1,
      });
    }

    return HttpResponse.json({
      results: [],
      generationtime_ms: 0.1,
    });
  }),

  // Weather API mock
  http.get('https://api.open-meteo.com/v1/forecast', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('latitude');
    const lon = url.searchParams.get('longitude');
    const units = url.searchParams.get('temperature_unit');

    const isFahrenheit = units === 'fahrenheit';
    const tempMultiplier = isFahrenheit ? 1.8 : 1;
    const tempOffset = isFahrenheit ? 32 : 0;

    const baseTemp = 20; // 20°C / 68°F
    const currentTemp = baseTemp * tempMultiplier + tempOffset;

    return HttpResponse.json({
      latitude: parseFloat(lat || '0'),
      longitude: parseFloat(lon || '0'),
      timezone: 'Europe/Belgrade',
      timezone_abbreviation: 'CET',
      utc_offset_seconds: 3600,
      current_weather: {
        temperature: currentTemp,
        weathercode: 1,
        time: new Date().toISOString(),
      },
      hourly: {
        time: Array.from({ length: 72 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() + i);
          return date.toISOString();
        }),
        temperature_2m: Array.from({ length: 72 }, (_, i) => {
          const hour = new Date().getHours() + i;
          const temp = baseTemp + Math.sin(((hour % 24) * Math.PI) / 12) * 5;
          return temp * tempMultiplier + tempOffset;
        }),
        relative_humidity_2m: Array.from(
          { length: 72 },
          () => 60 + Math.random() * 20
        ),
        weathercode: Array.from({ length: 72 }, () =>
          Math.floor(Math.random() * 4)
        ),
      },
    });
  }),
];
