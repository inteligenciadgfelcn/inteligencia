/**
 * Redimensiona y comprime una imagen en el navegador antes de subirla —
 * evita mandar al servidor fotos de varios MB sin procesar. Recorta al
 * cuadrado centrado (para avatares) y reescala al lado máximo indicado.
 */
export async function redimensionarImagen(
  archivo: File,
  {
    ladoMaximo = 512,
    calidad = 0.85,
  }: { ladoMaximo?: number; calidad?: number } = {}
): Promise<File> {
  const bitmap = await createImageBitmap(archivo)

  const lado = Math.min(bitmap.width, bitmap.height)
  const origenX = (bitmap.width - lado) / 2
  const origenY = (bitmap.height - lado) / 2
  const destino = Math.min(ladoMaximo, lado)

  const canvas = document.createElement('canvas')
  canvas.width = destino
  canvas.height = destino
  const ctx = canvas.getContext('2d')
  if (!ctx) return archivo

  ctx.drawImage(bitmap, origenX, origenY, lado, lado, 0, 0, destino, destino)

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', calidad)
  )
  if (!blob) return archivo

  const nombre = archivo.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], nombre, { type: 'image/jpeg' })
}
