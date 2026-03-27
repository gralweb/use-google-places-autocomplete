export interface PlaceResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  addressComponents?: google.maps.places.AddressComponent[];
  types?: string[];
  formattedPhoneNumber?: string | null;
  internationalPhoneNumber?: string | null;
  website?: string | null;
  rating?: number | null;
  userRatingsTotal?: number | null;
}

export interface AutocompleteOptions {
  types?: string[];
  componentRestrictions?: {
    country?: string | string[] | null;
  };
  fields?: string[];
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
}

export interface PlaceAutocompleteProps {
  onPlaceSelect?: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  options?: AutocompleteOptions;
}

export interface UsePlacesAutocompleteOptions {
  apiKey: string;
  onPlaceSelect?: (place: PlaceDetails) => void;
  options?: AutocompleteOptions;
  debounceMs?: number;
  minChars?: number;
  listClassName?: string;
}

export interface UsePlacesAutocompleteReturn {
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    autoComplete: string;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
  suggestions: React.ReactNode | null;
  isLoaded: boolean;
  loadError: Error | null;
  clearSuggestions: () => void;
  setValue: (value: string) => void;
}
