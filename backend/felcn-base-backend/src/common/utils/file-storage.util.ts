import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common'
import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { diskStorage } from 'multer'
import * as path from 'path'

export function crearConfiguracionArchivo(
  modulo: string,
  carpeta: string,
  limiteMb = 10
) {
  return {
    storage: diskStorage({
      destination: (request, file, callback) => {
        const year = new Date().getFullYear().toString()

        const destino = path.join(
          process.cwd(),
          'storage',
          modulo,
          carpeta,
          year
        )

        if (!fs.existsSync(destino)) {
          fs.mkdirSync(destino, {
            recursive: true,
          })
        }

        callback(null, destino)
      },

      filename: (request, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase()

        const nombre = `${Date.now()}-${randomUUID()}`

        callback(null, `${nombre}${extension}`)
      },
    }),

    limits: {
      fileSize: limiteMb * 1024 * 1024,
    },
  }
}

export function crearValidadorArchivo(
  limiteMb = 10,
  requerido = true,
): ParseFilePipe {
  return new ParseFilePipe({
    fileIsRequired: requerido,

    validators: [
      new MaxFileSizeValidator({
        maxSize: limiteMb * 1024 * 1024,
        message:
          `El archivo no debe superar los ${limiteMb} MB`,
      }),
    ],
  })
}

export function obtenerRutaRelativa(rutaArchivo: string): string {
  return path.relative(process.cwd(), rutaArchivo).replace(/\\/g, '/')
}
