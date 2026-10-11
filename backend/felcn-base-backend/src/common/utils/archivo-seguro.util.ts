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
  isAbsolute,
  relative,
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

const TIPOS_ARCHIVOS: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
}

// =====================================================
// VALIDAR QUE UNA RUTA ESTÉ DENTRO DEL DIRECTORIO
// =====================================================

function validarRutaDentroDeStorage(
  directorio: string,
  rutaArchivo: string,
): void {
  const rutaRelativa = relative(
    directorio,
    rutaArchivo,
  )

  if (
    rutaRelativa === '' ||
    rutaRelativa === '..' ||
    rutaRelativa.startsWith(`..${sep}`) ||
    isAbsolute(rutaRelativa)
  ) {
    throw new BadRequestException(
      'La ruta del archivo no es válida',
    )
  }
}

// =====================================================
// OBTENER Y VALIDAR ARCHIVO
// =====================================================

export async function obtenerArchivoSeguro(
  ruta: string | null | undefined,
): Promise<ArchivoSeguro | null> {
  if (ruta === null || ruta === undefined || ruta === '') {
    return null
  }

  if (typeof ruta !== 'string' || ruta.includes('\0')) {
    throw new BadRequestException(
      'La ruta del archivo no es válida',
    )
  }

  const directorioStorage = resolve(
    process.cwd(),
    'storage',
  )

  // Acepta:
  // /storage/lgi/operativos/2026/archivo.pdf
  // storage/lgi/operativos/2026/archivo.pdf
  // lgi/operativos/2026/archivo.pdf
  const rutaRelativa = ruta
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^storage\//, '')

  const rutaCompleta = resolve(
    directorioStorage,
    rutaRelativa,
  )

  // Primera validación: bloquea escapes mediante ../
  validarRutaDentroDeStorage(
    directorioStorage,
    rutaCompleta,
  )

  let directorioReal: string
  let rutaReal: string

  try {
    directorioReal = await fs.realpath(
      directorioStorage,
    )

    rutaReal = await fs.realpath(
      rutaCompleta,
    )
  } catch {
    throw new NotFoundException(
      'El archivo no existe',
    )
  }

  // Segunda validación: bloquea enlaces simbólicos
  // cuyo destino esté fuera de storage.
  validarRutaDentroDeStorage(
    directorioReal,
    rutaReal,
  )

  let informacion: Awaited<ReturnType<typeof fs.stat>>

  try {
    informacion = await fs.stat(rutaReal)
  } catch {
    throw new NotFoundException(
      'El archivo no existe',
    )
  }

  if (!informacion.isFile()) {
    throw new NotFoundException(
      'El archivo no existe',
    )
  }

  const extension = extname(
    rutaReal,
  ).toLowerCase()

  const mimeType = TIPOS_ARCHIVOS[extension]

  if (!mimeType) {
    throw new BadRequestException(
      'El tipo de archivo no está permitido',
    )
  }

  return {
    nombre: basename(rutaReal),
    mimeType,
    rutaCompleta: rutaReal,
  }
}

// =====================================================
// CONVERTIR ARCHIVO A BASE64
// =====================================================

export async function convertirArchivoBase64(
  ruta: string | null | undefined,
): Promise<ArchivoBase64 | null> {
  const archivo = await obtenerArchivoSeguro(ruta)

  if (!archivo) {
    return null
  }

  const contenido = await fs.readFile(
    archivo.rutaCompleta,
  )

  const contenidoBase64 = contenido.toString(
    'base64',
  )

  return {
    nombre: archivo.nombre,
    mimeType: archivo.mimeType,
    contenidoBase64,
    dataUrl:
      `data:${archivo.mimeType};base64,${contenidoBase64}`,
  }
}

// =====================================================
// CREAR STREAM PARA ENTREGAR ARCHIVO
// =====================================================

export async function crearStreamArchivo(
  ruta: string | null | undefined,
) {
  const archivo = await obtenerArchivoSeguro(ruta)

  if (!archivo) {
    throw new NotFoundException(
      'El archivo no está registrado',
    )
  }

  return {
    ...archivo,
    stream: createReadStream(
      archivo.rutaCompleta,
    ),
  }
}