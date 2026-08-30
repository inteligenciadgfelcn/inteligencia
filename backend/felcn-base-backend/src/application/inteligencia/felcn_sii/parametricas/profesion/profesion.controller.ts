import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@/common/base';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Profesion')
@Controller('profesion')
export class ProfesionController extends BaseController{
  constructor(private readonly profesionService: ProfesionService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un profesión' })
  create(@Body() createProfesionDto: CreateProfesionDto) {
    return this.profesionService.create(createProfesionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los profesión' })
  findAll() {
    return this.profesionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener profesión por ID' })
  findOne(@Param('id') id: number) {
    return this.profesionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar profesión ID' })
  update(@Param('id') id: number, @Body() updateProfesionDto: UpdateProfesionDto) {
    return this.profesionService.update(+id, updateProfesionDto);
  }

}
