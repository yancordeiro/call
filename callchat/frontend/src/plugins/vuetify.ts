// @ts-expect-error - Vuetify styles import is correct but may not have type declarations
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'premium-dark',
    themes: {
      'premium-dark': {
        dark: true,
        colors: {
          // Premium Dark Palette
          background: '#0B0F19',
          surface: '#111827',
          'surface-variant': '#1F2937',
          'surface-bright': '#1F2937',
          'surface-light': '#1F2937',

          // Primary Colors
          primary: '#6366F1',
          'primary-darken-1': '#818CF8',
          'primary-lighten-1': '#818CF8',

          // Secondary Colors
          secondary: '#A855F7',
          'secondary-darken-1': '#C084FC',
          'secondary-lighten-1': '#C084FC',

          // Status Colors
          error: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#3B82F6',

          // Text Colors
          'on-background': '#F3F4F6',
          'on-surface': '#F3F4F6',
          'on-surface-variant': '#9CA3AF',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        },
        variables: {
          'border-color': 'rgba(255, 255, 255, 0.08)',
          'border-opacity': 0.08,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.7,
          'disabled-opacity': 0.5,
          'activated-opacity': 0.08,
          'hover-opacity': 0.05,
          'focus-opacity': 0.08,
          'selected-opacity': 0.08,
          'dragged-opacity': 0.08,
        },
      },
      dark: {
        colors: {
          primary: '#6366F1',
          secondary: '#A855F7',
          error: '#EF4444',
          warning: '#F59E0B',
          background: '#0B0F19',
          surface: '#111827',
        },
      },
      light: {
        colors: {
          primary: '#6366F1',
          secondary: '#A855F7',
        },
      },
    },
  },
})

export default vuetify
