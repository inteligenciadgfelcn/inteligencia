import { BaseController } from "@/common/base"
import { PaginacionQueryDto } from "@/common/dto/paginacion-query.dto"
import { UseGuards, Controller, Post, Body, Req, Get, Query, Param, Patch, Delete } from "@nestjs/common"
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger"
import { DepartamentoService } from "./departamento.service"
import { CreateDepartamentoDto } from "./dto/create-departamento.dto"
import { UpdateDepartamentoDto } from "./dto/update-departamento.dto"
import { JwtAuthGuard } from "@/core/config/authorization/guards/jwt-auth.guard"


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Departamentos')
@Controller('departamento')
export class DepartamentoController extends BaseController {
  constructor(private readonly departamentoService: DepartamentoService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un departamento' })
  @ApiResponse({
    status: 201,
    description: 'Departamento creado correctamente',
  })
  create(@Body() dto: CreateDepartamentoDto, @Req() req: any) {
    return this.departamentoService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar departamentos con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.departamentoService.findAll(pagination)
    return this.successListRows(result)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los departamentos (sin paginación)' })
  findAllGeneral() {
    return this.departamentoService.findAllGeneral()
  }

  @Get('all/pais')
  @ApiOperation({ summary: 'Listado simple de departamentos (para combos)' })
  @ApiQuery({ name: 'idPais', required: false })
  findAllSimple(@Query('idPais') idPais?: number) {
    return this.departamentoService.findAllPais(
      idPais ? Number(idPais) : undefined
    )
  }

  @Get('allExtension')
  @ApiOperation({ summary: 'Listar todos los siglas (sin paginación)' })
  findAllExtension() {
    return this.departamentoService.findAllExtension()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  findOne(@Param('id') id: number) {
    return this.departamentoService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un departamento' })
  update(@Param('id') id: number, @Body() dto: UpdateDepartamentoDto) {
    return this.departamentoService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un departamento (borrado lógico)' })
  remove(@Param('id') id: number) {
    return this.departamentoService.remove(id)
  }
}
