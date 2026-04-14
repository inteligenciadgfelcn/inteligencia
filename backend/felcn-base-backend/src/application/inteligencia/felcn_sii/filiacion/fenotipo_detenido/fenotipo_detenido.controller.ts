import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { FenotipoDetenidoService } from './fenotipo_detenido.service'
import { CreateFenotipoDetenidoDto } from './dto/create-fenotipo_detenido.dto'
import { UpdateFenotipoDetenidoDto } from './dto/update-fenotipo_detenido.dto'

@Controller('fenotipo-detenido')
export class FenotipoDetenidoController {
  constructor(
    private readonly fenotipoDetenidoService: FenotipoDetenidoService
  ) {}

  @Post()
  create(@Body() createFenotipoDetenidoDto: CreateFenotipoDetenidoDto) {
    return this.fenotipoDetenidoService.create(createFenotipoDetenidoDto)
  }

  @Get()
  findAll() {
    return this.fenotipoDetenidoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fenotipoDetenidoService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFenotipoDetenidoDto: UpdateFenotipoDetenidoDto
  ) {
    return this.fenotipoDetenidoService.update(+id, updateFenotipoDetenidoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fenotipoDetenidoService.remove(+id)
  }
}
