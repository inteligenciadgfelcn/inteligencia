import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get('unidad/inteligencia')
  @ApiOperation({
    summary: 'Lista de usuarios de la unidad de inteligencia',
  })
  findByUnidadInteligencia() {
    return this.usuarioService.findByUnidadInteligencia()
  }

  @Get('grupo/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por grupo',
  })
  findByGrupo(@Param('id') id: number) {
    return this.usuarioService.findByGrupo(id)
  }

  @Get('distrito/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por distrito',
  })
  findByDistrito(@Param('id') id: number) {
    return this.usuarioService.findByDistrito(id)
  }

  @Get('unidad/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por unidad',
  })
  findByUnidad(@Param('id') id: number) {
    return this.usuarioService.findByUnidad(id)
  }

  @Get('unidades/:abreviatura')
  @ApiOperation({
    summary: 'Lista de usuarios activos por unidad',
  })
  findByUnidadAbreviatura(@Param('abreviatura') abreviatura: string) {
    return this.usuarioService.findByUnidadAbreviatura(abreviatura)
  }

  @Get('usuario/:usuario')
  @ApiOperation({
    summary: 'Obtener usuario por numero de pase',
  })
  @ApiParam({ name: 'usuario', example: 'G-SRG-0144' })
  findOne(@Param('usuario') usuario: string) {
    return this.usuarioService.findOne(usuario)
  }
}
