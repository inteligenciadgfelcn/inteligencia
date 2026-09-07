import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { HuellaService } from './huella.service'

import * as fs from 'fs'
import * as path from 'path'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Huellas')
@Controller('huellas')
export class HuellaController {
  constructor(private readonly service: HuellaService) {}

  /* GUARDAR HUELLA */
  @Post('guardar')
  @ApiOperation({ summary: 'Guardar huella capturada' })
  async guardar(@Body() data: any) {
  if (!data.personaId) {
    throw new Error('personaId es requerido')
  }

  if (!data.imagen) {
    throw new Error('imagen es requerida')
  }

  if (!data.wsq) {
    throw new Error('wsq es requerido')
  }

  if (data.calidad < 40) {
    throw new Error('Calidad muy baja')
  }

  const now = new Date()

  const folder = path.join(
    process.cwd(),
    'storage',
    'inteligencia',
    'huellas',
    now.getFullYear().toString(),
    data.personaId.toString()
  )

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    })
  }

  /*
   NOMBRES DE ARCHIVOS
  */
  const fileNameBmp =
    `${data.dedo}.bmp`

  const fileNameWsq =
    `${data.dedo}.wsq`

  const filePathBmp =
    path.join(folder, fileNameBmp)

  const filePathWsq =
    path.join(folder, fileNameWsq)

  /*
   LIMPIAR BMP BASE64
  */
  let base64Bmp = data.imagen

  if (base64Bmp.includes('base64,')) {
    base64Bmp =
      base64Bmp.split('base64,')[1]
  }

  /*
   LIMPIAR WSQ BASE64
  */
  let base64Wsq = data.wsq

  if (base64Wsq.includes('base64,')) {
    base64Wsq =
      base64Wsq.split('base64,')[1]
  }

  console.log('📦 BMP BASE64:', base64Bmp.length)
  console.log('📦 WSQ BASE64:', base64Wsq.length)

  /*
   CONVERTIR
  */
  const bufferBmp =
    Buffer.from(base64Bmp, 'base64')

  const bufferWsq =
    Buffer.from(base64Wsq, 'base64')

  /*
   GUARDAR ARCHIVOS
  */
  fs.writeFileSync(
    filePathBmp,
    bufferBmp
  )

  fs.writeFileSync(
    filePathWsq,
    bufferWsq
  )

  /*
   RUTAS RELATIVAS
  */
  const rutaRelativaBmp = [
    'storage',
    'inteligencia',
    'huellas',
    now.getFullYear(),
    data.personaId,
    fileNameBmp,
  ].join('/')

  const rutaRelativaWsq = [
    'storage',
    'inteligencia',
    'huellas',
    now.getFullYear(),
    data.personaId,
    fileNameWsq,
  ].join('/')

  /*
   GUARDAR EN POSTGRESQL
  */
  await this.service.guardar({
    idPersona: data.personaId,
    dedo: data.dedo,
    rutaArchivo: rutaRelativaBmp,
    rutaArchivoWsq: rutaRelativaWsq,
    calidad: data.calidad,
  })

  return {
    ok: true,
    ruta: rutaRelativaBmp,
    rutaWsq: rutaRelativaWsq,
    bmpBytes: bufferBmp.length,
    wsqBytes: bufferWsq.length,
  }
}

  /* OBTENER HUELLAS POR PERSONA*/
  @Get('persona/:id')
  @ApiOperation({ summary: 'Obtener huellas por persona' })
  async obtenerPorPersona(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeImagen') includeImagen?: string
  ) {
    const huellas = await this.service.obtenerPorPersona(id)

    return huellas.map((h) => {
      let base64: string | null = null

      if (includeImagen === 'true') {
        try {
          const filePath = path.join(process.cwd(), h.rutaArchivo)

          if (fs.existsSync(filePath)) {
            const file = fs.readFileSync(filePath)
            base64 = file.toString('base64')
          }
        } catch (error) {
          console.error('❌ Error leyendo archivo:', error)
        }
      }

      return {
        id: h.id,
        dedo: h.dedo,
        calidad: h.calidad,
        ruta: h.rutaArchivo,
        imagen: base64, // 🔥 opcional
      }
    })
  }
}