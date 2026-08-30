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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { CreateEstadoDto } from './dto/create-estado.dto'
import { UpdateEstadoDto } from './dto/update-estado.dto'
import { EstadoLgiService } from './estado.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Estado LGI')
@Controller('parametro/estado')
export class EstadoLgiController {
  constructor(private readonly service: EstadoLgiService) {}

  @Post()
  create(@Body() dto: CreateEstadoDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':idEtapa')
  find(@Param('idEtapa', ParseIntPipe) idEtapa: number) {
    return this.service.findAllEtapa(idEtapa)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoDto) {
    return this.service.update(id, dto)
  }
}
