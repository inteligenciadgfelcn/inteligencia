import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { TipoDocumentoService } from './tipo_documento.service'
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto'
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Tipo documento')
@Controller('tipo-documento')
export class TipoDocumentoController extends BaseController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un tipo de documento' })
  create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return this.tipoDocumentoService.create(createTipoDocumentoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas los tipos de documentos' })
  findAll() {
    return this.tipoDocumentoService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de documento por ID' })
  findOne(@Param('id') id: number) {
    return this.tipoDocumentoService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de documento ID' })
  update(
    @Param('id') id: number,
    @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto
  ) {
    return this.tipoDocumentoService.update(+id, updateTipoDocumentoDto)
  }
}
