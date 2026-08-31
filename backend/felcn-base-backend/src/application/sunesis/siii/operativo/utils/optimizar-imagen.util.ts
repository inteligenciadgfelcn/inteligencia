import sharp from 'sharp'

const LADO_MAXIMO_PX = 1600
const CALIDAD_JPEG = 80

/**
 * Redimensiona (máx. 1600px en el lado más largo) y comprime a JPEG calidad 80
 * las fotos que se suben en operativos (galería, personas, drogas, bienes,
 * logotipos). Antes se guardaba el buffer tal cual llegaba de la cámara
 * (varios MB, resolución de varios miles de píxeles) directo en la columna
 * bytea. 1600px es de sobra para verificar detalle en pantalla; no aplica
 * DPI porque estas fotos no se imprimen, solo se consultan digitalmente.
 * Si el buffer no es una imagen válida (o ya es muy liviano/pequeño), se
 * retorna sin tocar para no romper archivos que sharp no pueda procesar.
 */
export async function optimizarImagen(buffer: Buffer): Promise<Buffer> {
  if (!buffer || buffer.length === 0) return buffer

  try {
    return await sharp(buffer)
      .rotate() // aplica la orientación EXIF antes de perderla al recomprimir
      .resize({
        width: LADO_MAXIMO_PX,
        height: LADO_MAXIMO_PX,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: CALIDAD_JPEG, mozjpeg: true })
      .toBuffer()
  } catch {
    // Buffer no procesable como imagen (formato no soportado, corrupto, etc.)
    return buffer
  }
}
