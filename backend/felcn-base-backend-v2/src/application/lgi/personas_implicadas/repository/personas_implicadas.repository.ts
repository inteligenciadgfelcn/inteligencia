import { Injectable } from '@nestjs/common'
import { Brackets, Repository } from 'typeorm'
import { PersonasImplicada } from '../entities/personas_implicada.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CreatePersonaImplicadaDto } from '../dto/create-personas_implicada.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class PersonasImplicadasLgiRepository {
  constructor(
    @InjectRepository(PersonasImplicada, DB_LGI)
    private readonly personasRepository: Repository<PersonasImplicada>
  ) {}
  async registrarPersona(
    dto: CreatePersonaImplicadaDto
  ): Promise<PersonasImplicada> {
    const persona = this.personasRepository.create({
      ...dto,

      casoId: dto.casoId,
      nombres: dto.nombres.trim(),
      paterno: dto.paterno?.trim() ?? '',
      materno: dto.materno?.trim() ?? '',
      esposo: dto.esposo?.trim() ?? '',
      paisId: dto.paisId,
      estadoCivilId: dto.estadoCivilId,
      profesionId: dto.profesionId,
      tipoDocumentoId: dto.tipoDocumentoId,
      numeroDocumento: dto.numeroDocumento.trim(),
    })

    return this.personasRepository.save(persona)
  }

  async findAll(
    casoId: number,
    pagination: PaginacionQueryDto
  ): Promise<[PersonasImplicada[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.personasRepository
      .createQueryBuilder('p')
      .where('p.caso_id = :casoId', {
        casoId,
      })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('p.de_nombres ILIKE :filtro', { filtro: valor })
            .orWhere('p.de_paterno ILIKE :filtro', { filtro: valor })
            .orWhere('p.de_materno ILIKE :filtro', { filtro: valor })
            .orWhere('p.de_esposo ILIKE :filtro', { filtro: valor })
            .orWhere('p.nro_docum ILIKE :filtro', { filtro: valor })
        })
      )
    }

    return query
      .orderBy('p.de_id', 'DESC')
      .take(limite)
      .skip(saltar)
      .getManyAndCount()
  }

  async findOne(
  deId: number,
): Promise<PersonasImplicada | null> {
  return this.personasRepository
    .createQueryBuilder('p')
    .leftJoinAndSelect(
      'p.situacionesJuridicas',
      's',
    )
    .leftJoinAndMapOne(
      's.tipoPersona',
      'tipopersona',
      'tp',
      'tp.tp_id = s.sl_id',
    )
    .where('p.de_id = :deId', {
      deId,
    })
    .orderBy('s.fecha', 'DESC')
    .addOrderBy('s.sit_id', 'DESC')
    .getOne();
}
}
