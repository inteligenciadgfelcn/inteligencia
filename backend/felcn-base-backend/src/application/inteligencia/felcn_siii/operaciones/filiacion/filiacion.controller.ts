import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiliacionService } from './filiacion.service';
import { CreateFiliacionDto } from './dto/create-filiacion.dto';
import { UpdateFiliacionDto } from './dto/update-filiacion.dto';

@Controller('filiacion')
export class FiliacionController {
  constructor(private readonly filiacionService: FiliacionService) {}

  @Post()
  create(@Body() createFiliacionDto: CreateFiliacionDto) {
    return this.filiacionService.create(createFiliacionDto);
  }

  @Get()
  findAll() {
    return this.filiacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filiacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiliacionDto: UpdateFiliacionDto) {
    return this.filiacionService.update(+id, updateFiliacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filiacionService.remove(+id);
  }
}
