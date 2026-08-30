import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArrestadoAuxiliarService } from './arrestado_auxiliar.service';
import { CreateArrestadoAuxiliarDto } from './dto/create-arrestado_auxiliar.dto';
import { UpdateArrestadoAuxiliarDto } from './dto/update-arrestado_auxiliar.dto';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Arrestado Auxiliar (SIII)')
@Controller('arrestado-auxiliar')
export class ArrestadoAuxiliarController {
  constructor(private readonly arrestadoAuxiliarService: ArrestadoAuxiliarService) {}

  @Post()
  create(@Body() createArrestadoAuxiliarDto: CreateArrestadoAuxiliarDto) {
    return this.arrestadoAuxiliarService.create(createArrestadoAuxiliarDto);
  }

  @Get()
  findAll() {
    return this.arrestadoAuxiliarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arrestadoAuxiliarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArrestadoAuxiliarDto: UpdateArrestadoAuxiliarDto) {
    return this.arrestadoAuxiliarService.update(+id, updateArrestadoAuxiliarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arrestadoAuxiliarService.remove(+id);
  }
}
