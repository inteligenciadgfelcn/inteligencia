import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common'
import { CaracteristicasBienesService } from './caracteristicas_bienes.service'
import { UpdateCaracteristicasBieneDto } from './dto/update-caracteristicas_biene.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { CreateCaracteristicasBieneDto } from './dto/create-caracteristicas_biene.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Bienes secuestrados')
@Controller('caracteristicas-bienes')
export class CaracteristicasBienesController extends BaseController {
  constructor(
    private readonly caracteristicasBienesService: CaracteristicasBienesService
  ) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar una característica de un bien secuestrado',
  })
  create(
    @Body()
    createDto: CreateCaracteristicasBieneDto
  ) {
    return this.caracteristicasBienesService.create(createDto)
  }

  @Get('bien/:itembiensecId')
  @ApiOperation({
    summary: 'Listar características por bien secuestrado',
  })
  findByBien(
    @Param('itembiensecId', ParseIntPipe)
    itembiensecId: number
  ) {
    return this.caracteristicasBienesService.findByBien(itembiensecId)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una característica',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateDto: UpdateCaracteristicasBieneDto
  ) {
    return this.caracteristicasBienesService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar una característica',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.caracteristicasBienesService.remove(id)
  }
}
