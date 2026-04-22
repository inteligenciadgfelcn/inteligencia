import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common'
import { OperativoService } from './operativo.service'
import { CreateOperativoDto } from './dto/create-operativo.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BuscarAntecedenteDto } from './dto/buscar-antecedente.dto'
import { PaginacionQueryDto } from '@/common/dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Operativo')
@Controller('operativo')
export class OperativoController extends BaseController {
  constructor(private readonly operativoService: OperativoService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Creación de operativo caso x',
  })
  create(@Body() createOperativoDto: CreateOperativoDto) {
    return this.operativoService.create(createOperativoDto)
  }

   @Get()
    @ApiOperation({ summary: 'Listar casos x registrados con paginación' })
    async findAll(@Query() pagination: PaginacionQueryDto) {
      const result = await this.operativoService.findAllPaginado(pagination)
      return this.successListRows(result)
    }

  @Get('antecedentes')
  @ApiOperation({
    summary:
      'Buscar antedecentes de una persona por número de documento o nombre completo',
  })
  findAntecedente(@Query() query: BuscarAntecedenteDto) {
    return this.operativoService.verificarAntecedentes(query)
  }

  @Get('registro/:numero_caso_registro')
  @ApiOperation({
    summary:
      'Busqueda para casos x',
  })
  findOneRegistro(@Param('numero_caso_registro') numero_caso_registro: string) {
    return this.operativoService.findOneRegistro(numero_caso_registro)
  }

  @Get(':numero_caso')
  @ApiOperation({
    summary:
      'Buscar informacion simplificada del operativo por número de caso',
  })
  findOne(@Param('numero_caso') numero_caso: string) {
    return this.operativoService.findOne(numero_caso)
  }

}
