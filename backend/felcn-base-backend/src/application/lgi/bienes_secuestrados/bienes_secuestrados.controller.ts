import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Query,
  UploadedFiles,
  Res,
} from '@nestjs/common'
import { CreateBienesSecuestradoDto } from './dto/create-bienes_secuestrado.dto'
import { BaseController } from '@/common/base'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { BieneSecuestradoLgiService } from './bienes_secuestrados.service'
import { UpdateBieneSecuestradoLgiDto } from './dto/update-bienes_secuestrado.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  crearConfiguracionArchivo,
  obtenerRutaRelativa,
} from '@/common/utils/file-storage.util'
import type { Response } from 'express'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer/interceptors'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Bienes secuestrados')
@Controller('bienes-secuestrados')
export class BienesSecuestradosController extends BaseController {
  constructor(
    private readonly bieneSecuestradoService: BieneSecuestradoLgiService
  ) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un bien secuestrado con fotografías',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'rutaFotografia1',
          maxCount: 1,
        },
        {
          name: 'rutaFotografia2',
          maxCount: 1,
        },
      ],
      crearConfiguracionArchivo('lgi', 'bienes-secuestrados', 5)
    ),
    AuditoriaUsuarioInterceptor
  )
  create(
    @Body()
    dto: CreateBienesSecuestradoDto,

    @UploadedFiles()
    archivos: {
      rutaFotografia1?: Express.Multer.File[]
      rutaFotografia2?: Express.Multer.File[]
    }
  ) {
    const fotografia1 = archivos.rutaFotografia1?.[0]

    const fotografia2 = archivos.rutaFotografia2?.[0]

    if (fotografia1) {
      dto.rutaFotografia1 = obtenerRutaRelativa(fotografia1.path)
    }

    if (fotografia2) {
      dto.rutaFotografia2 = obtenerRutaRelativa(fotografia2.path)
    }

    return this.bieneSecuestradoService.create(dto)
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
    const result = await this.bieneSecuestradoService.findAllPaginado(
      opId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un bien secuestrado por id',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.bieneSecuestradoService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un bien secuestrado',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: UpdateBieneSecuestradoLgiDto
  ) {
    return this.bieneSecuestradoService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un bien secuestrado',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.bieneSecuestradoService.eliminar(id)
  }

  @Get('imagenes/:id')
  @ApiOperation({
    summary: 'Obtener las fotografías protegidas del bien',
  })
  async obtenerFotografias(
    @Param('id', ParseIntPipe)
    id: number,

    @Res({
      passthrough: true,
    })
    response: Response
  ) {
    response.set({
      'Cache-Control': 'private, no-store, max-age=0',
      Pragma: 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    })

    return this.bieneSecuestradoService.obtenerFotografias(id)
  }
}
