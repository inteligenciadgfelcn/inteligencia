import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { DB_ASIG_CASOS, DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgi } from '../entities/asignacion_lgi.entity'
import { CreateAsignacionLgiDto } from '../dto/create-asignacion_lgi.dto'
import { AsignacionASIG } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/entities/asignacionAsig.entity'

@Injectable()
export class AsignacionLgiRepository {
  constructor(
    @InjectRepository(AsignacionLgi, DB_LGI)
    private readonly repository: Repository<AsignacionLgi>,

    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionCasoRepository: Repository<AsignacionASIG>
  ) {}

  async crearAsignacionDual(
    dto: CreateAsignacionLgiDto,
    uniAbrev: string,
    descripcionGrupo: string
  ): Promise<AsignacionLgi> {
    const { disId, idGrupo, controlJurisdiccional, ...datos } = dto

    const asignacionLgi = this.repository.create({
      ...datos,
      disId,
      uniAbrev,
      descripcionGrupo,
    })

    const asignacionGuardada = await this.repository.save(asignacionLgi)

    if (!asignacionGuardada.casosId) {
      throw new BadRequestException(
        'No se pudo obtener el identificador del caso LGI'
      )
    }

    try {
      const asignacionCaso = this.asignacionCasoRepository.create({
        idCasoSiii: asignacionGuardada.casosId,

        nombreCaso: asignacionGuardada.nombreCaso,

        nombreSolicitud: asignacionGuardada.conformeA,

        fechaOperativo: asignacionGuardada.fechaInicio,

        fiscalAsignado: asignacionGuardada.remiteFiscal,

        usuario: asignacionGuardada.usuario,

        idDepartamento: asignacionGuardada.dptoavId,

        nroOperativo: asignacionGuardada.nroCaso,

        nroCaso: asignacionGuardada.nroCaso,
      })

      await this.asignacionCasoRepository.save(asignacionCaso)
    } catch {
      await this.repository.remove(asignacionGuardada)

      throw new BadRequestException(
        'No se pudo registrar la asignación del caso LGI'
      )
    }

    return asignacionGuardada
  }

  async findAllPaginado(
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('a')
      .leftJoin(
        `(SELECT * FROM parametricas.distritales
      )`,
        'd',
        'a.dis_id = d.dis_id'
      )
      .leftJoin(
        `(
        SELECT *
        FROM parametricas.etapainvest
      )`,
        'e',
        'a.eta_inv = e.eta_inv'
      )
      .leftJoin(
        `(
        SELECT *
        FROM parametricas.unidades
      )`,
        'u',
        'a.uni_abrev = u.uni_abrev'
      )
      .where('a.estado = :estado', { estado: 'ACTIVO' })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('a.nombrecaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasogiaef ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasofis ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasoifp ILIKE :filtro', { filtro: valor })
            .orWhere('a.cudifp ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const total = await query.clone().getCount()

    const data = await query
      .select([
        'a.*',
        'e.descripcion AS "etapaInvestigacion"',
        'u.uni_descripcion AS "unidad"',
        'd.dis_descripcion AS "regional"',
        'a.descripcion_grupo AS "puesto"',
      ])
      .orderBy('a.casos_id', 'DESC')
      .take(limite)
      .skip(saltar)
      .getRawMany()

    return [data, total]
  }

  async findOneById(id: number): Promise<AsignacionLgi | null> {
    return await this.repository.findOne({
      where: {
        casosId: id,
        estado: 'ACTIVO',
      },
    })
  }

  async update(asignacion: AsignacionLgi): Promise<AsignacionLgi> {
    return this.repository.save(asignacion)
  }

  async inactivar(id: number): Promise<AsignacionLgi | null> {
    const asignacion = await this.findOneById(id)

    if (!asignacion) {
      return null
    }

    asignacion.estado = 'INACTIVO'

    return this.repository.save(asignacion)
  }
}
