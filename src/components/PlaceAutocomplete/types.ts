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
  addressComponents?: google.maps.GeocoderAddressComponent[];
  types?: string[];
  formattedPhoneNumber?: string;
  internationalPhoneNumber?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
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
  apiKey: string;
  onPlaceSelect?: (place: PlaceDetails) => void;
  onError?: (error: Error) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  options?: AutocompleteOptions;
  debounceMs?: number;
  minChars?: number;
}
