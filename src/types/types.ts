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
  onError?: (error: Error) => void;
  options?: AutocompleteOptions;
  debounceMs?: number;
  minChars?: number;
}

export interface UsePlacesAutocompleteReturn {
  getInputProps: (
    userProps?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefObject<HTMLInputElement>;
  };
  /** @deprecated Use getInputProps() instead for better control over input props */
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    autoComplete: string;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
  predictions: PlaceResult[];
  isOpen: boolean;
  selectedIndex: number;
  handleSelectPlace: (prediction: PlaceResult) => void;
  isLoaded: boolean;
  loadError: Error | null;
  clearSuggestions: () => void;
  setValue: (value: string) => void;
}
