import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateSituacionJuridicaDto } from '../dto/create-situacion_juridica.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_LGI } from '@/core/config/database/database.module';
import { SituacionJuridica } from '../entities/situacion_juridica.entity';

@Injectable()
export class SituacionJuridicaRepository {
  constructor(
    @InjectRepository(SituacionJuridica, DB_LGI)
    private readonly situacionRepository:
      Repository<SituacionJuridica>,
  ) {}

  async registrarSituacionJuridica(
    dto: CreateSituacionJuridicaDto,
  ): Promise<SituacionJuridica> {
    const situacion = this.situacionRepository.create({
      ...dto,
      detenidoId: dto.detenidoId,
      situacionLegalId: dto.situacionLegalId,
      fecha: new Date(dto.fecha),
    });

    return this.situacionRepository.save(situacion);
  }
}