import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoNarizService } from './tipo_nariz.service';
import { CreateTipoNarizDto } from './dto/create-tipo_nariz.dto';
import { UpdateTipoNarizDto } from './dto/update-tipo_nariz.dto';
import { BaseController } from '@/common/base';
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Tipo nariz')
@Controller('tipo-nariz')
export class TipoNarizController extends BaseController {
  constructor(private readonly tipoNarizService: TipoNarizService) {
    super()
  }

  @Post()
   @ApiOperation({ summary: 'Crear un tipo nariz' })
  create(@Body() createTipoNarizDto: CreateTipoNarizDto) {
    return this.tipoNarizService.create(createTipoNarizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de nariz' })
  findAll() {
    return this.tipoNarizService.findAll();
  }

  @Get(':id')
    @ApiOperation({ summary: 'Obtener tipo nariz por ID' })
  findOne(@Param('id') id: string) {
    return this.tipoNarizService.findOne(+id);
  }

  @Patch(':id')
   @ApiOperation({ summary: 'Actualizar tipo nariz ID' })
  update(@Param('id') id: string, @Body() updateTipoNarizDto: UpdateTipoNarizDto) {
    return this.tipoNarizService.update(+id, updateTipoNarizDto);
  }

  
}
