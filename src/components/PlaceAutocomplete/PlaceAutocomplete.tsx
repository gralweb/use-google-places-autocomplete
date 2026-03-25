import { useState, useEffect, useRef, useCallback } from 'react';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import type { PlaceAutocompleteProps, PlaceResult, PlaceDetails } from './types';
import './PlaceAutocomplete.css';

export const PlaceAutocomplete = ({
  apiKey,
  onPlaceSelect,
  onError,
  placeholder = 'Search for a place...',
  className = '',
  inputClassName = '',
  listClassName = '',
  options = {},
  debounceMs = 300,
  minChars = 3,
}: PlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLoaded, loadError } = useGoogleMapsScript({ apiKey });

  useEffect(() => {
    if (!isLoaded) return;

    const initializeServices = () => {
      if (window.google?.maps?.places) {
        try {
          if (!autocompleteService.current) {
            autocompleteService.current = new google.maps.places.AutocompleteService();
          }
          if (!placesService.current) {
            const div = document.createElement('div');
            placesService.current = new google.maps.places.PlacesService(div);
          }
        } catch (error) {
          if (onError) {
            onError(error as Error);
          }
        }
      } else {
        setTimeout(initializeServices, 100);
      }
    };

    initializeServices();
  }, [isLoaded]);

  useEffect(() => {
    if (loadError && onError) {
      onError(loadError);
    }
  }, [loadError, onError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!autocompleteService.current || input.length < minChars || !window.google?.maps?.places) {
        setPredictions([]);
        return;
      }

      const request: google.maps.places.AutocompletionRequest = {
        input,
      };

      if (options.types) request.types = options.types;
      if (options.bounds) request.bounds = options.bounds;
      if (options.componentRestrictions?.country) {
        request.componentRestrictions = {
          country: options.componentRestrictions.country,
        };
      }

      try {
        autocompleteService.current.getPlacePredictions(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mappedResults: PlaceResult[] = results.map((result) => ({
              placeId: result.place_id,
              description: result.description,
              mainText: result.structured_formatting.main_text,
              secondaryText: result.structured_formatting.secondary_text || '',
              types: result.types || [],
            }));
            setPredictions(mappedResults);
            setIsOpen(true);
          } else {
            setPredictions([]);
          }
        });
      } catch (error) {
        setPredictions([]);
      }
    },
    [minChars, options]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchPredictions(value);
    }, debounceMs);
  };

  const getPlaceDetails = useCallback(
    (placeId: string) => {
      if (!placesService.current || !window.google?.maps?.places) return;

      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: options.fields || [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'address_components',
          'types',
          'formatted_phone_number',
          'international_phone_number',
          'website',
          'rating',
          'user_ratings_total',
        ],
      };

      try {
        placesService.current.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const placeDetails: PlaceDetails = {
              placeId: place.place_id || placeId,
              name: place.name || '',
              formattedAddress: place.formatted_address || '',
              geometry: place.geometry?.location
                ? {
                    location: {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    },
                  }
                : undefined,
              addressComponents: place.address_components,
              types: place.types,
              formattedPhoneNumber: place.formatted_phone_number,
              internationalPhoneNumber: place.international_phone_number,
              website: place.website,
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
            };

            if (onPlaceSelect) {
              onPlaceSelect(placeDetails);
            }
          } else if (onError) {
            onError(new Error(`Failed to get place details: ${status}`));
          }
        });
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    },
    [onPlaceSelect, onError, options.fields]
  );

  const handleSelectPlace = (prediction: PlaceResult) => {
    setInputValue(prediction.description);
    setIsOpen(false);
    setPredictions([]);
    getPlaceDetails(prediction.placeId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleSelectPlace(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  if (!isLoaded) {
    return <div className="place-autocomplete-loading">Loading Google Maps...</div>;
  }

  if (loadError) {
    return <div className="place-autocomplete-error">Error loading Google Maps</div>;
  }

  return (
    <div ref={containerRef} className={`place-autocomplete ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`place-autocomplete-input ${inputClassName}`}
        autoComplete="off"
      />
      
      {isOpen && predictions.length > 0 && (
        <ul className={`place-autocomplete-list ${listClassName}`}>
          {predictions.map((prediction, index) => (
            <li
              key={prediction.placeId}
              className={`place-autocomplete-item ${
                index === selectedIndex ? 'place-autocomplete-item-selected' : ''
              }`}
              onClick={() => handleSelectPlace(prediction)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="place-autocomplete-item-main">{prediction.mainText}</div>
              {prediction.secondaryText && (
                <div className="place-autocomplete-item-secondary">
                  {prediction.secondaryText}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
