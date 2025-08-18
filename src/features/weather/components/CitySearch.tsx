import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { geocodeCity } from '../api/geocode';
import { queryKeys } from '../api/keys';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { City } from '../api/types';
import { SearchIcon, XMarkIcon } from './icons';

interface CitySearchProps {
  onSelect: (city: City) => void;
  placeholder?: string;
  className?: string;
}

export default function CitySearch({
  onSelect,
  placeholder = 'Search for a city...',
  className = '',
}: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const debouncedQuery = useDebouncedValue(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: cities = [],
    isPending,
    error,
  } = useQuery({
    queryKey: queryKeys.geocode(debouncedQuery),
    queryFn: () => geocodeCity(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (inputRef.current && isOpen) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, cities, debouncedQuery]);

  useEffect(() => {
    if (cities.length > 0 && debouncedQuery.length >= 2) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [cities, debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setInputValue(value);
    setIsOpen(value.length >= 2);
  };

  const handleSelect = (city: City) => {
    onSelect(city);
    setInputValue(`${city.name}, ${city.country}`);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < cities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && cities[selectedIndex]) {
          handleSelect(cities[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (cities.length > 0 && debouncedQuery.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-auto"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 99999,
        }}
        role="listbox"
      >
        {isPending && (
          <div className="px-4 py-3 text-gray-500 text-center">
            Searching...
          </div>
        )}

        {error && (
          <div className="px-4 py-3 text-red-500 text-center">
            Error searching cities. Please try again.
          </div>
        )}

        {!isPending &&
          !error &&
          cities.length === 0 &&
          debouncedQuery.length >= 2 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              No cities found
            </div>
          )}

        {cities.map((city, index) => (
          <button
            key={city.id}
            type="button"
            onClick={() => handleSelect(city)}
            onMouseEnter={() => setSelectedIndex(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
              index === selectedIndex ? 'bg-gray-50' : ''
            }`}
          >
            <div className="font-medium text-gray-900">{city.name}</div>
            <div className="text-sm text-gray-500">{city.country}</div>
          </button>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-label="Search for a city"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          className="search-input pl-10 pr-10"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <XMarkIcon />
          </button>
        )}
      </div>

      {renderDropdown()}
    </div>
  );
}
