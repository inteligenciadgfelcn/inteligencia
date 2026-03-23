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
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { HuellaService } from './huella.service'

import * as fs from 'fs'
import * as path from 'path'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Huellas')
@Controller('huellas')
export class HuellaController {
  constructor(private readonly service: HuellaService) {}

  /* =====================================================
     🔥 GUARDAR HUELLA
  ===================================================== */
  @Post('guardar')
  @ApiOperation({ summary: 'Guardar huella capturada' })
  async guardar(@Body() data: any) {
    if (!data.personaId) throw new Error('personaId es requerido')
    if (!data.imagen) throw new Error('imagen es requerida')
    if (data.calidad < 40) throw new Error('Calidad muy baja')

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
      fs.mkdirSync(folder, { recursive: true })
    }

    const fileName = `${data.dedo}.bmp`
    const filePath = path.join(folder, fileName)

    // 🔥 LIMPIAR BASE64
    let base64Data = data.imagen
    if (base64Data.includes('base64,')) {
      base64Data = base64Data.split('base64,')[1]
    }

    console.log('📦 BASE64 LENGTH:', base64Data.length)

    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filePath, buffer)

    const rutaRelativa = [
      'storage',
      'inteligencia',
      'huellas',
      now.getFullYear(),
      data.personaId,
      fileName,
    ].join('/')

    await this.service.guardar({
      idPersona: data.personaId,
      dedo: data.dedo,
      rutaArchivo: rutaRelativa,
      calidad: data.calidad,
    })

    return {
      ok: true,
      ruta: rutaRelativa,
    }
  }

  /* =====================================================
     🔥 OBTENER HUELLAS POR PERSONA
     ?includeImagen=true  👈 opcional
  ===================================================== */
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