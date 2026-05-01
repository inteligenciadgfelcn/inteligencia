import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { GrupoSospechosoService } from './grupo-sospechoso.service'
import { GrupoSospechoso } from './entities/grupo-sospechoso.entity'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - grupos')
@Controller('grupo-sospechoso')
export class GrupoSospechosoController {
  constructor(
    private readonly grupoSospechosoService: GrupoSospechosoService
  ) {}

  @Get()
  async findAll(): Promise<GrupoSospechoso[]> {
    return await this.grupoSospechosoService.findAll()
  }

  @Get('distrital/:idDistrital')
  async findByDistrital(
    @Param('idDistrital', ParseIntPipe) idDistrital: number
  ): Promise<GrupoSospechoso[]> {
    return await this.grupoSospechosoService.findByDistrital(idDistrital)
  }
}
