import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { LetraService } from './letra.service'
import { CreateLetraDto } from './dto/create-letra.dto'
import { UpdateLetraDto } from './dto/update-letra.dto'
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Letras')
@Controller('letra')
export class LetraController extends BaseController {
  constructor(private readonly letraService: LetraService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear letra' })
  @ApiResponse({ status: 201, description: 'Letra creada correctamente' })
  create(@Body() dto: CreateLetraDto, @Req() req: any) {
    return this.letraService.create(dto)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todas las letras activas' })
  findAllGeneral() {
    return this.letraService.findAllGeneral()
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar letra' })
  update(@Param('id') descripcion: string, @Body() dto: UpdateLetraDto) {
    return this.letraService.update(descripcion, dto)
  }
}
