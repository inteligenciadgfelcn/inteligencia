import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FotoBienesService } from './foto_bienes.service';
import { CreateFotoBieneDto } from './dto/create-foto_biene.dto';
import { UpdateFotoBieneDto } from './dto/update-foto_biene.dto';

@Controller('foto-bienes')
export class FotoBienesController {
  constructor(private readonly fotoBienesService: FotoBienesService) {}

  @Post()
  create(@Body() createFotoBieneDto: CreateFotoBieneDto) {
    return this.fotoBienesService.create(createFotoBieneDto);
  }

  @Get()
  findAll() {
    return this.fotoBienesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fotoBienesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFotoBieneDto: UpdateFotoBieneDto) {
    return this.fotoBienesService.update(+id, updateFotoBieneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fotoBienesService.remove(+id);
  }
}
