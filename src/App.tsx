import { useState } from "react";
import { PlaceAutocomplete } from "./components/PlaceAutocomplete";
import "./App.css";
import type { PlaceDetails } from "./types";

function App() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const handlePlaceSelect = (place: PlaceDetails) => {
    setSelectedPlace(place);
    console.log("Selected place:", place);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🗺️ Google Maps Place Autocomplete</h1>
        <p className="subtitle">
          Clean and reusable React component with TypeScript
        </p>

        <div className="demo-section">
          <h2>Try it out</h2>
          <PlaceAutocomplete
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for a place..."
          />
        </div>

        {selectedPlace && (
          <div className="result-section">
            <h2>Selected Place</h2>
            <div className="result-card">
              <div className="result-item">
                <strong>Name:</strong> {selectedPlace.name}
              </div>
              <div className="result-item">
                <strong>Address:</strong> {selectedPlace.formattedAddress}
              </div>
              {selectedPlace.geometry && (
                <div className="result-item">
                  <strong>Coordinates:</strong>{" "}
                  {selectedPlace.geometry.location.lat.toFixed(6)},{" "}
                  {selectedPlace.geometry.location.lng.toFixed(6)}
                </div>
              )}
              {selectedPlace.formattedPhoneNumber && (
                <div className="result-item">
                  <strong>Phone:</strong> {selectedPlace.formattedPhoneNumber}
                </div>
              )}
              {selectedPlace.website && (
                <div className="result-item">
                  <strong>Website:</strong>{" "}
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedPlace.website}
                  </a>
                </div>
              )}
              {selectedPlace.rating && (
                <div className="result-item">
                  <strong>Rating:</strong> ⭐ {selectedPlace.rating} (
                  {selectedPlace.userRatingsTotal} reviews)
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h2>Features</h2>
          <ul>
            <li>✅ Clean and modular architecture</li>
            <li>✅ Full TypeScript support</li>
            <li>✅ Debounced search</li>
            <li>✅ Keyboard navigation (Arrow keys, Enter, Escape)</li>
            <li>✅ Customizable styling</li>
            <li>✅ Easy to extract and reuse</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
