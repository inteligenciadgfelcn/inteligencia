'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ni18nConfig } from './ni18n.config'

// Inicializar i18next
i18n.use(initReactI18next).init({
  ...ni18nConfig,
  interpolation: { escapeValue: false },
  lng: ni18nConfig.fallbackLng?.[0] || 'en',
})

export default i18n
