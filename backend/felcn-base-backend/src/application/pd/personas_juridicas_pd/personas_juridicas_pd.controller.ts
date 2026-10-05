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
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { PersonasJuridicasPdService } from './personas_juridicas_pd.service'
import { CreatePersonasJuridicasPdDto } from './dto/create-personas_juridicas_pd.dto'
import { UpdatePersonasJuridicasPdDto } from './dto/update-personas_juridicas_pd.dto'
import { crearConfiguracionArchivo } from '@/common/utils/file-storage.util'

interface ArchivosEmpresa {
  imagen?: Express.Multer.File[]
  documento?: Express.Multer.File[]
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('PD - Pérdida de Dominio')
@Controller('personas-juridicas-pd')
export class PersonasJuridicasPdController extends BaseController {
  constructor(
    private readonly service: PersonasJuridicasPdService
  ) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar una persona jurídica',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePersonasJuridicasPdDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagen', maxCount: 1 },
        { name: 'documento', maxCount: 1 },
      ],
      crearConfiguracionArchivo('pd', 'personas-juridicas', 10)
    ),
    AuditoriaUsuarioInterceptor
  )
  create(
    @Body() dto: CreatePersonasJuridicasPdDto,
    @UploadedFiles() archivos: ArchivosEmpresa = {}
  ) {
    return this.service.create(
      dto,
      archivos.imagen?.[0],
      archivos.documento?.[0]
    )
  }

  @Get('operativo/:opId')
  @ApiOperation({
    summary: 'Listar personas jurídicas por operativo con paginación',
  })
  async findByOperativoPaginado(
    @Param('opId', ParseIntPipe) opId: number,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.service.findAllPaginadoPorOperativo(
      opId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get('operativo/:opId/todos')
  @ApiOperation({
    summary: 'Listar todas las personas jurídicas de un operativo',
  })
  findByOperativo(
    @Param('opId', ParseIntPipe) opId: number
  ) {
    return this.service.findByOperativo(opId)
  }

  @Get('caso/:casosId')
  @ApiOperation({
    summary: 'Listar personas jurídicas por caso con paginación',
  })
  async findByCaso(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.service.findAllPaginadoPorCaso(
      casosId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get(':empId')
  @ApiOperation({
    summary: 'Obtener una persona jurídica por ID',
  })
  findOne(
    @Param('empId', ParseIntPipe) empId: number
  ) {
    return this.service.findOne(empId)
  }

  @Patch(':empId')
  @ApiOperation({
    summary: 'Actualizar una persona jurídica',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdatePersonasJuridicasPdDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagen', maxCount: 1 },
        { name: 'documento', maxCount: 1 },
      ],
      crearConfiguracionArchivo('pd', 'personas-juridicas', 10)
    ),
    AuditoriaUsuarioInterceptor
  )
  update(
    @Param('empId', ParseIntPipe) empId: number,
    @Body() dto: UpdatePersonasJuridicasPdDto,
    @UploadedFiles() archivos: ArchivosEmpresa = {}
  ) {
    return this.service.update(
      empId,
      dto,
      archivos.imagen?.[0],
      archivos.documento?.[0]
    )
  }

  @Delete(':empId')
  @ApiOperation({
    summary: 'Eliminar una persona jurídica',
  })
  remove(
    @Param('empId', ParseIntPipe) empId: number
  ) {
    return this.service.remove(empId)
  }
}