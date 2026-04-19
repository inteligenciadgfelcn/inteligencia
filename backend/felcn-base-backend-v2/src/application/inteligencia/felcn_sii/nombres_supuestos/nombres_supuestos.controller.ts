import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { NombresSupuestosService } from './nombres_supuestos.service';
import { CreateNombresSupuestoDto } from './dto/create-nombres_supuesto.dto';
import { UpdateNombresSupuestoDto } from './dto/update-nombres_supuesto.dto';
import { BaseController } from '@/common/base';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Nombres supuestos')
@Controller('nombres-supuestos')
export class NombresSupuestosController extends BaseController {
  constructor(private readonly nombresSupuestosService: NombresSupuestosService) {
    super();
  }

  @Post()
   @ApiOperation({ summary: 'Crear un nombre supuesto' })
   @ApiResponse({ status: 201, description: 'Nombre supuesto creado correctamente' })
   create(@Body() dto: CreateNombresSupuestoDto) {
     return this.nombresSupuestosService.create(dto)
   }
 
   @Get('detenido')
   @ApiOperation({ summary: 'Listado de nombres supuestos por detenido' })
   @ApiQuery({ name: 'idDetenido', required: true })
   findByDetenido(@Query('idDetenido') idDetenido: number) {
     return this.nombresSupuestosService.findByDetenido(idDetenido)
   }
 
   @Get(':id')
   @ApiOperation({ summary: 'Obtener un nombre supuesto por ID' })
   findOne(@Param('id') id: number) {
     return this.nombresSupuestosService.findOne(id)
   }
 
   @Patch(':id')
   @ApiOperation({ summary: 'Actualizar un nombre supuesto' })
   update(@Param('id') id: number, @Body() dto: UpdateNombresSupuestoDto) {
     return this.nombresSupuestosService.update(id, dto)
   }
}
