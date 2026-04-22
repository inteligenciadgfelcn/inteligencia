import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetenidoService } from './detenido.service';
import { CreateDetenidoDto } from './dto/create-detenido.dto';
import { UpdateDetenidoDto } from './dto/update-detenido.dto';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Detenido')
@Controller('detenido')
export class DetenidoController {
  constructor(private readonly detenidoService: DetenidoService) {}

  @Post()
  create(@Body() createDetenidoDto: CreateDetenidoDto) {
    return this.detenidoService.create(createDetenidoDto);
  }

  @Get()
  findAll() {
    return this.detenidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detenidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetenidoDto: UpdateDetenidoDto) {
    return this.detenidoService.update(+id, updateDetenidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detenidoService.remove(+id);
  }
}
