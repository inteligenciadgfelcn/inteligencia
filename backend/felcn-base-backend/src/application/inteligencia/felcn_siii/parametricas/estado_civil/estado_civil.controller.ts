import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { EstadoCivilService } from './estado_civil.service'
import { CreateEstadoCivilDto } from './dto/create-estado_civil.dto'
import { UpdateEstadoCivilDto } from './dto/update-estado_civil.dto'
import { BaseController } from '@/common/base'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Estado civil')
@Controller('estado-civil')
export class EstadoCivilController extends BaseController {
  constructor(private readonly estadoCivilService: EstadoCivilService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un estado civil' })
  create(@Body() createEstadoCivilDto: CreateEstadoCivilDto) {
    return this.estadoCivilService.create(createEstadoCivilDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos estados civiles' })
  findAll() {
    return this.estadoCivilService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener estado civil por ID' })
  findOne(@Param('id') id: number) {
    return this.estadoCivilService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estado civil ID' })
  update(
    @Param('id') id: number,
    @Body() updateEstadoCivilDto: UpdateEstadoCivilDto
  ) {
    return this.estadoCivilService.update(+id, updateEstadoCivilDto)
  }
}
