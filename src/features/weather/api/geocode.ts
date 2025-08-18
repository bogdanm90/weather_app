import { fetchJson } from '@/lib/fetchJson';
import { City, GeocodingResponse } from './types';

export async function geocodeCity(query: string): Promise<City[]> {
  if (query.length < 2) return [];

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '8');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  try {
    const data = await fetchJson<GeocodingResponse>(url.toString());
    return (data.results ?? []).map((result) => ({
      id: result.id,
      name: result.name,
      country: result.country,
      lat: result.latitude,
      lon: result.longitude,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}
