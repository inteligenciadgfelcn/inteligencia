import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { FiliacionService } from './filiacion.service'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { UpdateFiliacionDto } from './dto/update-filiacion.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Filiacion de personas')
@Controller('filiacion')
export class FiliacionController extends BaseController {
  constructor(private readonly filiacionService: FiliacionService) {
    super()
  }

@Get('personas/:caso')
@ApiOperation({ summary: 'Listar personas para filiación' })
async obtenerPersonas(
  @Param('caso') caso: string,
  @Query() pagination: PaginacionQueryDto
) {
  const result =
    await this.filiacionService.obtenerPersonasPorCaso(
      caso,
      pagination
    )

  return this.successListRows(result)
}

  @Post()
  create(@Body() createFiliacionDto: CreateFiliacionDto) {
    return this.filiacionService.create(createFiliacionDto)
  }

  @Get()
  findAll() {
    return this.filiacionService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filiacionService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFiliacionDto: UpdateFiliacionDto
  ) {
    return this.filiacionService.update(+id, updateFiliacionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filiacionService.remove(+id)
  }
}
