import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common'
import { EstadoSospechosoService } from './estadoSospechoso.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Estado')
@Controller('estado-sospechoso')
export class EstadoSospechosoController {
  constructor(private readonly estadoSospechosoService: EstadoSospechosoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar estados' })
  findAll() {
    return this.estadoSospechosoService.findAll()
  }
}
