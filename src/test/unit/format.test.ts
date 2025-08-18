import { describe, it, expect } from 'vitest';
import {
  formatTemperature,
  convertCtoF,
  convertFtoC,
  getWeatherIcon,
  getWeatherDescription,
} from '@/lib/format';

describe('format utilities', () => {
  describe('formatTemperature', () => {
    it('should format Celsius temperature correctly', () => {
      expect(formatTemperature(25, 'c')).toBe('25°C');
      expect(formatTemperature(0, 'c')).toBe('0°C');
      expect(formatTemperature(-10, 'c')).toBe('-10°C');
    });

    it('should format Fahrenheit temperature correctly', () => {
      expect(formatTemperature(77, 'f')).toBe('77°F');
      expect(formatTemperature(32, 'f')).toBe('32°F');
      expect(formatTemperature(-4, 'f')).toBe('-4°F');
    });
  });

  describe('convertCtoF', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(convertCtoF(0)).toBe(32);
      expect(convertCtoF(100)).toBe(212);
      expect(convertCtoF(25)).toBe(77);
      expect(convertCtoF(-40)).toBe(-40);
    });
  });

  describe('convertFtoC', () => {
    it('should convert Fahrenheit to Celsius correctly', () => {
      expect(convertFtoC(32)).toBe(0);
      expect(convertFtoC(212)).toBe(100);
      expect(convertFtoC(77)).toBe(25);
      expect(convertFtoC(-40)).toBe(-40);
    });
  });

  describe('getWeatherIcon', () => {
    it('should return correct icons for weather codes', () => {
      expect(getWeatherIcon(0)).toBe('☀️'); // Clear sky
      expect(getWeatherIcon(1)).toBe('🌤️'); // Mainly clear
      expect(getWeatherIcon(2)).toBe('⛅'); // Partly cloudy
      expect(getWeatherIcon(3)).toBe('☁️'); // Overcast
      expect(getWeatherIcon(95)).toBe('⛈️'); // Thunderstorm
    });

    it('should return default icon for unknown codes', () => {
      expect(getWeatherIcon(999)).toBe('🌤️');
    });
  });

  describe('getWeatherDescription', () => {
    it('should return correct descriptions for weather codes', () => {
      expect(getWeatherDescription(0)).toBe('Clear sky');
      expect(getWeatherDescription(1)).toBe('Mainly clear');
      expect(getWeatherDescription(2)).toBe('Partly cloudy');
      expect(getWeatherDescription(3)).toBe('Overcast');
      expect(getWeatherDescription(95)).toBe('Thunderstorm');
    });

    it('should return "Unknown" for unknown codes', () => {
      expect(getWeatherDescription(999)).toBe('Unknown');
    });
  });
});
