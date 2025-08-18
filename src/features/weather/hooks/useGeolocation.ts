import { useState, useEffect } from 'react';

interface GeolocationState {
  coords: { lat: number; lon: number } | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation(timeoutMs = 5000): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState({
        coords: null,
        error: 'Geolocation not supported by this browser',
        isLoading: false,
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: timeoutMs,
      maximumAge: 600000, // 10 minutes
    };

    const successHandler = (position: GeolocationPosition) => {
      setState({
        coords: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        error: null,
        isLoading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = 'Unknown error occurred';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            'Location access denied. Please enable location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }

      setState({
        coords: null,
        error: errorMessage,
        isLoading: false,
      });
    };

    const watchId = navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );

    return () => {
      if (typeof watchId === 'number') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [timeoutMs]);

  return state;
}
