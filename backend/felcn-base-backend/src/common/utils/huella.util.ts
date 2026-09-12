import * as fs from 'fs'
import * as path from 'path'

export async function imagenBase64(rutaArchivo: string): Promise<string> {
  if (!rutaArchivo) {
    return ''
  }

  try {
    const rutaAbsoluta = path.isAbsolute(rutaArchivo)
      ? rutaArchivo
      : path.resolve(process.cwd(), rutaArchivo)

    const archivo = await fs.promises.readFile(rutaAbsoluta)

    const esBMP =
      archivo.length >= 2 && archivo[0] === 0x42 && archivo[1] === 0x4d

    if (!esBMP) {
      console.error(`ARCHIVO BMP INVÁLIDO: ${rutaAbsoluta}`)

      return ''
    }

    return 'data:image/bmp;base64,' + archivo.toString('base64')
  } catch (error) {
    console.error(`ERROR LEYENDO HUELLA: ${rutaArchivo}`, error)

    return ''
  }
}
