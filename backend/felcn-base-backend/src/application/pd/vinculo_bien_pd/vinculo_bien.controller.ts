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
import { BaseController } from '@/common/base/base-controller'
import { CreateVinculoBienDto } from './dto/create-vinculo_bien_pd.dto'
import { UpdateVinculoBienDto } from './dto/update-vinculo_bien_pd.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { VinculoBienService } from './vinculo_bien.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('vinculo-bien-pd')
export class VinculoBienController extends BaseController {

  constructor(private readonly vinculoBienService: VinculoBienService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un vínculo de bien',
  })
  create(@Body() dto: CreateVinculoBienDto) {
    return this.vinculoBienService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar vínculos de bienes con paginación',
  })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.vinculoBienService.findAllPaginado(pagination)

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
    return this.vinculoBienService.findByBien(itemBienSecId)
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
    return this.vinculoBienService.findOne(id)
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
  update(@Param('id') id: string, @Body() dto: UpdateVinculoBienDto) {
    return this.vinculoBienService.update(id, dto)
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
    return this.vinculoBienService.remove(id)
  }
}
