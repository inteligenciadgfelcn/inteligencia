import themeConfig from './theme.config';

export const ni18nConfig = {
    fallbackLng: themeConfig.locale || 'en', // idioma por defecto
    supportedLngs: [
        'da', 'de', 'el', 'en', 'es', 'fr', 'hu', 'it', 'ja',
        'pl', 'pt', 'ru', 'sv', 'tr', 'zh', 'ae'
    ],
    ns: ['translation'], // namespaces
    defaultNS: 'translation',
    react: {
        useSuspense: false, // importante en Next.js App Router
    },
    backend: {
        // Para Next.js, los JSON deberían estar en /public/locales
        // Ej: /public/locales/es.json
        loadPath: '/locales/{{lng}}.json',
    },
};
