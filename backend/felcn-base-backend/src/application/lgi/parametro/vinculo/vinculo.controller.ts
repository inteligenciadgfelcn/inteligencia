import { AuditoriaUsuarioInterceptor } from "@/common/interceptors/auditoria-usuario.interceptor";
import { JwtAuthGuard } from "@/core/config/authorization/guards/jwt-auth.guard";
import { UseGuards, UseInterceptors, Controller, Post, Body, Get, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateVinculoDto } from "./dto/update-vinculo.dto";
import { CreateVinculoDto } from "./dto/create-vinculo.dto";
import { VinculoService } from "./vinculo.service";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Vinculo LGI')
@Controller('parametro/Vinculo')
@Controller('Vinculo')
export class VinculoController {
  constructor(private readonly vinculoService: VinculoService) {}

  @Post()
  create(@Body() createBieneDto: CreateVinculoDto) {
    return this.vinculoService.create(createBieneDto);
  }

  @Get()
  findAll() {
    return this.vinculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vinculoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBieneDto: UpdateVinculoDto) {
    return this.vinculoService.update(+id, updateBieneDto);
  }
}
