import { env } from 'next-runtime-env'

export const Constantes = {
  baseUrl: env('NEXT_PUBLIC_BASE_URL') ?? '',
  socketUrl: env('NEXT_PUBLIC_SOCKET_URL') ?? '',
  // baseApiUrl: env('NEXT_PUBLIC_BASE_API_URL') ?? '',
  siteName: env('NEXT_PUBLIC_SITE_NAME') ?? '',
  sitePath: env('NEXT_PUBLIC_PATH') ?? '',
  appEnv: env('NEXT_PUBLIC_APP_ENV') ?? '',
  ciudadaniaUrl: env('NEXT_PUBLIC_CIUDADANIA_URL') ?? '',
  firmadorUrl: env('NEXT_PUBLIC_FIRMADOR_URL') ?? '',
  apiOpenStreetMap: 'https://nominatim.openstreetmap.org',
}
