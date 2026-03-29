import { usePlacesAutocomplete } from "../../hooks";
import type { PlaceAutocompleteProps } from "../../types";
import "./PlaceAutocomplete.css";

export const PlaceAutocomplete = ({
  onPlaceSelect,
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
}: PlaceAutocompleteProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { 
    inputProps, 
    containerRef, 
    predictions, 
    isOpen,
    selectedIndex,
    handleSelectPlace,
    isLoaded, 
    loadError 
  } = usePlacesAutocomplete({
    apiKey,
    onPlaceSelect,
    options,
  });

  if (!isLoaded) {
    return (
      <div className="place-autocomplete-loading">Loading Google Maps...</div>
    );
  }

  if (loadError) {
    return <div className="place-autocomplete-error">{loadError.message}</div>;
  }

  return (
    <div ref={containerRef} className={`place-autocomplete ${className}`}>
      <input
        {...inputProps}
        type="text"
        placeholder={placeholder}
        className={`place-autocomplete-input ${inputClassName}`}
      />

      {isOpen && predictions.length > 0 && (
        <ul className={`place-autocomplete-list ${listClassName}`}>
          {predictions.map((prediction, index) => (
            <li
              key={prediction.placeId}
              className={`place-autocomplete-item ${
                index === selectedIndex ? "place-autocomplete-item-selected" : ""
              }`}
              onClick={() => handleSelectPlace(prediction)}
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
