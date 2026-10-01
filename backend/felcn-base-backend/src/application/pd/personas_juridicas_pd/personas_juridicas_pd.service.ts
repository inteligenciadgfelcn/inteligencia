import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePersonasJuridicasPdDto } from './dto/create-personas_juridicas_pd.dto';
import { UpdatePersonasJuridicasPdDto } from './dto/update-personas_juridicas_pd.dto';
import { PaginacionQueryDto } from '@/common/dto';
import { PersonasJuridicasPdRepository } from './repository/personas_juridicas.repository';
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Injectable()
export class PersonasJuridicasPdService {
  constructor(private readonly repository: PersonasJuridicasPdRepository) { }
  
  create(
      dto: CreatePersonasJuridicasPdDto,
      imagen?: Express.Multer.File,
      documento?: Express.Multer.File
    ) {
      return this.repository.create(dto, imagen, documento)
    }
  
    findByOperativo(opId: number) {
      return this.repository.findByOperativo(opId)
    }
  
    findOne(empId: number) {
      return this.repository.findOne(empId)
    }
  
    update(
      empId: number,
      dto: UpdatePersonasJuridicasPdDto,
      imagen?: Express.Multer.File,
      documento?: Express.Multer.File
    ) {
      return this.repository.update(empId, dto, imagen, documento)
    }
  
    async remove(empId: number) {
      await this.repository.remove(empId)
  
      return {
        mensaje: 'Empresa eliminada correctamente',
      }
    }
  
   findAllPaginadoPorOperativo(
    opId: number,
    pagination: PaginacionQueryDto,
  ) {
    return this.repository
      .findAllPaginadoPorOperativo(
        opId,
        pagination,
      )
  }
  
  findAllPaginadoPorCaso(
    casosId: number,
    pagination: PaginacionQueryDto,
  ) {
    return this.repository
      .findAllPaginadoPorCaso(
        casosId,
        pagination,
      )
  }
}
