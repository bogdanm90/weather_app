import { Units } from '../api/types';
import { safeGet, safeSet } from '@/lib/storage';

interface UnitToggleProps {
  units: Units;
  onUnitsChange: (units: Units) => void;
  className?: string;
}

const STORAGE_KEY = 'weather_units';

export default function UnitToggle({
  units,
  onUnitsChange,
  className = '',
}: UnitToggleProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Units:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => {
            if (units !== 'c') {
              onUnitsChange('c');
              safeSet(STORAGE_KEY, 'c');
            }
          }}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            units === 'c'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Use Celsius"
        >
          °C
        </button>
        <button
          type="button"
          onClick={() => {
            if (units !== 'f') {
              onUnitsChange('f');
              safeSet(STORAGE_KEY, 'f');
            }
          }}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            units === 'f'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Use Fahrenheit"
        >
          °F
        </button>
      </div>
    </div>
  );
}

// Helper function to get initial units from storage
export function getInitialUnits(): Units {
  return safeGet<Units>(STORAGE_KEY, 'c');
}
