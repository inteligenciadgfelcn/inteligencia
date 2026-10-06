import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { VinculoBienLgiService } from './vinculo_bien_lgi.service'
import { CreateVinculoBienLgiDto } from './dto/create-vinculo_bien_lgi.dto'
import { UpdateVinculoBienLgiDto } from './dto/update-vinculo_bien_lgi.dto'
import { BaseController } from '@/common/base/base-controller'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

@ApiBearerAuth()
@UseInterceptors(AuditoriaUsuarioInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Ganancias ilícitas')
@Controller('vinculo-bien-lgi')
export class VinculoBienLgiController extends BaseController {

  constructor(private readonly vinculoBienLgiService: VinculoBienLgiService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un vínculo de bien',
  })
  create(@Body() dto: CreateVinculoBienLgiDto) {
    return this.vinculoBienLgiService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar vínculos de bienes con paginación',
  })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.vinculoBienLgiService.findAllPaginado(pagination)

    return this.successListRows(result)
  }

  @Get('bien/:itemBienSecId')
  @ApiOperation({
    summary: 'Listar vínculos de un bien con datos de las personas',
  })
  @ApiParam({
    name: 'itemBienSecId',
    description: 'ID del bien secuestrado',
    type: String,
    example: '4419',
  })
  findByBien(@Param('itemBienSecId') itemBienSecId: string) {
    return this.vinculoBienLgiService.findByBien(itemBienSecId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un vínculo con los datos de la persona',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  findOne(@Param('id') id: string) {
    return this.vinculoBienLgiService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un vínculo de bien',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  update(@Param('id') id: string, @Body() dto: UpdateVinculoBienLgiDto) {
    return this.vinculoBienLgiService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un vínculo de bien',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  remove(@Param('id') id: string) {
    return this.vinculoBienLgiService.remove(id)
  }
}
