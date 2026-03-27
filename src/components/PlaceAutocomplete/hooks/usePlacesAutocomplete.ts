import { useState, useEffect, useRef, useCallback } from "react";
import { useGoogleMapsScript } from "./useGoogleMapsScript";
import type {
  PlaceResult,
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn,
} from "../types";
import { getPlaceDetails, getPredictions } from "../helpers";
import { Suggestions } from "../Suggestions";

export const usePlacesAutocomplete = ({
  apiKey,
  onPlaceSelect,
  options = {},
  debounceMs = 300,
  minChars = 3,
  listClassName = "",
}: UsePlacesAutocompleteOptions): UsePlacesAutocompleteReturn => {
  const { isLoaded, loadError } = useGoogleMapsScript({ apiKey });

  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPredictions = useCallback(
    async (input: string) => {
      try {
        if (input.length < minChars) {
          setPredictions([]);
          setIsOpen(false);
          return;
        }

        const predictions = await getPredictions(input, {
          sessionToken: sessionToken.current,
          options,
        });

        console.log("predictions", predictions);

        setPredictions(predictions);
        setIsOpen(predictions.length > 0);
      } catch (error) {
        setIsOpen(false);
        setPredictions([]);

        console.error("Error fetching predictions:", error);
      }
    },
    [minChars, options],
  );

  const fetchPlaceDetails = useCallback(
    async (placeId: string) => {
      try {
        const placeDetails = await getPlaceDetails(placeId, options);

        if (onPlaceSelect && placeDetails) {
          onPlaceSelect(placeDetails);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    },
    [onPlaceSelect, options],
  );

  const handleSelectPlace = useCallback(
    (prediction: PlaceResult) => {
      setIsOpen(false);
      setPredictions([]);
      setInputValue(prediction.description);
      fetchPlaceDetails(prediction.placeId);
    },
    [fetchPlaceDetails],
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

  const clearSuggestions = useCallback(() => {
    setIsOpen(false);
    setPredictions([]);
  }, []);

  const setValue = useCallback((value: string) => {
    setInputValue(value);
  }, []);

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
          console.error("Error initializing services:", error);
        }
      } else {
        setTimeout(initializeServices, 100);
      }
    };

    initializeServices();
  }, [isLoaded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  return {
    inputProps: {
      ref: inputRef,
      value: inputValue,
      onChange: handleInputChange,
      onKeyDown: handleKeyDown,
      autoComplete: "off",
    },
    containerRef,
    suggestions: isOpen
      ? Suggestions({
          listClassName,
          predictions,
          onSelectPlace: handleSelectPlace,
          selected: { index: selectedIndex, setIndex: setSelectedIndex },
        })
      : null,
    isLoaded,
    loadError,
    clearSuggestions,
    setValue,
  };
};
