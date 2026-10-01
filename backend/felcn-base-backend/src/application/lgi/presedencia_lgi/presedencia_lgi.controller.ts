import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { BaseController } from '@/common/base/base-controller'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { CreatePresedenciaLgiDto } from './dto/create-presedencia_lgi.dto'
import { PresedenciaLgiService } from './presedencia_lgi.service'
import { PaginacionQueryDto } from '@/common/dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Ganancias ilícitas')
@Controller('presedencia-lgi')
export class PresedenciaLgiController extends BaseController {
  constructor(private readonly presedenciaLgiService: PresedenciaLgiService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una presedencia' })
  create(@Body() dto: CreatePresedenciaLgiDto) {
    return this.presedenciaLgiService.create(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactivar una presedencia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.presedenciaLgiService.remove(id)
  }

  @Get('caso/:casosId')
  @ApiOperation({
    summary: 'Listar casos precedentes y sus operativos en SIII',
  })
  async findAllByCaso(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.presedenciaLgiService.findAllPaginadoByCaso(
      casosId,
      pagination
    )

    return this.successListRows(result)
  }
}
