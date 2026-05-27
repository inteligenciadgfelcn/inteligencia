import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { VehiculoService } from '../service/vehiculo.service'
import { CreateVehiculoDto } from '../dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Vehículos S2I')
@Controller('s2i')
export class VehiculoController extends BaseController {
  constructor(private readonly service: VehiculoService) {
    super()
  }

  @ApiOperation({ summary: 'Registrar vehículo vinculado a un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Post('casos/:idCaso/vehiculos')
  async crearVehiculo(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateVehiculoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    return this.successCreate(await this.service.crearVehiculo(idCaso, dto, numeroPase))
  }

  @ApiOperation({ summary: 'Listar vehículos registrados en un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get('casos/:idCaso/vehiculos')
  async listarVehiculos(@Param('idCaso') idCaso: string) {
    return this.successList(await this.service.listarVehiculosPorCaso(idCaso))
  }

  @ApiOperation({ summary: 'Obtener vehículo por ID' })
  @ApiParam({ name: 'idVehiculo', description: 'ID del vehículo (bigint)' })
  @Get('vehiculos/:idVehiculo')
  async buscarVehiculo(@Param('idVehiculo') idVehiculo: string) {
    return this.successList(await this.service.buscarVehiculoPorId(idVehiculo))
  }

  @ApiOperation({ summary: 'Eliminar vehículo por ID' })
  @ApiParam({ name: 'idVehiculo', description: 'ID del vehículo (bigint)' })
  @Delete('vehiculos/:idVehiculo')
  async eliminarVehiculo(@Param('idVehiculo') idVehiculo: string) {
    await this.service.eliminarVehiculo(idVehiculo)
    return this.successDelete()
  }
}
