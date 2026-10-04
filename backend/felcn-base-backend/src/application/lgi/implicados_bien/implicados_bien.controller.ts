import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImplicadosBienService } from './implicados_bien.service';
import { CreateImplicadosBienDto } from './dto/create-implicados_bien.dto';
import { UpdateImplicadosBienDto } from './dto/update-implicados_bien.dto';
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Implicados Bien LGI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@Controller('implicados-bien')
export class ImplicadosBienController {
  constructor(private readonly service: ImplicadosBienService) {}

   @Post()
    @ApiOperation({
      summary: 'Registrar un implicado',
    })
    create(@Body() dto: CreateImplicadosBienDto) {
      return this.service.create(dto)
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar implicados con filtros por caso y bien',
    })
    @ApiQuery({
      name: 'casoId',
      type: String,
      example: '60',
      required: false,
    })
    @ApiQuery({
      name: 'idItemBien',
      type: Number,
      example: 5,
      required: false,
    })
    findAll(
      @Query('operativoId') id_operativo?: string,
      @Query('idItemBien') idItemBien?: number
    ) {
      return this.service.findAll(id_operativo, idItemBien)
    }
  
    @Get('operativo/:operativoId')
    @ApiOperation({
      summary: 'Listar implicados de un operativo',
    })
    @ApiParam({
      name: 'operativoId',
      description: 'ID del operativo',
      type: String,
      example: '10',
    })
    findByOperativo(@Param('operativoId') operativoId: string) {
      return this.service.findByOperativo(operativoId)
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Obtener un implicado por ID',
    })
    @ApiParam({
      name: 'id',
      description: 'ID del implicado',
      type: String,
      example: '1',
    })
    findOne(@Param('id') id: string) {
      return this.service.findOne(id)
    }
  
    @Patch(':id')
    @ApiOperation({
      summary: 'Actualizar un implicado',
    })
    @ApiParam({
      name: 'id',
      description: 'ID del implicado',
      type: String,
      example: '1',
    })
    update(@Param('id') id: string, @Body() dto: UpdateImplicadosBienDto) {
      return this.service.update(id, dto)
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar físicamente un implicado',
    })
    @ApiParam({
      name: 'id',
      description: 'ID del implicado',
      type: String,
      example: '1',
    })
    remove(@Param('id') id: string) {
      return this.service.remove(id)
    }
}
