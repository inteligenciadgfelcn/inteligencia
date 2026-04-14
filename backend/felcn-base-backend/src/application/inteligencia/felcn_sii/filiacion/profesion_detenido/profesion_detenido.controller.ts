import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ProfesionDetenidoService } from './profesion_detenido.service'
import { CreateProfesionDetenidoDto } from './dto/create-profesion_detenido.dto'
import { UpdateProfesionDetenidoDto } from './dto/update-profesion_detenido.dto'

@Controller('profesion-detenido')
export class ProfesionDetenidoController {
  constructor(
    private readonly profesionDetenidoService: ProfesionDetenidoService
  ) {}

  @Post()
  create(@Body() createProfesionDetenidoDto: CreateProfesionDetenidoDto) {
    return this.profesionDetenidoService.create(createProfesionDetenidoDto)
  }

  @Get()
  findAll() {
    return this.profesionDetenidoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesionDetenidoService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfesionDetenidoDto: UpdateProfesionDetenidoDto
  ) {
    return this.profesionDetenidoService.update(+id, updateProfesionDetenidoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesionDetenidoService.remove(+id)
  }
}
