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
