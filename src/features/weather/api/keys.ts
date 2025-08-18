export const queryKeys = {
  geocode: (query: string) => ['geocode', query] as const,
  weather: (lat: number, lon: number, units: string) =>
    ['weather', lat, lon, units] as const,
};
