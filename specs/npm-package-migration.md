# Especificación: Migración a Paquete NPM

## Objetivo

Convertir este proyecto en un paquete npm publicable y reutilizable que permita a otros desarrolladores usar el componente de Google Places Autocomplete con React.

---

## 📋 Pasos de Implementación

### 1. Configurar Build para Library Mode

**Objetivo:** Configurar Vite para compilar el código como una biblioteca en lugar de una aplicación.

**Archivos a modificar:**

- `vite.config.ts`

**Cambios necesarios:**

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
      include: ['src/components/PlaceAutocomplete/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/PlaceAutocomplete/index.ts'),
      name: 'GooglePlacesAutocomplete',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
```

**Dependencias adicionales:**

```bash
npm install --save-dev vite-plugin-dts
```

---

### 2. Crear/Actualizar package.json para NPM

**Objetivo:** Configurar el package.json con la metadata necesaria para publicar en npm.

**Campos importantes a agregar/modificar:**

```json
{
  "name": "@tu-scope/google-places-autocomplete-react",
  "version": "1.0.0",
  "description": "Modern Google Places Autocomplete component for React with headless UI pattern",
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
    },
    "./styles": "./dist/style.css"
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
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/google.maps": "^3.55.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0 || ^19.0.0",
    "@types/react-dom": "^18.0.0 || ^19.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0"
  },
  "keywords": [
    "react",
    "google-maps",
    "places-autocomplete",
    "autocomplete",
    "google-places",
    "headless-ui",
    "typescript",
    "react-component"
  ],
  "author": "Tu Nombre <tu@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/google-places-autocomplete-react"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/google-places-autocomplete-react/issues"
  },
  "homepage": "https://github.com/tu-usuario/google-places-autocomplete-react#readme"
}
```

---

### 3. Actualizar Exports en index.ts

**Objetivo:** Asegurar que todos los componentes, hooks y tipos estén exportados correctamente.

**Archivo:** `src/components/PlaceAutocomplete/index.ts`

```typescript
// Componentes
export { PlaceAutocomplete } from './PlaceAutocomplete'
export { Suggestions } from './Suggestions'

// Hooks
export { usePlacesAutocomplete } from './hooks/usePlacesAutocomplete'
export { useGoogleMapsScript } from './hooks/useGoogleMapsScript'

// Tipos
export type {
  PlaceAutocompleteProps,
  PlaceResult,
  PlaceDetails,
  AutocompleteOptions,
} from './types/types'

export type {
  UsePlacesAutocompleteOptions,
  UsePlacesAutocompleteReturn,
} from './hooks/usePlacesAutocomplete'

// Helpers (opcional, si quieres exponerlos)
export { getPredictions, getPlaceDetails } from './helpers'

// Estilos
import './PlaceAutocomplete.css'
```

---

### 4. Crear Carpeta de Ejemplos

**Objetivo:** Proporcionar ejemplos de uso para los usuarios del paquete.

**Estructura sugerida:**

```txt
examples/
├── basic/
│   ├── package.json
│   ├── index.html
│   └── src/
│       └── App.tsx
├── headless/
│   └── src/
│       └── CustomAutocomplete.tsx
├── with-shadcn/
│   └── src/
│       └── ShadcnAutocomplete.tsx
└── README.md
```

**Ejemplo básico** (`examples/basic/src/App.tsx`):

```tsx
import { PlaceAutocomplete } from '@tu-scope/google-places-autocomplete-react'
import '@tu-scope/google-places-autocomplete-react/styles'
import type { PlaceDetails } from '@tu-scope/google-places-autocomplete-react'

function App() {
  const handlePlaceSelect = (place: PlaceDetails) => {
    console.log('Selected place:', place)
  }

  return (
    <div>
      <h1>Google Places Autocomplete Example</h1>
      <PlaceAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onPlaceSelect={handlePlaceSelect}
        placeholder="Search for a place..."
      />
    </div>
  )
}

export default App
```

**Ejemplo headless** (`examples/headless/src/CustomAutocomplete.tsx`):

```tsx
import { usePlacesAutocomplete } from '@tu-scope/google-places-autocomplete-react'
import type { PlaceDetails } from '@tu-scope/google-places-autocomplete-react'

