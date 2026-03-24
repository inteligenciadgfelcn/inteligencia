import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ColorCabelloService } from './color_cabello.service';
import { CreateColorCabelloDto } from './dto/create-color_cabello.dto';
import { UpdateColorCabelloDto } from './dto/update-color_cabello.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@/common/base';
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Color de cabello')
@Controller('color-cabello')
export class ColorCabelloController extends BaseController {
  constructor(private readonly colorCabelloService: ColorCabelloService) {
    super ()
  }

  @Post()
   @ApiOperation({ summary: 'Crear un color de cabello' })
   @ApiResponse({ status: 201 })
   create(@Body() dto: CreateColorCabelloDto) {
     return this.colorCabelloService.create(dto)
   }
 
   @Get()
   @ApiOperation({ summary: 'Listar todos los colores de cabello' })
   findAll() {
     return this.colorCabelloService.findAll()
   }
 
   @Get(':id')
   @ApiOperation({ summary: 'Obtener color de cabello por ID' })
   findOne(@Param('id') id: number) {
     return this.colorCabelloService.findOne(id)
   }
 
   @Patch(':id')
   @ApiOperation({ summary: 'Actualizar color de cabello ID' })
   update(@Param('id') id: number, @Body() dto: UpdateColorCabelloDto) {
     return this.colorCabelloService.update(id, dto)
   }
}
