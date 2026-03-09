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
import { TipoOjosService } from './tipo_ojos.service'
import { CreateTipoOjoDto } from './dto/create-tipo_ojo.dto'
import { UpdateTipoOjoDto } from './dto/update-tipo_ojo.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Tipo ojos')
@Controller('tipo-ojos')
export class TipoOjosController {
  constructor(private readonly tipoOjosService: TipoOjosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un tipo de ojo' })
  create(@Body() createTipoOjoDto: CreateTipoOjoDto) {
    return this.tipoOjosService.create(createTipoOjoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de ojos' })
  findAll() {
    return this.tipoOjosService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de ojos por ID' })
  findOne(@Param('id') id: number) {
    return this.tipoOjosService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de ojos ID' })
  update(@Param('id') id: number, @Body() updateTipoOjoDto: UpdateTipoOjoDto) {
    return this.tipoOjosService.update(+id, updateTipoOjoDto)
  }
}
