import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'

import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { CreateBienesSecuestradoDto } from './dto/create-bienes_secuestrado.dto'
import { UpdateBieneSecuestradoLgiDto } from './dto/update-bienes_secuestrado.dto'
import { BieneSecuestradoLgiService } from './bienes_secuestrados.service'

const configuracionFotografias = {
  storage: memoryStorage(),

  limits: {
    /*
     * Máximo 5 MB por fotografía.
     */
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (
    request: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, aceptar: boolean) => void
  ) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

    if (!tiposPermitidos.includes(file.mimetype)) {
      return callback(
        new Error('Solo se permiten imágenes JPG, PNG o WEBP'),
        false
      )
    }

    callback(null, true)
  },
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Bienes secuestrados')
@Controller('bienes-secuestrados')
export class BienesSecuestradosController extends BaseController {
  constructor(private readonly service: BieneSecuestradoLgiService) {
    super()
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Registrar un bien secuestrado con múltiples fotografías',
  })
  @UseInterceptors(
    FilesInterceptor('fotografias', 20, configuracionFotografias),
    AuditoriaUsuarioInterceptor
  )
  create(
    @Body()
    dto: CreateBienesSecuestradoDto,

    @UploadedFiles()
    fotografias: Express.Multer.File[]
  ) {
    return this.service.create(dto, fotografias ?? [])
  }

  @Post(':id/fotografias')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Agregar múltiples fotografías a un bien registrado',
  })
  @UseInterceptors(
    FilesInterceptor('fotografias', 20, configuracionFotografias)
  )
  agregarFotografias(
    @Param('id', ParseIntPipe)
    id: number,

    @UploadedFiles()
    fotografias: Express.Multer.File[]
  ) {
    return this.service.agregarFotografias(id, fotografias ?? [])
  }

  @Get('operativo/:opId')
  @ApiOperation({
    summary: 'Listar bienes secuestrados por operativo con paginación',
  })
  async findAllPaginado(
    @Param('opId', ParseIntPipe)
    opId: number,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.service.findAllPaginado(opId, pagination)

    return this.successListRows(result)
  }

  @Get('imagenes/:id')
  @ApiOperation({
    summary: 'Obtener las fotografías de un bien',
  })
  obtenerFotografias(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.obtenerFotografias(id)
  }

  @Delete('fotografias/:fotoId')
  @ApiOperation({
    summary: 'Inactivar una fotografía',
  })
  eliminarFotografia(
    @Param('fotoId', ParseIntPipe)
    fotoId: number
  ) {
    return this.service.eliminarFotografia(fotoId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un bien secuestrado por ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un bien secuestrado',
  })
  @UseInterceptors(AuditoriaUsuarioInterceptor)
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateBieneSecuestradoLgiDto
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar un bien secuestrado',
  })
  @UseInterceptors(AuditoriaUsuarioInterceptor)
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.eliminar(id)
  }
}
