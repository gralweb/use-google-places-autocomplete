# 🗺️ Google Maps Place Autocomplete

Implementación limpia y reutilizable de Google Maps Place Autocomplete con React + TypeScript.

## ✨ Características

- ✅ **Arquitectura modular**: Componente y hook reutilizables
- ✅ **TypeScript completo**: Tipos seguros y autocompletado
- ✅ **Debouncing**: Optimización de búsquedas
- ✅ **Navegación por teclado**: Flechas, Enter, Escape
- ✅ **Estilos personalizables**: CSS modular
- ✅ **Fácil de extraer**: Solo 5 archivos necesarios

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar API Key

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Obtener API Key:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Crea un proyecto o selecciona uno existente
3. Habilita **Places API**
4. Crea credenciales (API Key)

### 3. Ejecutar el proyecto

```bash
npm run dev
```

## 📦 Estructura del Componente

```txt
src/components/PlaceAutocomplete/
├── PlaceAutocomplete.tsx      # Componente principal
├── PlaceAutocomplete.css      # Estilos
├── useGoogleMapsScript.ts     # Hook para cargar el script
├── types.ts                   # Tipos TypeScript
└── index.ts                   # Exports
```

## 🔧 Uso Básico

```tsx
import { PlaceAutocomplete } from './components/PlaceAutocomplete'
import type { PlaceDetails } from './components/PlaceAutocomplete'

function App() {
  const handlePlaceSelect = (place: PlaceDetails) => {
    console.log('Lugar seleccionado:', place)
  }

  return (
    <PlaceAutocomplete
      apiKey="YOUR_API_KEY"
      onPlaceSelect={handlePlaceSelect}
      placeholder="Buscar un lugar..."
    />
  )
}
```

## ⚙️ Props del Componente

| Prop | Tipo | Requerido | Default | Descripción |
| ---- | ---- | --------- | ------- | ----------- |
| `apiKey` | `string` | ✅ | - | Google Maps API Key |
| `onPlaceSelect` | `(place: PlaceDetails) => void` | ❌ | - | Callback cuando se selecciona un lugar |
| `onError` | `(error: Error) => void` | ❌ | - | Callback para errores |
| `placeholder` | `string` | ❌ | `"Search for a place..."` | Placeholder del input |
| `className` | `string` | ❌ | `""` | Clase CSS del contenedor |
| `inputClassName` | `string` | ❌ | `""` | Clase CSS del input |
| `listClassName` | `string` | ❌ | `""` | Clase CSS de la lista |
| `options` | `AutocompleteOptions` | ❌ | `{}` | Opciones de Google Maps |
| `debounceMs` | `number` | ❌ | `300` | Tiempo de debounce en ms |
| `minChars` | `number` | ❌ | `3` | Caracteres mínimos para buscar |

## 🎨 Opciones Avanzadas

### Restringir por país

```tsx
<PlaceAutocomplete
  apiKey="YOUR_API_KEY"
  options={{
    componentRestrictions: { country: 'us' }
  }}
/>
```

### Filtrar por tipo de lugar

```tsx
<PlaceAutocomplete
  apiKey="YOUR_API_KEY"
  options={{
    types: ['restaurant', 'cafe']
  }}
/>
```

### Limitar por área geográfica

```tsx
<PlaceAutocomplete
  apiKey="YOUR_API_KEY"
  options={{
    bounds: {
      north: 40.7128,
      south: 40.7000,
      east: -74.0060,
      west: -74.0200
    }
  }}
/>
```

## 📋 Tipos TypeScript

### PlaceDetails

```typescript
interface PlaceDetails {
  placeId: string
  name: string
  formattedAddress: string
  geometry?: {
    location: { lat: number; lng: number }
  }
  addressComponents?: google.maps.GeocoderAddressComponent[]
  types?: string[]
  formattedPhoneNumber?: string
  internationalPhoneNumber?: string
  website?: string
  rating?: number
  userRatingsTotal?: number
}
```

## 🎯 Cómo Extraer a Otro Proyecto

Para usar este componente en otro proyecto, copia estos archivos:

1. **Carpeta completa**: `src/components/PlaceAutocomplete/`
2. **Archivo de tipos globales**: `src/global.d.ts`
3. **Instalar dependencias**:

   ```bash
   npm install --save-dev @types/google.maps @types/node
   ```

4. **Actualizar `tsconfig.json`**:

   ```json
   {
     "compilerOptions": {
       "types": ["@types/google.maps", "node"]
     }
   }
   ```

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Google Maps JavaScript API** - Places API

## ⚠️ Notas Importantes

### Warnings de Deprecación

Es posible que veas warnings en la consola sobre APIs deprecadas:

- `AutocompleteService` → Se recomienda migrar a `AutocompleteSuggestion`
- `PlacesService` → Se recomienda migrar a `Place`

**Estos warnings NO afectan la funcionalidad actual.** Las APIs actuales seguirán funcionando con soporte completo hasta al menos 12 meses después de marzo 2025.

Para más información sobre la migración futura:

- [Guía de migración de Places API](https://developers.google.com/maps/documentation/javascript/places-migration-overview)
- [Documentación de Places API (nueva)](https://developers.google.com/maps/documentation/javascript/place-autocomplete)

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.
