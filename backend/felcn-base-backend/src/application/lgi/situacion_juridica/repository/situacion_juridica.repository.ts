import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateSituacionJuridicaDto } from '../dto/create-situacion_juridica.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_LGI } from '@/core/config/database/database.module';
import { SituacionJuridica } from '../entities/situacion_juridica.entity';
import { UpdateSituacionJuridicaDto } from '../dto/update-situacion_juridica.dto';
import { DeleteSituacionJuridicaDto } from '../dto/delete-situacion_juridica.dto';

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
  async findAll(): Promise<SituacionJuridica[]> {
    return this.situacionRepository.find({
      order: {
        situacionId: 'DESC',
      },
    });
  }

  async findOne(
    situacionId: number,
  ): Promise<SituacionJuridica | null> {
    return this.situacionRepository.findOne({
      where: {
        situacionId,
      },
    });
  }

  async update(
    situacionId: number,
    dto: UpdateSituacionJuridicaDto,
  ): Promise<SituacionJuridica | null> {
    const situacion = await this.findOne(situacionId);

    if (!situacion) {
      return null;
    }

    const cambios = {
      ...dto,
    };

    if (dto.fecha !== undefined) {
      Object.assign(cambios, {
        fecha: new Date(dto.fecha),
      });
    }

    // Conserva usuarioActualizacion y fechaHoraActualizacion
    Object.assign(situacion, cambios);

    return this.situacionRepository.save(situacion);
  }

  async remove(
  situacionId: number,
  dto: DeleteSituacionJuridicaDto,
): Promise<SituacionJuridica | null> {
  const situacion = await this.situacionRepository.findOne({
    where: {
      situacionId,
      estado: true,
    },
  });

  if (!situacion) {
    return null;
  }

  situacion.estado = false;

  Object.assign(situacion, dto);

  return this.situacionRepository.save(situacion);
}
}