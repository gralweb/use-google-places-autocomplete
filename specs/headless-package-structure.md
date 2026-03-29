# Especificación: Paquete NPM Headless

## Objetivo

Crear un paquete npm **headless** que solo exponga el hook `usePlacesAutocomplete` y utilidades relacionadas, sin componentes UI predefinidos. Los usuarios tendrán total libertad para crear sus propios componentes con cualquier librería de UI.

---

## 📦 Estructura del Paquete

### Archivos a INCLUIR en el paquete npm

```txt
src/
├── index.ts                      # ✅ Export principal
├── hooks/
│   ├── index.ts                  # ✅ Re-exports
│   ├── usePlacesAutocomplete.ts  # ✅ Hook principal
│   └── useGoogleMapsScript.ts    # ✅ Hook de carga de script
├── types/
│   ├── index.ts                  # ✅ Re-exports
│   └── types.ts                  # ✅ Definiciones de tipos
├── helpers/
│   ├── index.ts                  # ✅ Re-exports
│   ├── getPredictions.ts         # ✅ Helper
│   └── getPlaceDetails.ts        # ✅ Helper
└── constants.ts                  # ✅ Valores por defecto
```

### Archivos a EXCLUIR del paquete (solo para demo local)

```txt
src/
├── App.tsx                       # ❌ Solo demo local
├── main.tsx                      # ❌ Solo demo local
├── index.css                     # ❌ Solo demo local
└── components/
    └── PlaceAutocomplete/        # ❌ Solo demo local
        ├── PlaceAutocomplete.tsx
        ├── PlaceAutocomplete.css
        └── Suggestions.tsx
```

---

## 🎯 Paso 1: Crear Archivos de Re-export

### src/hooks/index.ts

```typescript
export { usePlacesAutocomplete } from './usePlacesAutocomplete'
export { useGoogleMapsScript } from './useGoogleMapsScript'

export type {
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn,
} from './usePlacesAutocomplete'
```

### src/types/index.ts

```typescript
export type {
  PlaceResult,
  PlaceDetails,
  AutocompleteOptions,
  PlaceAutocompleteProps,
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn,
} from './types'
```

### src/helpers/index.ts

```typescript
export { getPredictions } from './getPredictions'
export { getPlaceDetails } from './getPlaceDetails'
```

### src/constants.ts

```typescript
import type { AutocompleteOptions } from './types'

export const DEFAULT_AUTOCOMPLETE_OPTIONS: AutocompleteOptions = {
  types: ['geocode'],
  fields: [
    'id',
    'displayName',
    'formattedAddress',
    'location',
    'addressComponents',
  ],
} as const

export const DEFAULT_DEBOUNCE_MS = 300
export const DEFAULT_MIN_CHARS = 3
```

### src/index.ts (Export principal)

```typescript
// Hooks
export { usePlacesAutocomplete, useGoogleMapsScript } from './hooks'

// Helpers (para usuarios avanzados)
export { getPredictions, getPlaceDetails } from './helpers'

// Tipos
export type {
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn,
  PlaceResult,
  PlaceDetails,
  AutocompleteOptions,
} from './types'

// Constantes
export {
  DEFAULT_AUTOCOMPLETE_OPTIONS,
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_MIN_CHARS,
} from './constants'
```

---

