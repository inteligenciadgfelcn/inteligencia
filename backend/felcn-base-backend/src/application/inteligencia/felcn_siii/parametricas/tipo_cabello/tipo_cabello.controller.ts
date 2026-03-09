import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoCabelloService } from './tipo_cabello.service';
import { CreateTipoCabelloDto } from './dto/create-tipo_cabello.dto';
import { UpdateTipoCabelloDto } from './dto/update-tipo_cabello.dto';
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseController } from '@/common/base';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Tipo de cabello')
@Controller('tipo-cabello')
export class TipoCabelloController extends BaseController {
  constructor(private readonly tipoCabelloService: TipoCabelloService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un tipo de cabello' })
    @ApiResponse({ status: 201 })
  create(@Body() createTipoCabelloDto: CreateTipoCabelloDto) {
    return this.tipoCabelloService.create(createTipoCabelloDto);
  }

  @Get()
    @ApiOperation({ summary: 'Listar todos los tipos de cabello' })
  findAll() {
    return this.tipoCabelloService.findAll();
  }

  @Get(':id')
   @ApiOperation({ summary: 'Obtener tipo de cabello por ID' })
  findOne(@Param('id') id: number) {
    return this.tipoCabelloService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de cabello ID' })
  update(@Param('id') id: number, @Body() updateTipoCabelloDto: UpdateTipoCabelloDto) {
    return this.tipoCabelloService.update(+id, updateTipoCabelloDto);
  }

}
