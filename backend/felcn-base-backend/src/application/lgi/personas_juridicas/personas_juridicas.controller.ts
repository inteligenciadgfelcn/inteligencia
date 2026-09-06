import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
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

import { Response } from 'express'

import { BaseController } from '@/common/base'

import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { CreatePersonasJuridicaDto } from './dto/create-personas_juridica.dto'

import { UpdatePersonasJuridicaDto } from './dto/update-personas_juridica.dto'

import { PersonasJuridicasService } from './personas_juridicas.service'

interface ArchivosEmpresa {
  imagen?: Express.Multer.File[]

  documento?: Express.Multer.File[]
}

@ApiBearerAuth()
@UseInterceptors(AuditoriaUsuarioInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Personas jurídicas')
@Controller('personas-juridicas')
export class PersonasJuridicasController extends BaseController {
  constructor(private readonly service: PersonasJuridicasService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar una persona jurídica',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePersonasJuridicaDto,
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
    dto: CreatePersonasJuridicaDto,

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
    type: UpdatePersonasJuridicaDto,
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
    dto: UpdatePersonasJuridicaDto,

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
