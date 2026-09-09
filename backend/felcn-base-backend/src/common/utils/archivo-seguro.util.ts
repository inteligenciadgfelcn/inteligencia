import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import {
  createReadStream,
  promises as fs,
} from 'fs'
import {
  basename,
  extname,
  resolve,
  sep,
} from 'path'

export interface ArchivoSeguro {
  nombre: string
  mimeType: string
  rutaCompleta: string
}

export interface ArchivoBase64 {
  nombre: string
  mimeType: string
  contenidoBase64: string
  dataUrl: string
}

const TIPOS_ARCHIVOS:
  Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
  }

export async function obtenerArchivoSeguro(
  ruta:
    | string
    | null
    | undefined,
): Promise<ArchivoSeguro | null> {
  if (!ruta) {
    return null
  }

  const directorioStorage = resolve(
    process.cwd(),
    'storage',
  )

  const rutaRelativa = ruta
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  const rutaCompleta = resolve(
    directorioStorage,
    rutaRelativa,
  )

  // Evita rutas como ../../archivo
  if (
    !rutaCompleta.startsWith(
      `${directorioStorage}${sep}`,
    )
  ) {
    throw new BadRequestException(
      'La ruta del archivo no es válida',
    )
  }

  try {
    const informacion =
      await fs.stat(rutaCompleta)

    if (!informacion.isFile()) {
      throw new NotFoundException(
        'El archivo no existe',
      )
    }
  } catch {
    throw new NotFoundException(
      'El archivo no existe',
    )
  }

  const extension =
    extname(rutaCompleta).toLowerCase()

  const mimeType =
    TIPOS_ARCHIVOS[extension]

  if (!mimeType) {
    throw new BadRequestException(
      'El tipo de archivo no está permitido',
    )
  }

  return {
    nombre:
      basename(rutaCompleta),
    mimeType,
    rutaCompleta,
  }
}

export async function convertirArchivoBase64(
  ruta:
    | string
    | null
    | undefined,
): Promise<ArchivoBase64 | null> {
  const archivo =
    await obtenerArchivoSeguro(ruta)

  if (!archivo) {
    return null
  }

  const contenido =
    await fs.readFile(
      archivo.rutaCompleta,
    )

  const contenidoBase64 =
    contenido.toString('base64')

  return {
    nombre: archivo.nombre,
    mimeType: archivo.mimeType,
    contenidoBase64,

    dataUrl:
      `data:${archivo.mimeType};base64,${contenidoBase64}`,
  }
}

export async function crearStreamArchivo(
  ruta:
    | string
    | null
    | undefined,
) {
  const archivo =
    await obtenerArchivoSeguro(ruta)

  if (!archivo) {
    throw new NotFoundException(
      'El archivo no está registrado',
    )
  }

  return {
    ...archivo,
    stream:
      createReadStream(
        archivo.rutaCompleta,
      ),
  }
}