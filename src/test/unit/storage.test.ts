import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { safeGet, safeSet, safeRemove } from '@/lib/storage';

describe('storage utilities', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('safeGet', () => {
    it('should return parsed value from localStorage', () => {
      const mockValue = { test: 'data' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockValue));

      const result = safeGet('test-key', {});
      expect(result).toEqual(mockValue);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return fallback when key does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const fallback = { default: 'value' };

      const result = safeGet('non-existent-key', fallback);
      expect(result).toEqual(fallback);
    });

    it('should return fallback when JSON parsing fails', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      const fallback = { default: 'value' };

      const result = safeGet('invalid-key', fallback);
      expect(result).toEqual(fallback);
    });

    it('should return fallback when localStorage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      const fallback = { default: 'value' };

      const result = safeGet('error-key', fallback);
      expect(result).toEqual(fallback);
    });
  });

  describe('safeSet', () => {
    it('should set item in localStorage', () => {
      const testData = { test: 'data' };

      safeSet('test-key', testData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('should handle localStorage errors silently', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => safeSet('test-key', 'value')).not.toThrow();
    });
  });

  describe('safeRemove', () => {
    it('should remove item from localStorage', () => {
      safeRemove('test-key');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle localStorage errors silently', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => safeRemove('test-key')).not.toThrow();
    });
  });
});
