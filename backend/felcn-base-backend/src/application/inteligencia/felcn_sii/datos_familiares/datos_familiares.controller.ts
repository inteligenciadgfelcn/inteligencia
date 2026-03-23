import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatosFamiliaresService } from './datos_familiares.service';
import { CreateDatosFamiliareDto } from './dto/create-datos_familiare.dto';
import { UpdateDatosFamiliareDto } from './dto/update-datos_familiare.dto';

@Controller('datos-familiares')
export class DatosFamiliaresController {
  constructor(private readonly datosFamiliaresService: DatosFamiliaresService) {}

  @Post()
  create(@Body() createDatosFamiliareDto: CreateDatosFamiliareDto) {
    return this.datosFamiliaresService.create(createDatosFamiliareDto);
  }

  @Get()
  findAll() {
    return this.datosFamiliaresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datosFamiliaresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatosFamiliareDto: UpdateDatosFamiliareDto) {
    return this.datosFamiliaresService.update(+id, updateDatosFamiliareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datosFamiliaresService.remove(+id);
  }
}
