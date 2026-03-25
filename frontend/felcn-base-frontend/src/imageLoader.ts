/** Prefijo de basePath para rutas públicas (embebido en build time). */
export const BASE_PATH = process.env.NEXT_PUBLIC_PATH
  ? `/${process.env.NEXT_PUBLIC_PATH}`
  : ''

export default function imageLoader({ src }: { src: string }): string {
  // URLs externas (http/https) se sirven tal cual
  if (!src.startsWith('/')) return src

  return `${BASE_PATH}${src}`
}
