import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConstitucionCorporalService } from './constitucion_corporal.service'
import { CreateConstitucionCorporalDto } from './dto/create-constitucion-corporal.dto'
import { UpdateConstitucionCorporalDto } from './dto/update-constitucion-corporal.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Constitucion corporal')
@Controller('constitucion-corporal')
export class ConstitucionCorporalController {
  constructor(private readonly constitucionService: ConstitucionCorporalService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una constitucion corporal' })
  create(@Body() createConstitucionDto: CreateConstitucionCorporalDto) {
    return this.constitucionService.create(createConstitucionDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar constitucion corporal' })
  findAll() {
    return this.constitucionService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener constitucion corporal por ID' })
  findOne(@Param('id') id: number) {
    return this.constitucionService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar constitucion corporal ID' })
  update(
    @Param('id') id: number,
    @Body() updateConstitucionDto: UpdateConstitucionCorporalDto
  ) {
    return this.constitucionService.update(+id, updateConstitucionDto)
  }
}
