# Migración a las nuevas APIs de Google Maps Places

## Cambios realizados

### 1. AutocompleteService → AutocompleteSuggestion

**Antes (API deprecada):**

```typescript
const autocompleteService = new google.maps.places.AutocompleteService();
autocompleteService.getPlacePredictions(request, callback);
```

**Después (Nueva API):**

```typescript
const sessionToken = new google.maps.places.AutocompleteSessionToken();
const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
  input,
  sessionToken,
  includedPrimaryTypes: ['geocode'],
  includedRegionCodes: ['US']
});
```

### 2. PlacesService → Place API

**Antes (API deprecada):**

```typescript
const placesService = new google.maps.places.PlacesService(div);
placesService.getDetails(request, callback);
```

**Después (Nueva API):**

```typescript
const place = new google.maps.places.Place({ id: placeId });
await place.fetchFields({ 
  fields: ['id', 'displayName', 'formattedAddress', 'location'] 
});
```

### 3. Cambios en los nombres de campos

| Campo Antiguo | Campo Nuevo |
| ------------- | ----------- |
| `place_id` | `id` |
| `name` | `displayName` |
| `formatted_address` | `formattedAddress` |
| `geometry.location` | `location` |
| `address_components` | `addressComponents` |
| `formatted_phone_number` | `nationalPhoneNumber` |
| `international_phone_number` | `internationalPhoneNumber` |
| `website` | `websiteURI` |
| `user_ratings_total` | `userRatingCount` |

### 4. Cambios en tipos de restricción

**Antes:**

```typescript
{
  types: ['address'],
  componentRestrictions: { country: 'US' }
}
```

**Después:**

```typescript
{
  includedPrimaryTypes: ['geocode'],
  includedRegionCodes: ['US']
}
```

### 5. Session Tokens

La nueva API utiliza tokens de sesión para optimizar el costo:

- Se crea un token al inicio
- Se usa en todas las búsquedas de autocompletado
- Se renueva después de obtener los detalles del lugar

## Beneficios de la migración

1. **API moderna y mantenida**: Las nuevas APIs recibirán actualizaciones y correcciones
2. **Mejor rendimiento**: Optimizaciones en la carga y uso de recursos
3. **Async/Await**: Código más limpio y fácil de mantener
4. **Mejor tipado**: TypeScript con tipos más precisos

## Archivos modificados

- `src/components/PlaceAutocomplete/PlaceAutocomplete.tsx`
- `src/components/PlaceAutocomplete/useGoogleMapsScript.ts`
- `src/components/PlaceAutocomplete/types.ts`
- `src/App.tsx`

## Referencias

- [Guía de migración oficial](https://developers.google.com/maps/documentation/javascript/places-migration-overview)
- [AutocompleteSuggestion API](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSuggestion)
- [Place API](https://developers.google.com/maps/documentation/javascript/reference/place)
