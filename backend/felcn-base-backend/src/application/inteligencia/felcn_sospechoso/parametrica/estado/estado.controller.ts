import {
  Controller,
  Get,
  UseGuards
} from '@nestjs/common'
import { EstadoService } from './estado.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SOSPECHOSO - Estado')
@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar estados' })
  findAll() {
    return this.estadoService.findAll()
  }
}
