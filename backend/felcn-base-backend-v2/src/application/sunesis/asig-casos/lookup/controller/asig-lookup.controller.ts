import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { AsigLookupService } from '../service/asig-lookup.service'

// TODO: Reactivar guards para producción

@ApiTags('Lookups ASIG-CASOS')
@Controller('asig-lookups')
export class AsigLookupController extends BaseController {
  constructor(private readonly lookupService: AsigLookupService) {
    super()
  }

  // Departamentos
  @ApiOperation({ summary: 'Listar departamentos' })
  @Get('departamentos')
  async listarDepartamentos() {
    const datos = await this.lookupService.listarDepartamentos()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @Get('departamentos/:id')
  async buscarDepartamentoPorId(@Param('id') id: string) {
    const dato = await this.lookupService.buscarDepartamentoPorId(id)
    return this.successList(dato)
  }

  // Unidades
  @ApiOperation({ summary: 'Listar unidades' })
  @Get('unidades')
  async listarUnidades() {
    const datos = await this.lookupService.listarUnidades()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener unidad por ID' })
  @Get('unidades/:id')
  async buscarUnidadPorId(@Param('id') id: string) {
    const dato = await this.lookupService.buscarUnidadPorId(id)
    return this.successList(dato)
  }

  // Letras
  @ApiOperation({ summary: 'Listar letras' })
  @Get('letras')
  async listarLetras() {
    const datos = await this.lookupService.listarLetras()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener letra por código' })
  @Get('letras/:codigo')
  async buscarLetraPorCodigo(@Param('codigo') codigo: string) {
    const dato = await this.lookupService.buscarLetraPorCodigo(codigo)
    return this.successList(dato)
  }

  // Usuario Unidad
  @ApiOperation({ summary: 'Listar unidades por usuario' })
  @Get('usuario-unidades/:usuarioLogin')
  async listarUnidadesPorUsuario(@Param('usuarioLogin') usuarioLogin: string) {
    const datos =
      await this.lookupService.listarUnidadesPorUsuario(usuarioLogin)
    return this.successList(datos)
  }

  // Usuario ICIA
  @ApiOperation({ summary: 'Obtener datos ICIA por usuario' })
  @Get('usuario-icia/:usuarioLogin')
  async buscarUsuarioIcia(@Param('usuarioLogin') usuarioLogin: string) {
    const dato = await this.lookupService.buscarUsuarioIcia(usuarioLogin)
    return this.successList(dato)
  }
}
