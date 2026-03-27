import type { AutocompleteOptions, PlaceDetails } from "../types";

export const getPlaceDetails = async (
  placeId: string,
  options: AutocompleteOptions,
): Promise<PlaceDetails | null> => {
  if (!window.google?.maps?.places) return null;

  try {
    const place = new google.maps.places.Place({
      id: placeId,
    });

    const fields = options.fields || [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "addressComponents",
      "types",
      "nationalPhoneNumber",
      "internationalPhoneNumber",
      "websiteURI",
      "rating",
      "userRatingCount",
    ];

    await place.fetchFields({ fields });

    const placeDetails: PlaceDetails = {
      placeId: place.id || placeId,
      name: place.displayName || "",
      formattedAddress: place.formattedAddress || "",
      geometry: place.location
        ? {
            location: {
              lat: place.location.lat(),
              lng: place.location.lng(),
            },
          }
        : undefined,
      addressComponents: place.addressComponents,
      types: place.types,
      formattedPhoneNumber: place.nationalPhoneNumber,
      internationalPhoneNumber: place.internationalPhoneNumber,
      website: place.websiteURI,
      rating: place.rating,
      userRatingsTotal: place.userRatingCount,
    };

    return placeDetails;
  } catch (error) {
    throw error;
  }
};
