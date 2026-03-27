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

### Opción 1: Componente completo (más simple)

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

### Opción 2: Hook headless (máxima flexibilidad)

Perfecto para usar con tus propios componentes de input personalizados:

```tsx
import { usePlacesAutocomplete } from './components/PlaceAutocomplete/hooks'
import type { PlaceDetails } from './components/PlaceAutocomplete'

function CustomAutocomplete() {
  const { inputProps, suggestions, isLoaded } = usePlacesAutocomplete({
    apiKey: "YOUR_API_KEY",
    onPlaceSelect: (place: PlaceDetails) => {
      console.log('Lugar seleccionado:', place)
    },
  })

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      {/* Usa tu propio input personalizado */}
      <input 
        {...inputProps} 
        placeholder="Buscar dirección..."
        className="my-custom-input"
      />
      {suggestions}
    </div>
  )
}
```

### Opción 3: Con componentes de UI libraries (shadcn, MUI, etc.)

```tsx
import { usePlacesAutocomplete } from './components/PlaceAutocomplete/hooks'
import { Input } from '@/components/ui/input' // shadcn/ui

function ShadcnAutocomplete() {
  const { inputProps, suggestions } = usePlacesAutocomplete({
    apiKey: "YOUR_API_KEY",
    onPlaceSelect: (place) => console.log(place),
  })

  return (
    <div className="relative">
      <Input {...inputProps} placeholder="Buscar lugar..." />
      {suggestions}
    </div>
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

## � API del Hook `usePlacesAutocomplete`

### Parámetros

```typescript
interface UsePlacesAutocompleteOptions {
  apiKey: string
  onPlaceSelect?: (place: PlaceDetails) => void
  onError?: (error: Error) => void
  options?: AutocompleteOptions
  debounceMs?: number  // Default: 300
  minChars?: number    // Default: 3
}
```

### Retorno

```typescript
interface UsePlacesAutocompleteReturn {
  // Props para aplicar directamente al input
  inputProps: {
    ref: React.RefObject<HTMLInputElement>
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    autoComplete: string
  }
  
  // Componente de sugerencias (renderiza automáticamente)
  suggestions: React.ReactNode | null
  
  // Estado de carga
  isLoaded: boolean
  loadError: Error | null
  
  // Métodos de control manual
  clearSuggestions: () => void
  setValue: (value: string) => void
}
```

### Ejemplo de uso con control manual

```tsx
function AdvancedAutocomplete() {
  const { 
    inputProps, 
    suggestions, 
    clearSuggestions, 
    setValue 
  } = usePlacesAutocomplete({
    apiKey: "YOUR_API_KEY",
    onPlaceSelect: (place) => {
      console.log('Selected:', place)
      // Limpiar después de seleccionar
      setTimeout(() => clearSuggestions(), 100)
    },
  })

  const handleReset = () => {
    setValue('')
    clearSuggestions()
  }

  return (
    <div>
      <input {...inputProps} />
      <button onClick={handleReset}>Limpiar</button>
      {suggestions}
    </div>
  )
}
```

## �🎨 Opciones Avanzadas

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
