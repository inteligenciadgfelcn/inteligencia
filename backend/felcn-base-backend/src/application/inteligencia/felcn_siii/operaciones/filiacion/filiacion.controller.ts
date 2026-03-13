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
import { FiliacionService } from './filiacion.service'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { UpdateFiliacionDto } from './dto/update-filiacion.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Filiacion')
@Controller('filiacion')
export class FiliacionController extends BaseController {
  constructor(private readonly filiacionService: FiliacionService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar formulario de Filiación de personas',
  })
  create(@Body() createFiliacionDto: CreateFiliacionDto) {
    return this.filiacionService.create(createFiliacionDto)
  }

  @Get('personasSinFiliar/:numeroCaso')
  findAllPersonaSinFiliar(@Param('numeroCaso') numeroCaso: string) {
    return this.filiacionService.findAllPersonasSinFiliar(numeroCaso)
  }

  @Get()
  findAll() {
    return this.filiacionService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filiacionService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFiliacionDto: UpdateFiliacionDto
  ) {
    return this.filiacionService.update(+id, updateFiliacionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filiacionService.remove(+id)
  }
}
