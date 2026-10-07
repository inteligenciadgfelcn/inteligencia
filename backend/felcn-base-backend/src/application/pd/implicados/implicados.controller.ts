import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { CreateImplicadoLgiDto } from './dto/create-implicado.dto'
import { UpdateImplicadoLgiDto } from './dto/update-implicado.dto'
import { ImplicadoLgiService } from './implicados.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('implicado-pd')
export class ImplicadoLgiController {
  constructor(private readonly service: ImplicadoLgiService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar un implicado',
  })
  create(@Body() dto: CreateImplicadoLgiDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar implicados con filtros por caso y empresa',
  })
  @ApiQuery({
    name: 'casoId',
    type: String,
    example: '60',
    required: false,
  })
  @ApiQuery({
    name: 'empresaId',
    type: Number,
    example: 5,
    required: false,
  })
  findAll(
    @Query('operativoId') id_operativo?: string,
    @Query('empresaId') empresaId?: string
  ) {
    if (id_operativo !== undefined && !/^[1-9]\d*$/.test(id_operativo)) {
      throw new BadRequestException('id_operativo debe ser un entero positivo')
    }

    let empresa: number | undefined

    if (empresaId !== undefined) {
      empresa = Number(empresaId)

      if (
        !/^[1-9]\d*$/.test(empresaId) ||
        !Number.isSafeInteger(empresa) ||
        empresa > 2147483647
      ) {
        throw new BadRequestException(
          'empresaId debe ser un entero positivo válido'
        )
      }
    }

    return this.service.findAll(id_operativo, empresa)
  }

  @Get('operativo/:operativoId')
  @ApiOperation({
    summary: 'Listar implicados de un operativo',
  })
  @ApiParam({
    name: 'operativoId',
    description: 'ID del operativo',
    type: String,
    example: '10',
  })
  findByOperativo(@Param('operativoId') operativoId: string) {
    return this.service.findByOperativo(operativoId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un implicado por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del implicado',
    type: String,
    example: '1',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un implicado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del implicado',
    type: String,
    example: '1',
  })
  update(@Param('id') id: string, @Body() dto: UpdateImplicadoLgiDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar físicamente un implicado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del implicado',
    type: String,
    example: '1',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
