import { env } from 'next-runtime-env'

const sitePath = env('NEXT_PUBLIC_PATH') ?? ''

export const Constantes = {
  baseUrl: env('NEXT_PUBLIC_BASE_URL') ?? '',
  // Ruta absoluta al login respetando el basePath del entorno (dev/staging/raíz).
  // Usar en window.location.href — router.push/replace de Next ya la agrega solo.
  loginPath: (sitePath ? `/${sitePath}` : '') + '/login',
  authUrl: env('NEXT_PUBLIC_AUTH_URL') ?? '',
  baseApiUrl: env('NEXT_PUBLIC_BASE_API_URL') ?? '',
  socketUrl: env('NEXT_PUBLIC_SOCKET_URL') ?? '',
  // baseApiUrl: env('NEXT_PUBLIC_BASE_API_URL') ?? '',
  siteName: env('NEXT_PUBLIC_SITE_NAME') ?? '',
  sitePath: env('NEXT_PUBLIC_PATH') ?? '',
  appEnv: env('NEXT_PUBLIC_APP_ENV') ?? '',
  ciudadaniaUrl: env('NEXT_PUBLIC_CIUDADANIA_URL') ?? '',
  firmadorUrl: env('NEXT_PUBLIC_FIRMADOR_URL') ?? '',
  consultaPersonaUrl: env('NEXT_PUBLIC_CONSULTA_PERSONA_URL') ?? '',
  consultaPersonaApiKey: env('NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY') ?? '',
  // Verificación de datos del ciudadano con el SEGIP en el alta/edición de usuario.
  // Activada por defecto; poner NEXT_PUBLIC_SEGIP_VERIFICACION_ENABLED=false para
  // desactivarla de forma transparente (sin tocar código, solo el .env del frontend).
  segipVerificacionEnabled: env('NEXT_PUBLIC_SEGIP_VERIFICACION_ENABLED') !== 'false',
  apiOpenStreetMap: 'https://nominatim.openstreetmap.org',
  // Intervalo (ms) de auto-refresh del tab "Recientes" del reporte de Flujo de Transporte.
  flujoTransporteRefreshMs: Number(env('NEXT_PUBLIC_FLUJO_TRANSPORTE_REFRESH_MS')) || 6000,
}
