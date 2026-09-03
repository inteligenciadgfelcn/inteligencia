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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'

import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import {
  crearConfiguracionArchivo,
  crearValidadorArchivo,
} from '@/common/utils/file-storage.util'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { ActuacionesService } from './actuaciones.service'
import { CreateOperativoLgiDto } from './dto/create-operativoLgi.dto'
import { UpdateOperativoLgiDto } from './dto/update-operativoLgi.dto'
import { OperativoLgi } from './entities/operativoLgi.entity'

type AuthenticatedRequest = Request & {
  user?: {
    numeroPase?: string
  }
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Actuaciones')
@Controller('actuaciones')
export class ActuacionesController extends BaseController {
  constructor(private readonly actuacionesService: ActuacionesService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un operativo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateOperativoLgiDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Operativo registrado correctamente',
    type: OperativoLgi,
  })
  @UseInterceptors(
    FileInterceptor(
      'archivo',
      crearConfiguracionArchivo('lgi', 'operativos', 10)
    )
  )
  create(
    @Body() dto: CreateOperativoLgiDto,

    @UploadedFile(crearValidadorArchivo(10, true))
    archivo: Express.Multer.File,

    @Req() request: AuthenticatedRequest
  ): Promise<OperativoLgi> {
    const usuario = request.user?.numeroPase ?? 'SISTEMA'

    return this.actuacionesService.create(dto, archivo, usuario)
  }

  @Get('caso/:casosId')
  @ApiOperation({
    summary: 'Listar operativos por caso con paginación',
  })
  async findAllByCaso(
    @Param('casosId', ParseIntPipe)
    casosId: number,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.actuacionesService.findAllPaginadoByCaso(
      casosId,
      pagination
    )

    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un operativo por ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ): Promise<OperativoLgi> {
    return this.actuacionesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un operativo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateOperativoLgiDto,
  })
  @UseInterceptors(
    FileInterceptor(
      'archivo',
      crearConfiguracionArchivo('lgi', 'operativos', 10)
    )
  )
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateOperativoLgiDto,

    @UploadedFile(crearValidadorArchivo(10, false))
    archivo: Express.Multer.File | undefined,

    @Req()
    request: AuthenticatedRequest
  ): Promise<OperativoLgi> {
    const usuario = request.user?.numeroPase ?? 'SISTEMA'

    return this.actuacionesService.update(id, dto, usuario, archivo)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar un operativo',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @Req()
    request: AuthenticatedRequest
  ): Promise<OperativoLgi> {
    const usuario = request.user?.numeroPase ?? 'SISTEMA'

    return this.actuacionesService.remove(id, usuario)
  }
}
