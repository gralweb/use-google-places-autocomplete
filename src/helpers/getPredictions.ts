import type { AutocompleteOptions, PlaceResult } from "../types";

interface Props {
  sessionToken: google.maps.places.AutocompleteSessionToken | null;
  options: AutocompleteOptions;
}

/**
 * Fetches place predictions from Google Places API
 * 
 * @param input - Search query string
 * @param config - Configuration including session token and options
 * @returns Array of place predictions
 */
export const getPredictions = async (
  input: string,
  { sessionToken, options }: Props,
): Promise<PlaceResult[]> => {
  if (!sessionToken || !window.google?.maps?.places) {
    return [];
  }

  const request: any = {
    input,
    sessionToken,
  };

  if (options.types && options.types.length > 0) {
    request.includedPrimaryTypes = options.types;
  }
  if (options.componentRestrictions?.country) {
    request.includedRegionCodes = Array.isArray(
      options.componentRestrictions.country,
    )
      ? options.componentRestrictions.country
      : [options.componentRestrictions.country];
  }
  if (options.bounds) {
    request.locationBias = options.bounds;
  }

  try {
    const { suggestions } =
      await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
        request,
      );

    if (suggestions && suggestions.length > 0) {
      const mappedResults: PlaceResult[] = suggestions.map(
        (suggestion: any) => {
          const placePrediction = suggestion.placePrediction;
          return {
            placeId: placePrediction?.placeId || "",
            description: placePrediction?.text?.text || "",
            mainText: placePrediction?.mainText?.text || "",
            secondaryText: placePrediction?.secondaryText?.text || "",
            types: placePrediction?.types || [],
          };
        },
      );

      return mappedResults;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
