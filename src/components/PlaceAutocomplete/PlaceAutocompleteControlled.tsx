import { useState } from "react";
import type { PlaceDetails } from "../../types";
import { usePlacesAutocomplete } from "../../hooks";

export const ControlledInputExample = () => {
  const [address, setAddress] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const {
    getInputProps,
    containerRef,
    predictions,
    isOpen,
    handleSelectPlace,
    selectedIndex,
  } = usePlacesAutocomplete({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      setSelectedPlace(place);
      setAddress(place.formattedAddress);
    },
  });

  return (
    <div className="demo-section">
      <h2>Controlled Input Example (using getInputProps)</h2>
      <div ref={containerRef} style={{ position: "relative" }}>
        <input
          {...getInputProps({
            value: address,
            onChange: (e) => setAddress(e.target.value),
            placeholder: "Enter address (controlled)...",
            className: "autocomplete-input",
            style: {
              width: "100%",
              boxSizing: "border-box",
              padding: "0.5rem",
              outline: "none",
            },
          })}
        />
        {isOpen && predictions.length > 0 && (
          <ul className="autocomplete-list">
            {predictions.map((prediction, index) => (
              <li
                key={prediction.placeId}
                className={`autocomplete-item ${
                  index === selectedIndex
                    ? "place-autocomplete-item-selected"
                    : ""
                }`}
                onClick={() => {
                  handleSelectPlace(prediction);
                }}
              >
                <div className="autocomplete-item-main">
                  {prediction.mainText}
                </div>
                <div className="autocomplete-item-secondary">
                  {prediction.secondaryText}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
        Current value: <strong>{address || "(empty)"}</strong>
      </div>
      {selectedPlace && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f0f9ff",
            borderRadius: "0.5rem",
          }}
        >
          <strong>Selected:</strong> {selectedPlace.name} -{" "}
          {selectedPlace.formattedAddress}
        </div>
      )}
    </div>
  );
};
