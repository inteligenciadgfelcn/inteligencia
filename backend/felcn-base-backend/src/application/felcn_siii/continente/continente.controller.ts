import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContinenteService } from './continente.service';
import { CreateContinenteDto } from './dto/create-continente.dto';
import { UpdateContinenteDto } from './dto/update-continente.dto';

@Controller('continente')
export class ContinenteController {
  constructor(private readonly continenteService: ContinenteService) {}

  @Post()
  create(@Body() createContinenteDto: CreateContinenteDto) {
    return this.continenteService.create(createContinenteDto);
  }

  @Get()
  findAll() {
    return this.continenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.continenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContinenteDto: UpdateContinenteDto) {
    return this.continenteService.update(+id, updateContinenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.continenteService.remove(+id);
  }
}