## 🔧 Paso 2: Configurar Vite para Library Mode

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      // Solo incluir archivos que se exportan
      include: [
        'src/hooks/**/*',
        'src/types/**/*',
        'src/helpers/**/*',
        'src/constants.ts',
        'src/index.ts',
      ],
      // Excluir componentes UI y archivos de demo
      exclude: [
        'src/components/**/*',
        'src/App.tsx',
        'src/main.tsx',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UsePlacesAutocomplete',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
```

**Instalar dependencia:**

```bash
npm install --save-dev vite-plugin-dts
```

---

## 📝 Paso 3: Configurar package.json

```json
{
  "name": "@tu-scope/use-google-places-autocomplete",
  "version": "1.0.0",
  "description": "Headless React hook for Google Places Autocomplete with full TypeScript support. Bring your own UI.",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:lib": "vite build",
    "prepublishOnly": "npm run build:lib",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    }
  },
  "devDependencies": {
    "@types/google.maps": "^3.55.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0 || ^19.0.0",
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  },
  "keywords": [
    "react",
    "hook",
    "headless",
    "headless-ui",
    "google-maps",
    "google-places",
    "places-autocomplete",
    "autocomplete",
    "typescript",
    "unstyled"
  ],
  "author": "Tu Nombre <tu@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/use-google-places-autocomplete"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/use-google-places-autocomplete/issues"
  },
  "homepage": "https://github.com/tu-usuario/use-google-places-autocomplete#readme"
}
```

---

## 📚 Paso 4: Crear README.md para NPM

```markdown
# use-google-places-autocomplete

> Headless React hook for Google Places Autocomplete. Bring your own UI.

[![npm version](https://badge.fury.io/js/%40tu-scope%2Fuse-google-places-autocomplete.svg)](https://www.npmjs.com/package/@tu-scope/use-google-places-autocomplete)
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
npm install @tu-scope/use-google-places-autocomplete
# or
yarn add @tu-scope/use-google-places-autocomplete
# or
pnpm add @tu-scope/use-google-places-autocomplete
```

## Quick Start

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'

function MyAutocomplete() {
  const { inputProps, containerRef, suggestions, isLoaded } = usePlacesAutocomplete({
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    onPlaceSelect: (place) => {
      console.log('Selected place:', place)
    },
  })

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div ref={containerRef}>
      <input {...inputProps} placeholder="Search places..." />
      {suggestions}
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
| `listClassName` | `string` | ❌ | `""` | CSS class for suggestions list |

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
  
  // Suggestions component (or null if no suggestions)
  suggestions: React.ReactNode | null
  
  // Loading state
  isLoaded: boolean
  loadError: Error | null
  
  // Manual control methods
  clearSuggestions: () => void
  setValue: (value: string) => void
}
```

## Examples

### Basic Usage

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'

function BasicExample() {
  const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      console.log('Selected:', place.formattedAddress)
      console.log('Coordinates:', place.geometry?.location)
    },
  })

  return (
    <div ref={containerRef}>
      <input {...inputProps} placeholder="Search for a place..." />
      {suggestions}
    </div>
  )
}
```

### With Custom Input Component

```tsx
import { forwardRef } from 'react'
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'

const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <input 
    ref={ref} 
    {...props} 
    className="px-4 py-2 border rounded-lg focus:ring-2"
  />
))

function CustomExample() {
  const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  return (
    <div ref={containerRef}>
      <CustomInput {...inputProps} />
      {suggestions}
    </div>
  )
}
```

### With shadcn/ui

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'
import { Input } from '@/components/ui/input'

function ShadcnExample() {
  const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => console.log(place),
  })

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Input {...inputProps} placeholder="Search places..." />
      {suggestions}
    </div>
  )
}
```

### With Material-UI

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'
import TextField from '@mui/material/TextField'

function MUIExample() {
  const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
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
      {suggestions}
    </div>
  )
}
```

### With Chakra UI

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'
import { Input } from '@chakra-ui/react'

function ChakraExample() {
  const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  return (
    <div ref={containerRef}>
      <Input {...inputProps} placeholder="Search places..." />
      {suggestions}
    </div>
  )
}
```

### With Manual Control

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'

function AdvancedExample() {
  const { 
    inputProps, 
    containerRef, 
    suggestions,
    clearSuggestions,
    setValue,
    isLoaded,
    loadError
  } = usePlacesAutocomplete({
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place) => {
      console.log('Selected:', place)
      // Clear after selection
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
      {suggestions}
    </div>
  )
}
```

### Restrict by Country

```tsx
const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  options: {
    componentRestrictions: { country: 'us' },
  },
})
```

### Filter by Type

```tsx
const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
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
} from '@tu-scope/use-google-places-autocomplete'