export function CustomAutocomplete() {
  const { inputProps, containerRef, suggestions, isLoaded } = usePlacesAutocomplete({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelect: (place: PlaceDetails) => {
      console.log('Selected:', place)
    },
  })

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div ref={containerRef} className="custom-autocomplete">
      <input 
        {...inputProps}
        className="custom-input"
        placeholder="Enter address..."
      />
      {suggestions}
    </div>
  )
}
```

---

### 5. Agregar Licencia

**Objetivo:** Definir los términos de uso del paquete.

**Archivo:** `LICENSE`

Crear archivo MIT License (recomendado para paquetes open source):

```txt
MIT License

Copyright (c) 2026 [Tu Nombre]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

### 6. Actualizar README.md para NPM

**Objetivo:** Crear documentación clara para usuarios del paquete.

**Secciones importantes a agregar:**

1. **Instalación:**

```bash
npm install @tu-scope/google-places-autocomplete-react
# o
yarn add @tu-scope/google-places-autocomplete-react
# o
pnpm add @tu-scope/google-places-autocomplete-react
```

1. **Quick Start:**

```tsx
import { PlaceAutocomplete } from '@tu-scope/google-places-autocomplete-react'
import '@tu-scope/google-places-autocomplete-react/styles'

function App() {
  return (
    <PlaceAutocomplete
      apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      onPlaceSelect={(place) => console.log(place)}
    />
  )
}
```

1. **Badges:**

```markdown
[![npm version](https://badge.fury.io/js/%40tu-scope%2Fgoogle-places-autocomplete-react.svg)](https://www.npmjs.com/package/@tu-scope/google-places-autocomplete-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

### 7. Configurar .npmignore

**Objetivo:** Excluir archivos innecesarios del paquete publicado.

**Archivo:** `.npmignore`

```txt
# Source files
src/
public/
examples/
specs/

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

# Build artifacts (except dist)
.cache/
coverage/

# Git
.git/
.github/

# Misc
*.md
!README.md
!LICENSE
```

---

### 8. Testing del Paquete Localmente

**Objetivo:** Probar el paquete antes de publicar.

**Pasos:**

1. **Build del paquete:**

```bash
npm run build:lib
```

1. **Crear link local:**

```bash
npm link
```

1. **En otro proyecto de prueba:**

```bash
npm link @tu-scope/google-places-autocomplete-react
```

1. **Probar en el proyecto de prueba:**

```tsx
import { PlaceAutocomplete } from '@tu-scope/google-places-autocomplete-react'
```

1. **Verificar que funcione correctamente**

---

### 9. Publicar a NPM

**Objetivo:** Hacer el paquete disponible públicamente.

**Pasos:**

1. **Crear cuenta en npmjs.com** (si no tienes)

2. **Login en npm:**

```bash
npm login
```

1. **Verificar que todo esté listo:**

```bash
npm run build:lib
```

1. **Publicar (primera vez):**

```bash
npm publish --access public
```

1. **Para actualizaciones futuras:**

```bash
# Actualizar versión
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Publicar
npm publish
```

---

### 10. Configurar CI/CD (Opcional pero recomendado)

**Objetivo:** Automatizar el proceso de testing y publicación.

**Archivo:** `.github/workflows/publish.yml`

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:lib
      
      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📝 Checklist Pre-Publicación

- [ ] Build funciona correctamente (`npm run build:lib`)
- [ ] Todos los tipos TypeScript están exportados
- [ ] README.md está actualizado con instrucciones de instalación
- [ ] LICENSE está incluido
- [ ] package.json tiene toda la metadata correcta
- [ ] .npmignore excluye archivos innecesarios
- [ ] Ejemplos funcionan correctamente
- [ ] Versión semántica es correcta
- [ ] Probado localmente con `npm link`
- [ ] Cuenta de npm configurada

---

## 🎯 Nombre Sugerido del Paquete

Opciones:

- `@tu-scope/google-places-autocomplete-react`
- `react-google-places-autocomplete-modern`
- `google-places-autocomplete-headless`
- `@tu-scope/places-autocomplete`

**Recomendación:** Usar un scope (@tu-scope/) para evitar conflictos de nombres y dar profesionalismo.

---

## 📚 Recursos Adicionales

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Semantic Versioning](https://semver.org/)

---

## 🔄 Mantenimiento Post-Publicación

1. **Monitorear issues en GitHub**
2. **Responder a preguntas de usuarios**
3. **Actualizar dependencias regularmente**
4. **Publicar parches de seguridad rápidamente**
5. **Mantener changelog actualizado**
6. **Considerar deprecation warnings de Google Maps API**
