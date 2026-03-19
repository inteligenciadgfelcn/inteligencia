export default function imageLoader({ src }: { src: string }): string {
  // URLs externas (http/https) se sirven tal cual
  if (!src.startsWith('/')) return src

  // Agrega el basePath en tiempo de build (NEXT_PUBLIC_PATH se embebe en el bundle del cliente)
  const basePath = process.env.NEXT_PUBLIC_PATH ? `/${process.env.NEXT_PUBLIC_PATH}` : ''
  return `${basePath}${src}`
}
