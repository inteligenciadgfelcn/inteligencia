import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ParseIntPipe, Query, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { PersonasJuridicasPdService } from './personas_juridicas_pd.service';
import { CreatePersonasJuridicasPdDto } from './dto/create-personas_juridicas_pd.dto';
import { UpdatePersonasJuridicasPdDto } from './dto/update-personas_juridicas_pd.dto';
import { BaseController } from '@/common/base';
import { PaginacionQueryDto } from '@/common/dto';
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

interface ArchivosEmpresa {
  imagen?: Express.Multer.File[]
  documento?: Express.Multer.File[]
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('personas-juridicas-pd')
export class PersonasJuridicasPdController extends BaseController {
  constructor(private readonly service: PersonasJuridicasPdService) {
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
    FileFieldsInterceptor([
      {
        name: 'imagen',
        maxCount: 1,
      },
      {
        name: 'documento',
        maxCount: 1,
      },
    ]),

    AuditoriaUsuarioInterceptor
  )
  create(
    @Body()
    dto: CreatePersonasJuridicasPdDto,

    @UploadedFiles()
    archivos: ArchivosEmpresa = {}
  ) {
    const imagen = archivos.imagen?.[0]

    const documento = archivos.documento?.[0]

    this.validarImagen(imagen)

    this.validarDocumento(documento)

    return this.service.create(dto, imagen, documento)
  }

  @Get('operativo/:opId')
  @ApiOperation({
    summary: 'Listar personas jurídicas por operativo',
  })
  async findByOperativoPaginado(
    @Param('opId', ParseIntPipe)
    opId: number,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.service.findAllPaginadoPorOperativo(
      opId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get('caso/:casosId')
  @ApiOperation({
    summary: 'Listar personas jurídicas por caso',
  })
  async findByCaso(
    @Param('casosId', ParseIntPipe)
    casosId: number,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.service.findAllPaginadoPorCaso(
      casosId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get('operativo/:opId')
  @ApiOperation({
    summary: 'Listar personas jurídicas por operativo',
  })
  findByOperativo(
    @Param('opId', ParseIntPipe)
    opId: number
  ) {
    return this.service.findByOperativo(opId)
  }

  @Get(':empId')
  @ApiOperation({
    summary: 'Obtener una persona jurídica por ID',
  })
  findOne(
    @Param('empId', ParseIntPipe)
    empId: number
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
    FileFieldsInterceptor([
      {
        name: 'imagen',
        maxCount: 1,
      },
      {
        name: 'documento',
        maxCount: 1,
      },
    ]),

    AuditoriaUsuarioInterceptor
  )
  update(
    @Param('empId', ParseIntPipe)
    empId: number,
    @Body()
    dto: UpdatePersonasJuridicasPdDto,
    @UploadedFiles()
    archivos: ArchivosEmpresa = {}
  ) {
    const imagen = archivos.imagen?.[0]
    const documento = archivos.documento?.[0]
    this.validarImagen(imagen)
    this.validarDocumento(documento)
    return this.service.update(empId, dto, imagen, documento)
  }

  @Delete(':empId')
  @ApiOperation({
    summary: 'Eliminar una persona jurídica',
  })
  remove(
    @Param('empId', ParseIntPipe)
    empId: number
  ) {
    return this.service.remove(empId)
  }

  private validarImagen(archivo?: Express.Multer.File): void {
    if (!archivo) {
      return
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']

    if (!tiposPermitidos.includes(archivo.mimetype)) {
      throw new BadRequestException(
        'La imagen debe estar en formato JPG, PNG o WEBP'
      )
    }
  }

  private validarDocumento(archivo?: Express.Multer.File): void {
    if (!archivo) {
      return
    }

    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!tiposPermitidos.includes(archivo.mimetype)) {
      throw new BadRequestException(
        'El documento debe estar en formato PDF, JPG, PNG o WEBP'
      )
    }
  }
}
