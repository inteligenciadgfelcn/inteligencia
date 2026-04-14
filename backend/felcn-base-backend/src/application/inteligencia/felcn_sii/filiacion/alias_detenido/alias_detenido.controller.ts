import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { AliasDetenidoService } from './alias_detenido.service'
import { CreateAliasDetenidoDto } from './dto/create-alias_detenido.dto'
import { UpdateAliasDetenidoDto } from './dto/update-alias_detenido.dto'

@Controller('alias-detenido')
export class AliasDetenidoController {
  constructor(private readonly aliasDetenidoService: AliasDetenidoService) {}

  @Post()
  create(@Body() createAliasDetenidoDto: CreateAliasDetenidoDto) {
    return this.aliasDetenidoService.create(createAliasDetenidoDto)
  }

  @Get()
  findAll() {
    return this.aliasDetenidoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aliasDetenidoService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAliasDetenidoDto: UpdateAliasDetenidoDto
  ) {
    return this.aliasDetenidoService.update(+id, updateAliasDetenidoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aliasDetenidoService.remove(+id)
  }
}
