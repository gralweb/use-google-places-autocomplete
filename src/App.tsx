import { useState } from 'react'
import { PlaceAutocomplete } from './components/PlaceAutocomplete'
import type { PlaceDetails } from './components/PlaceAutocomplete'
import './App.css'

function App() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null)

  const handlePlaceSelect = (place: PlaceDetails) => {
    setSelectedPlace(place)
    console.log('Selected place:', place)
  }

  const handleError = (error: Error) => {
    console.error('Error:', error)
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="app">
        <div className="container">
          <h1>⚠️ API Key Required</h1>
          <p>Please create a <code>.env</code> file with your Google Maps API key:</p>
          <pre>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</pre>
          <p>
            Get your API key from{' '}
            <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer">
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🗺️ Google Maps Place Autocomplete</h1>
        <p className="subtitle">Clean and reusable React component with TypeScript</p>

        <div className="demo-section">
          <h2>Try it out</h2>
          <PlaceAutocomplete
            apiKey={apiKey}
            onPlaceSelect={handlePlaceSelect}
            onError={handleError}
            placeholder="Search for a place..."
            debounceMs={300}
            minChars={3}
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
                  <strong>Coordinates:</strong> {selectedPlace.geometry.location.lat.toFixed(6)}, {selectedPlace.geometry.location.lng.toFixed(6)}
                </div>
              )}
              {selectedPlace.formattedPhoneNumber && (
                <div className="result-item">
                  <strong>Phone:</strong> {selectedPlace.formattedPhoneNumber}
                </div>
              )}
              {selectedPlace.website && (
                <div className="result-item">
                  <strong>Website:</strong>{' '}
                  <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                    {selectedPlace.website}
                  </a>
                </div>
              )}
              {selectedPlace.rating && (
                <div className="result-item">
                  <strong>Rating:</strong> ⭐ {selectedPlace.rating} ({selectedPlace.userRatingsTotal} reviews)
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
  )
}

export default App
