import { usePlacesAutocomplete } from "./usePlacesAutocomplete";
import type { PlaceAutocompleteProps } from "./types";
import "./PlaceAutocomplete.css";

export const PlaceAutocomplete = ({
  onPlaceSelect,
  onError,
  placeholder = "Search for a place...",
  className = "",
  inputClassName = "",
  listClassName = "",
  options = {
    types: ["geocode"],
    fields: [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "addressComponents",
    ],
  },
  debounceMs = 300,
  minChars = 3,
}: PlaceAutocompleteProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const {
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
    setSelectedIndex,
  } = usePlacesAutocomplete({
    apiKey,
    onPlaceSelect,
    onError,
    options,
    debounceMs,
    minChars,
  });

  if (!isLoaded) {
    return (
      <div className="place-autocomplete-loading">Loading Google Maps...</div>
    );
  }

  if (loadError) {
    return (
      <div className="place-autocomplete-error">Error loading Google Maps</div>
    );
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
                index === selectedIndex
                  ? "place-autocomplete-item-selected"
                  : ""
              }`}
              onClick={() => handleSelectPlace(prediction)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="place-autocomplete-item-main">
                {prediction.mainText}
              </div>
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