const handleSelect = (place: PlaceDetails) => {
  console.log(place.formattedAddress)
  console.log(place.geometry?.location.lat)
  console.log(place.geometry?.location.lng)
}
```

## Advanced Usage

### Using Helpers Directly

```typescript
import { getPredictions, getPlaceDetails } from '@tu-scope/use-google-places-autocomplete'

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
} from '@tu-scope/use-google-places-autocomplete'

console.log(DEFAULT_DEBOUNCE_MS) // 300
console.log(DEFAULT_MIN_CHARS)   // 3
```

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a project or select an existing one
3. Enable **Places API (New)**
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domain

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or pull request.

## Support

- [GitHub Issues](https://github.com/tu-usuario/use-google-places-autocomplete/issues)
- [Documentation](https://github.com/tu-usuario/use-google-places-autocomplete#readme)

---

## 🔒 Paso 5: Configurar .npmignore

```txt
# Source files
src/
public/
examples/
specs/

# Demo components (no incluir en el paquete)
**/PlaceAutocomplete.tsx
**/PlaceAutocomplete.css
**/Suggestions.tsx
**/App.tsx
**/main.tsx

# Config files
.env
.env.example
.gitignore
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
eslint.config.js

# Development
node_modules/
.vscode/
.idea/
*.log
coverage/

# Git
.git/
.github/

# Keep only
!dist/
!README.md
!LICENSE
!package.json
```

---

## 📋 Paso 6: Agregar JSDoc a Exports

### src/hooks/usePlacesAutocomplete.ts

```typescript
/**
 * Headless React hook for Google Places Autocomplete.
 * Provides complete control over the input element and UI.
 * 
 * @param options - Configuration options for the autocomplete
 * @returns Object containing input props, suggestions, and control methods
 * 
 * @example
 * ```tsx
 * const { inputProps, containerRef, suggestions } = usePlacesAutocomplete({
 *   apiKey: 'YOUR_API_KEY',
 *   onPlaceSelect: (place) => console.log(place),
 * })
 * 
 * return (
 *   <div ref={containerRef}>
 *     <input {...inputProps} placeholder="Search..." />
 *     {suggestions}
 *   </div>
 * )
 * ```
 */
export const usePlacesAutocomplete = ({ ... }) => { ... }
```

### src/helpers/getPredictions.ts

```typescript
/**
 * Fetches place predictions from Google Places API
 * 
 * @param input - Search query string
 * @param config - Configuration including session token and options
 * @returns Array of place predictions
 */
export const getPredictions = async (input: string, config: ...) => { ... }
```

---

## 🧪 Paso 7: Testing (Opcional pero recomendado)

### Instalar dependencias de testing

```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks vitest
```

### Ejemplo de test

```typescript
// src/hooks/__tests__/usePlacesAutocomplete.test.ts
import { renderHook, act } from '@testing-library/react'
import { usePlacesAutocomplete } from '../usePlacesAutocomplete'

describe('usePlacesAutocomplete', () => {
  it('should initialize with empty value', () => {
    const { result } = renderHook(() => 
      usePlacesAutocomplete({ apiKey: 'test-key' })
    )
    
    expect(result.current.inputProps.value).toBe('')
  })
  
  it('should update value with setValue', () => {
    const { result } = renderHook(() => 
      usePlacesAutocomplete({ apiKey: 'test-key' })
    )
    
    act(() => {
      result.current.setValue('New York')
    })
    
    expect(result.current.inputProps.value).toBe('New York')
  })
})
```

---

## 📦 Paso 8: Build y Testing Local

### 1. Build del paquete

```bash
npm run build:lib
```

Verificar que se generen:

```txt
dist/
├── index.mjs
├── index.cjs
├── index.d.ts
└── index.d.ts.map
```

### 2. Probar localmente con npm link

```bash
# En el directorio del paquete
npm link

