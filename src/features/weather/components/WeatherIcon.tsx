import { getWeatherIcon, getWeatherDescription } from '@/lib/format';

interface WeatherIconProps {
  weatherCode: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showDescription?: boolean;
}

export default function WeatherIcon({
  weatherCode,
  size = 'md',
  className = '',
  showDescription = false,
}: WeatherIconProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const icon = getWeatherIcon(weatherCode);
  const description = getWeatherDescription(weatherCode);

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`${sizeClasses[size]} leading-none`}
        role="img"
        aria-label={description}
        title={description}
      >
        {icon}
      </div>
      {showDescription && (
        <div className="text-xs text-gray-600 mt-1">{description}</div>
      )}
    </div>
  );
}
