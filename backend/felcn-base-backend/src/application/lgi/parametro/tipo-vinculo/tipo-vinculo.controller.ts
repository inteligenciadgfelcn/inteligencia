import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { CreateTipoVinculoDto } from './dto/create-tipo-vinculo.dto'
import { TipoVinculoLgiService } from './tipo-vinculo.service'
import { UpdatipoVinculoDto } from './dto/update-tipo-vinculo.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Tipo vinculo LGI')
@Controller('parametro/tipo-vinculo')
export class TipoVinculoLgiController {
  constructor(private readonly service: TipoVinculoLgiService) {}

  @Post()
  create(@Body() dto: CreateTipoVinculoDto) {
    return this.service.create(dto)
  }

  @Get('tipo/:idVinculo')
  @ApiOperation({
    summary: 'Listar bienes secuestrados por tipo de vínculo',
  })
  findAllByTipoVinculo(
    @Param('idVinculo', ParseIntPipe)
    idVinculo: number
  ) {
    return this.service.findAllByTipoVinculo(idVinculo)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatipoVinculoDto
  ) {
    return this.service.update(id, dto)
  }
}
