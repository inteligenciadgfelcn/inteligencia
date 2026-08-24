import { Controller, Get, Param, Query } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { OperativoService } from '@/application/sunesis/siii/operativo/service/operativo.service'
import { InformacionSiiiService } from './informacion_siii.service'

@Controller('informacion-siii')
export class InformacionSiiiController extends BaseController {
  constructor(
    private readonly operativoService: OperativoService,
    private readonly informacionSiiiService: InformacionSiiiService
  ) {
    super()
  }

  @Get('caso')
  @ApiOperation({
    summary: 'Obtener la asignación y el operativo por número de caso',
  })
  @ApiQuery({
    name: 'numeroCaso',
    required: true,
    description: 'Número del caso',
    example: 'LP-O-1/26',
  })
  async obtenerInformacionPorNumeroCaso(
    @Query('numeroCaso') numeroCaso: string
  ) {
    const resultado =
      await this.informacionSiiiService.obtenerInformacionPorNumeroCaso(
        numeroCaso
      )

    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Listar personas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({
    name: 'pagina',
    required: false,
    description: 'Página (default: 1)',
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    description: 'Registros por página (10-50, default: 10)',
  })
  @Get(':idOperativo/personas')
  async listarPersonasAuxiliares(
    @Param('idOperativo') idOperativo: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const resultado = await this.operativoService.listarPersonasAuxiliares(
      idOperativo,
      paginacion
    )
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Listar bienes secuestrados del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({
    name: 'pagina',
    required: false,
    description: 'Página (default: 1)',
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    description: 'Registros por página (10-50, default: 10)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista paginada. Campos planos: idCatalogoClase, idBien, descripcionCatalogoTipo, descripcionCatalogoClase, descripcionBien, urlFotoBien',
  })
  @Get(':idOperativo/bienes')
  async listarBienes(
    @Param('idOperativo') idOperativo: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const resultado = await this.operativoService.listarBienes(
      idOperativo,
      paginacion
    )
    return this.successPagedRows(resultado, paginacion)
  }
}
