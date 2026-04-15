import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { LocalidadService } from './localidad.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SOSPECHOSO - Localidad')
@Controller('localidad')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Get('provincia/:id')
  @ApiOperation({ summary: 'Localidades por provincia' })
  findByProvincia(@Param('id') id: number) {
    return this.localidadService.findByProvincia(+id)
  }
}
