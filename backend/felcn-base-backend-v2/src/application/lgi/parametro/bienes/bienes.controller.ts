import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { BienesService } from './bienes.service';
import { CreateBienDto } from './dto/create-biene.dto';
import { UpdateBieneDto } from './dto/update-biene.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditoriaUsuarioInterceptor } from '../../../../common/interceptors/auditoria-usuario.interceptor';
import { JwtAuthGuard } from '../../../../core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Bienes LGI')
@Controller('parametro/bienes')
@Controller('bienes')
export class BienesController {
  constructor(private readonly bienesService: BienesService) {}

  @Post()
  create(@Body() createBieneDto: CreateBienDto) {
    return this.bienesService.create(createBieneDto);
  }

  @Get()
  findAll() {
    return this.bienesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bienesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBieneDto: UpdateBieneDto) {
    return this.bienesService.update(+id, updateBieneDto);
  }
}
