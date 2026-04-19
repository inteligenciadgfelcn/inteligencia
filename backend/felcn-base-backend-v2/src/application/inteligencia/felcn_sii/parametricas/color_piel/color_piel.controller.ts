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
import { ColorPielService } from './color_piel.service'
import { CreateColorPielDto } from './dto/create-color_piel.dto'
import { UpdateColorPielDto } from './dto/update-color_piel.dto'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Color de piel')
@Controller('color-piel')
export class ColorPielController {
  constructor(private readonly colorPielService: ColorPielService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un color de piel' })
  @ApiResponse({ status: 201 })
  create(@Body() createColorPielDto: CreateColorPielDto) {
    return this.colorPielService.create(createColorPielDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los colores de piel' })
  findAll() {
    return this.colorPielService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener color de piel por ID' })
  findOne(@Param('id') id: number) {
    return this.colorPielService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar color de piel ID' })
  update(
    @Param('id') id: number,
    @Body() updateColorPielDto: UpdateColorPielDto
  ) {
    return this.colorPielService.update(+id, updateColorPielDto)
  }
}
