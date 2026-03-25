import { useState, useEffect, useRef, useCallback } from "react";
import { useGoogleMapsScript } from "./useGoogleMapsScript";
import type { PlaceResult, PlaceDetails, AutocompleteOptions } from "./types";

export interface UsePlacesAutocompleteOptions {
  apiKey: string;
  onPlaceSelect?: (place: PlaceDetails) => void;
  onError?: (error: Error) => void;
  options?: AutocompleteOptions;
  debounceMs?: number;
  minChars?: number;
}

export interface UsePlacesAutocompleteReturn {
  inputValue: string;
  predictions: PlaceResult[];
  isOpen: boolean;
  selectedIndex: number;
  isLoaded: boolean;
  loadError: Error | null;
  containerRef: React.RefObject<HTMLDivElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectPlace: (prediction: PlaceResult) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedIndex: (index: number) => void;
}

export const usePlacesAutocomplete = ({
  apiKey,
  onPlaceSelect,
  onError,
  options = {},
  debounceMs = 300,
  minChars = 3,
}: UsePlacesAutocompleteOptions): UsePlacesAutocompleteReturn => {
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  const { isLoaded, loadError } = useGoogleMapsScript({ apiKey });

  useEffect(() => {
    if (!isLoaded) return;

    const initializeServices = () => {
      if (window.google?.maps?.places) {
        try {
          if (!sessionToken.current) {
            sessionToken.current =
              new google.maps.places.AutocompleteSessionToken();
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
  }, [isLoaded, onError]);

  useEffect(() => {
    if (loadError && onError) {
      onError(loadError);
    }
  }, [loadError, onError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (
        !sessionToken.current ||
        input.length < minChars ||
        !window.google?.maps?.places
      ) {
        setPredictions([]);
        return;
      }

      const request: any = {
        input,
        sessionToken: sessionToken.current,
      };

      if (options.types && options.types.length > 0) {
        request.includedPrimaryTypes = options.types;
      }
      if (options.componentRestrictions?.country) {
        request.includedRegionCodes = Array.isArray(
          options.componentRestrictions.country,
        )
          ? options.componentRestrictions.country
          : [options.componentRestrictions.country];
      }
      if (options.bounds) {
        request.locationBias = options.bounds;
      }

      try {
        const { suggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request,
          );

        if (suggestions && suggestions.length > 0) {
          const mappedResults: PlaceResult[] = suggestions.map(
            (suggestion: any) => {
              const placePrediction = suggestion.placePrediction;
              return {
                placeId: placePrediction?.placeId || "",
                description: placePrediction?.text?.text || "",
                mainText: placePrediction?.mainText?.text || "",
                secondaryText: placePrediction?.secondaryText?.text || "",
                types: placePrediction?.types || [],
              };
            },
          );
          setPredictions(mappedResults);
          setIsOpen(true);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        setPredictions([]);
        if (onError) {
          onError(error as Error);
        }
      }
    },
    [minChars, options, onError],
  );

  const getPlaceDetails = useCallback(
    async (placeId: string) => {
      if (!window.google?.maps?.places) return;

      try {
        const place = new google.maps.places.Place({
          id: placeId,
        });

        const fields = options.fields || [
          "id",
          "displayName",
          "formattedAddress",
          "location",
          "addressComponents",
          "types",
          "nationalPhoneNumber",
          "internationalPhoneNumber",
          "websiteURI",
          "rating",
          "userRatingCount",
        ];

        await place.fetchFields({ fields });

        const placeDetails: PlaceDetails = {
          placeId: place.id || placeId,
          name: place.displayName || "",
          formattedAddress: place.formattedAddress || "",
          geometry: place.location
            ? {
                location: {
                  lat: place.location.lat(),
                  lng: place.location.lng(),
                },
              }
            : undefined,
          addressComponents: place.addressComponents,
          types: place.types,
          formattedPhoneNumber: place.nationalPhoneNumber,
          internationalPhoneNumber: place.internationalPhoneNumber,
          website: place.websiteURI,
          rating: place.rating,
          userRatingsTotal: place.userRatingCount,
        };

        if (sessionToken.current) {
          sessionToken.current =
            new google.maps.places.AutocompleteSessionToken();
        }

        if (onPlaceSelect) {
          onPlaceSelect(placeDetails);
        }
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    },
    [onPlaceSelect, onError, options.fields],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setSelectedIndex(-1);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        void fetchPredictions(value);
      }, debounceMs);
    },
    [debounceMs, fetchPredictions],
  );

  const handleSelectPlace = useCallback(
    (prediction: PlaceResult) => {
      setInputValue(prediction.description);
      setIsOpen(false);
      setPredictions([]);
      getPlaceDetails(prediction.placeId);
    },
    [getPlaceDetails],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || predictions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < predictions.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < predictions.length) {
            handleSelectPlace(predictions[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, predictions, selectedIndex, handleSelectPlace],
  );

  return {
    inputValue,
    predictions,
    isOpen,
    selectedIndex,
    isLoaded,
    loadError,
    containerRef,
    handleInputChange,
    handleSelectPlace,
    handleKeyDown,
    setIsOpen,
    setSelectedIndex,
  };
};
