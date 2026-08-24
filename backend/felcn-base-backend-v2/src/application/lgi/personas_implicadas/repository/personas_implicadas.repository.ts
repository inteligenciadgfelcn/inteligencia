import { Injectable } from '@nestjs/common'
import { Brackets, Repository } from 'typeorm'
import { PersonasImplicada } from '../entities/personas_implicada.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CreatePersonaImplicadaDto } from '../dto/create-personas_implicada.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { UpdatePersonasImplicadaDto } from '../dto/update-personas_implicada.dto'
import { DeletePersonasImplicadaDto } from '../dto/delete-personas_implicadas.dto'
import { SituacionJuridica } from '../../situacion_juridica/entities/situacion_juridica.entity'

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
      .leftJoinAndMapOne(
        'p.ultimaSituacionJuridica',
        SituacionJuridica,
        's',
        `s.sit_id = (
          SELECT sj.sit_id
          FROM situacion sj
          WHERE sj.de_id = p.de_id
          ORDER BY
            sj.fechahoraing DESC NULLS LAST,
            sj.sit_id DESC
          LIMIT 1
        )`
      )
      .leftJoinAndMapOne(
        's.situacionLegal',
        'situacionlegal',
        'sl',
        'sl.sl_id = s.sl_id'
      )
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

    return (
      query
        // Aquí se usa la propiedad de la Entity
        .orderBy('p.deId', 'DESC')
        .take(limite)
        .skip(saltar)
        .getManyAndCount()
    )
  }

  async findOne(deId: number): Promise<PersonasImplicada | null> {
    return this.personasRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.situacionesJuridicas', 's')
      .leftJoinAndMapOne(
        's.tipoPersona',
        'tipopersona',
        'tp',
        'tp.tp_id = s.sl_id'
      )
      .where('p.de_id = :deId', {
        deId,
      })
      .orderBy('s.fecha', 'DESC')
      .addOrderBy('s.sit_id', 'DESC')
      .getOne()
  }

  async update(
    deId: number,
    dto: UpdatePersonasImplicadaDto
  ): Promise<PersonasImplicada | null> {
    const persona = await this.personasRepository.findOne({
      where: {
        deId,
      },
    })

    if (!persona) {
      return null
    }

    const cambios = {
      ...dto,
    }

    if (dto.nombres !== undefined) {
      cambios.nombres = dto.nombres.trim()
    }

    if (dto.paterno !== undefined) {
      cambios.paterno = dto.paterno.trim()
    }

    if (dto.materno !== undefined) {
      cambios.materno = dto.materno.trim()
    }

    if (dto.esposo !== undefined) {
      cambios.esposo = dto.esposo.trim()
    }

    if (dto.numeroDocumento !== undefined) {
      cambios.numeroDocumento = dto.numeroDocumento.trim()
    }
    Object.assign(persona, cambios)

    return this.personasRepository.save(persona)
  }

  async eliminarLogicamente(
    deId: number,
    dto: DeletePersonasImplicadaDto
  ): Promise<PersonasImplicada | null> {
    const persona = await this.personasRepository.findOne({
      where: {
        deId,
        estado: true,
      },
    })

    if (!persona) {
      return null
    }

    persona.estado = false
    Object.assign(persona, dto)

    return this.personasRepository.save(persona)
  }
}
