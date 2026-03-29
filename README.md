# use-google-places-autocomplete

> Headless React hook for Google Places Autocomplete. Bring your own UI.

[![npm version](https://badge.fury.io/js/%40gralweb%2Fuse-google-places-autocomplete.svg)](https://www.npmjs.com/package/@gralweb/use-google-places-autocomplete)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why Headless?

This package provides **only the logic** for Google Places Autocomplete, giving you complete freedom to build your own UI:

- ✅ **No CSS to override** - Use your own styles
- ✅ **Works with any UI library** - shadcn, MUI, Chakra, Tailwind, etc.
- ✅ **Smaller bundle size** - Only the hook logic
- ✅ **Full TypeScript support** - Complete type safety
- ✅ **Modern Google Places API** - Uses latest API features

## Installation

```bash
npm install @gralweb/use-google-places-autocomplete
# or
yarn add @gralweb/use-google-places-autocomplete
# or
pnpm add @gralweb/use-google-places-autocomplete
```

## Quick Start

```tsx
import { usePlacesAutocomplete } from '@gralweb/use-google-places-autocomplete'

function MyAutocomplete() {
  const { 
    inputProps, 
    containerRef, 
    predictions, 
    isOpen, 
    handleSelectPlace,
    isLoaded 
  } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    onPlaceSelect: (place) => {
      console.log('Selected place:', place)
    },
  })

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div ref={containerRef}>
      <input {...inputProps} placeholder="Search places..." />
      {isOpen && predictions.length > 0 && (
        <ul>
          {predictions.map((prediction) => (
            <li 
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## API Reference

### `usePlacesAutocomplete(options)`

#### Options

| Option | Type | Required | Default | Description |
| ------ | ---- | -------- | ------- | ----------- |
| `apiKey` | `string` | ✅ | - | Google Maps API Key |
| `onPlaceSelect` | `(place: PlaceDetails) => void` | ❌ | - | Callback when a place is selected |
| `onError` | `(error: Error) => void` | ❌ | - | Error handler callback |
| `options` | `AutocompleteOptions` | ❌ | See below | Google Places API options |
| `debounceMs` | `number` | ❌ | `300` | Debounce delay in milliseconds |
| `minChars` | `number` | ❌ | `3` | Minimum characters to trigger search |

**Default `options`:**

```typescript
{
  types: ['geocode'],
  fields: [
    'id',
    'displayName',
    'formattedAddress',
    'location',
    'addressComponents',
  ],
}
```

#### Returns

```typescript
{
  // Props to spread on your input element
  inputProps: {
    ref: React.RefObject<HTMLInputElement>
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    autoComplete: string
  }
  
  // Ref for the container (handles click-outside)
  containerRef: React.RefObject<HTMLDivElement | null>
  
  // Predictions array
  predictions: PlaceResult[]
  
  // UI state
  isOpen: boolean
  selectedIndex: number
  
  // Selection handler
  handleSelectPlace: (prediction: PlaceResult) => void
  
  // Loading state
  isLoaded: boolean
  loadError: Error | null
  
  // Manual control methods
  clearSuggestions: () => void
  setValue: (value: string) => void
}
```

## Examples

### With Custom Styling

```tsx
import { usePlacesAutocomplete } from '@gralweb/use-google-places-autocomplete'

function StyledAutocomplete() {
  const { 
    inputProps, 
    containerRef, 
    predictions, 
    isOpen,
    selectedIndex,
    handleSelectPlace 
  } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      console.log('Selected:', place.formattedAddress)
    },
  })

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input 
        {...inputProps} 
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Search for a place..."
      />
      {isOpen && predictions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg">
          {predictions.map((prediction, index) => (
            <li
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
            >
              <div className="font-medium">{prediction.mainText}</div>
              <div className="text-sm text-gray-500">{prediction.secondaryText}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### With shadcn/ui

```tsx
import { usePlacesAutocomplete } from '@gralweb/use-google-places-autocomplete'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function ShadcnExample() {
  const { 
    inputProps, 
    containerRef, 
    predictions, 
    isOpen,
    handleSelectPlace 
  } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => console.log(place),
  })

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Input {...inputProps} placeholder="Search places..." />
      {isOpen && predictions.length > 0 && (
        <Card className="absolute w-full mt-1 p-0">
          {predictions.map((prediction) => (
            <div
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
              className="px-4 py-2 cursor-pointer hover:bg-accent"
            >
              {prediction.description}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
```

### With Material-UI

```tsx
import { usePlacesAutocomplete } from '@gralweb/use-google-places-autocomplete'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'

function MUIExample() {
  const { 
    inputProps, 
    containerRef, 
    predictions, 
    isOpen,
    handleSelectPlace 
  } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  return (
    <div ref={containerRef}>
      <TextField
        {...inputProps}
        label="Search places"
        variant="outlined"
        fullWidth
      />
      {isOpen && predictions.length > 0 && (
        <Paper elevation={3}>
          <List>
            {predictions.map((prediction) => (
              <ListItem
                key={prediction.placeId}
                button
                onClick={() => handleSelectPlace(prediction)}
              >
                {prediction.description}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  )
}
```

### With Manual Control

```tsx
import { usePlacesAutocomplete } from '@gralweb/use-google-places-autocomplete'

function AdvancedExample() {
  const { 
    inputProps, 
    containerRef, 
    predictions,
    isOpen,
    handleSelectPlace,
    clearSuggestions,
    setValue,
    isLoaded,
    loadError
  } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      console.log('Selected:', place)
      setTimeout(() => clearSuggestions(), 100)
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  })

  const handleClear = () => {
    setValue('')
    clearSuggestions()
  }

  if (loadError) {
    return <div>Error: {loadError.message}</div>
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <input {...inputProps} className="flex-1" />
        <button onClick={handleClear}>Clear</button>
      </div>
      {isOpen && predictions.length > 0 && (
        <ul>
          {predictions.map((prediction) => (
            <li 
              key={prediction.placeId}
              onClick={() => handleSelectPlace(prediction)}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### Restrict by Country

```tsx
const { inputProps, containerRef, predictions, isOpen } = usePlacesAutocomplete({
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  options: {
    componentRestrictions: { country: 'us' },
  },
})
```

### Filter by Type

```tsx
const { inputProps, containerRef, predictions, isOpen } = usePlacesAutocomplete({
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  options: {
    types: ['restaurant', 'cafe'],
  },
})
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type { 
  PlaceDetails, 
  PlaceResult,
  AutocompleteOptions,
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn
} from '@gralweb/use-google-places-autocomplete'

const handleSelect = (place: PlaceDetails) => {
  console.log(place.formattedAddress)
  console.log(place.geometry?.location.lat)
  console.log(place.geometry?.location.lng)
}
```

## Advanced Usage

### Using Helpers Directly

```typescript
import { getPredictions, getPlaceDetails } from '@gralweb/use-google-places-autocomplete'

// Get predictions manually
const predictions = await getPredictions('New York', {
  sessionToken: myToken,
  options: { types: ['geocode'] }
})

// Get place details manually
const details = await getPlaceDetails('ChIJOwg_06VPwokRYv534QaPC8g', {
  fields: ['formattedAddress', 'location']
})
```

### Using Constants

```typescript
import { 
  DEFAULT_AUTOCOMPLETE_OPTIONS,
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_MIN_CHARS
} from '@gralweb/use-google-places-autocomplete'

console.log(DEFAULT_DEBOUNCE_MS) // 300
console.log(DEFAULT_MIN_CHARS)   // 3
```

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a project or select an existing one
3. Enable **Places API (New)**
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domain

## ⚠️ Important Legal Notice

This package is a wrapper around the Google Maps Places API. **Users of this package must:**

1. Have a valid Google Maps API Key
2. Comply with [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
3. Follow [Google Maps Platform Usage Limits](https://developers.google.com/maps/documentation/javascript/usage-and-billing)
4. Display the Google logo and attributions as required by Google's terms
5. Be responsible for any API usage fees incurred

**This package and its author are not affiliated with, endorsed by, or sponsored by Google LLC.**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](LICENSE) file for details.

### Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Users are solely responsible for:**

- Complying with Google Maps Platform Terms of Service
- Any applicable usage fees from Google
- Proper implementation and security of API keys
- Meeting Google's attribution requirements

## Contributing

Contributions are welcome! Please open an issue or pull request.

## Support

- [GitHub Issues](https://github.com/gralweb/use-google-places-autocomplete/issues)
- [Documentation](https://github.com/gralweb/use-google-places-autocomplete#readme)
