import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ColorOjosService } from './color_ojos.service'
import { CreateColorOjoDto } from './dto/create-color_ojo.dto'
import { UpdateColorOjoDto } from './dto/update-color_ojo.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Color de ojos')
@Controller('color-ojos')
export class ColorOjosController extends BaseController {
  constructor(private readonly colorOjosService: ColorOjosService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un color de ojo' })
  @ApiResponse({ status: 201 })
  create(@Body() createColorOjoDto: CreateColorOjoDto) {
    return this.colorOjosService.create(createColorOjoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los colores de ojos' })
  findAll() {
    return this.colorOjosService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener color de ojos por ID' })
  findOne(@Param('id') id: number) {
    return this.colorOjosService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar color de ojos ID' })
  update(
    @Param('id') id: number,
    @Body() updateColorOjoDto: UpdateColorOjoDto
  ) {
    return this.colorOjosService.update(+id, updateColorOjoDto)
  }
}