# En otro proyecto de prueba
npm link @tu-scope/use-google-places-autocomplete
```

### 3. Probar en proyecto de prueba

```tsx
import { usePlacesAutocomplete } from '@tu-scope/use-google-places-autocomplete'

function Test() {
  const { inputProps, suggestions } = usePlacesAutocomplete({
    apiKey: 'YOUR_KEY'
  })
  
  return (
    <div>
      <input {...inputProps} />
      {suggestions}
    </div>
  )
}
```

---

## 🚀 Paso 9: Publicar a NPM

### 1. Crear cuenta en npmjs.com

Si no tienes cuenta, créala en [npmjs.com](https://www.npmjs.com)

### 2. Login en npm

```bash
npm login
```

### 3. Verificar package.json

Asegúrate de que:

- `name` sea único (verifica en npmjs.com)
- `version` sea correcta (empezar con 1.0.0)
- `files` incluya solo `dist/`

### 4. Build final

```bash
npm run build:lib
```

### 5. Publicar

```bash
npm publish --access public
```

### 6. Verificar publicación

Visita: `https://www.npmjs.com/package/@tu-scope/use-google-places-autocomplete`

---

## 🔄 Paso 10: Actualizaciones Futuras

### Actualizar versión

```bash
# Bug fix: 1.0.0 -> 1.0.1
npm version patch

# Nueva feature: 1.0.0 -> 1.1.0
npm version minor

# Breaking change: 1.0.0 -> 2.0.0
npm version major
```

### Publicar actualización

```bash
npm run build:lib
npm publish
```

### Mantener CHANGELOG.md

```markdown
# Changelog

## [1.1.0] - 2026-04-15

### Added
- New `onError` callback option
- Support for custom `listClassName`

### Fixed
- Click outside detection bug

## [1.0.0] - 2026-03-27

### Added
- Initial release
- Headless `usePlacesAutocomplete` hook
```

---

## ✅ Checklist Pre-Publicación

- [ ] Build genera archivos correctos en `dist/`
- [ ] Solo hooks y helpers en el bundle (sin componentes UI)
- [ ] Todos los tipos exportados correctamente
- [ ] JSDoc en exports públicos
- [ ] README con ejemplos de diferentes UI libraries
- [ ] LICENSE incluido (MIT)
- [ ] .npmignore excluye archivos innecesarios
- [ ] package.json con metadata correcta
- [ ] Nombre del paquete disponible en npm
- [ ] Probado localmente con `npm link`
- [ ] `onError` callback disponible
- [ ] TypeScript strict mode habilitado

---

## 🎯 Nombres Sugeridos

Opciones de nombres (verificar disponibilidad en npmjs.com):

1. `@tu-scope/use-google-places-autocomplete` ⭐ (Recomendado)
2. `use-places-autocomplete`
3. `react-google-places-hook`
4. `@tu-scope/places-autocomplete-hook`
5. `use-google-places`

**Recomendación:** Usar un scope (@tu-scope/) para:

- Evitar conflictos de nombres
- Dar profesionalismo
- Agrupar tus paquetes

---

## 📊 Ventajas del Paquete Headless

1. **Flexibilidad total** - Funciona con cualquier UI library
2. **Bundle pequeño** - Solo lógica, sin CSS ni componentes
3. **Fácil mantenimiento** - No necesitas actualizar estilos
4. **Mejor adopción** - Los usuarios pueden usar su design system
5. **Sin breaking changes de UI** - Solo cambios en la API del hook
6. **Compatible con SSR** - Funciona con Next.js, Remix, etc.

---

## 📚 Recursos Adicionales

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Headless UI Pattern](https://www.merrickchristensen.com/articles/headless-user-interface-components/)
- [Semantic Versioning](https://semver.org/)
- [Google Places API](https://developers.google.com/maps/documentation/javascript/place-autocomplete)
