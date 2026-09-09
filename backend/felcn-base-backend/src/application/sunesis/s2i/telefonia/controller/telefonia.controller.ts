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
import { TelefoniaService } from '../service/telefonia.service'
import { CreateTelefonoDto } from '../dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Telefonía S2I')
@Controller('s2i')
export class TelefoniaController extends BaseController {
  constructor(private readonly service: TelefoniaService) {
    super()
  }

  // ==================== TELÉFONOS ====================

  @ApiOperation({ summary: 'Registrar número telefónico de un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Post('casos/:idCaso/telefonos')
  async crearTelefono(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateTelefonoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    return this.successCreate(await this.service.crearTelefono(idCaso, dto, numeroPase))
  }

  @ApiOperation({ summary: 'Listar teléfonos registrados en un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get('casos/:idCaso/telefonos')
  async listarTelefonos(@Param('idCaso') idCaso: string) {
    return this.successList(await this.service.listarTelefonosPorCaso(idCaso))
  }

  @ApiOperation({ summary: 'Obtener teléfono por ID' })
  @ApiParam({ name: 'idTelefono', description: 'ID del teléfono (bigint)' })
  @Get('telefonos/:idTelefono')
  async buscarTelefono(@Param('idTelefono') idTelefono: string) {
    return this.successList(await this.service.buscarTelefonoPorId(idTelefono))
  }

  @ApiOperation({ summary: 'Eliminar teléfono por ID' })
  @ApiParam({ name: 'idTelefono', description: 'ID del teléfono (bigint)' })
  @Delete('telefonos/:idTelefono')
  async eliminarTelefono(@Param('idTelefono') idTelefono: string) {
    await this.service.eliminarTelefono(idTelefono)
    return this.successDelete()
  }
}
