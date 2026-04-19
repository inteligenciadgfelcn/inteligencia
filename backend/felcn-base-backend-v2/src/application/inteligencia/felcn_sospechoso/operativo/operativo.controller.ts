import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OperativoService } from './operativo.service';
import { CreateOperativoDto } from './dto/create-operativo.dto';
import { UpdateOperativoDto } from './dto/update-operativo.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@/common/base';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Operativo')
@Controller('operativo')
export class OperativoController extends BaseController{
  constructor(private readonly operativoService: OperativoService) {
    super()
  }

  @Post()
  @ApiOperation({
      summary: 'Creación de operativo caso x',
    })
  create(@Body() createOperativoDto: CreateOperativoDto) {
    return this.operativoService.create(createOperativoDto);
  }

  @Get()
  findAll() {
    return this.operativoService.findAll();
  }

  @Get(':numero_caso')
   @ApiOperation({
      summary: 'Información de un operativo por número de caso',
    })
  findOne(@Param('numero_caso') numero_caso: string) {
    return this.operativoService.findOne(numero_caso);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOperativoDto: UpdateOperativoDto) {
    return this.operativoService.update(+id, updateOperativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operativoService.remove(+id);
  }
}
