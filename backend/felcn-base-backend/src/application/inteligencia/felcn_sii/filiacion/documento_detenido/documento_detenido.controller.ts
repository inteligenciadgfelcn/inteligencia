import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DocumentoDetenidoService } from './documento_detenido.service'
import { CreateDocumentoDetenidoDto } from './dto/create-documento_detenido.dto'
import { UpdateDocumentoDetenidoDto } from './dto/update-documento_detenido.dto'

@Controller('documento-detenido')
export class DocumentoDetenidoController {
  constructor(
    private readonly documentoDetenidoService: DocumentoDetenidoService
  ) {}

  @Post()
  create(@Body() createDocumentoDetenidoDto: CreateDocumentoDetenidoDto) {
    return this.documentoDetenidoService.create(createDocumentoDetenidoDto)
  }

  @Get()
  findAll() {
    return this.documentoDetenidoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentoDetenidoService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentoDetenidoDto: UpdateDocumentoDetenidoDto
  ) {
    return this.documentoDetenidoService.update(+id, updateDocumentoDetenidoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentoDetenidoService.remove(+id)
  }
}
