import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { DB_ASIG_CASOS, DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgi } from '../entities/asignacion_lgi.entity'
import { CreateAsignacionLgiDto } from '../dto/create-asignacion_lgi.dto'
import { AsignacionASIG } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/entities/asignacionAsig.entity'
import { GrupoLgiRepository } from '../../parametro/parametricas_lgi/repository/grupo.repository'
import { DistritalLgiRepository } from '../../parametro/parametricas_lgi/repository/distrito.repository'

@Injectable()
export class AsignacionLgiRepository {
  constructor(
    @InjectRepository(AsignacionLgi, DB_LGI)
    private readonly repository: Repository<AsignacionLgi>,
    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionCasoRepository: Repository<AsignacionASIG>,
    private readonly grupoLgiRepository: GrupoLgiRepository,
    private readonly distritalLgiRepository: DistritalLgiRepository
  ) { }

  async crearAsignacionDual(
    dto: CreateAsignacionLgiDto,
    uniAbrev: string
  ): Promise<AsignacionLgi> {
    const { disId, idGrupo, controlJurisdiccional, ...datos } = dto

    const asignacionLgi = this.repository.create({
      ...datos,
      nroCasoGiaef: dto.nroCaso,
      disId,
      uniAbrev,
      idGrupo: dto.idGrupo,
      controlJurisdiccional: dto.controlJurisdiccional,
    })

    const asignacionGuardada = await this.repository.save(asignacionLgi)

    if (!asignacionGuardada.casosId) {
      throw new BadRequestException(
        'No se pudo obtener el identificador del caso LGI'
      )
    }

    try {
      const asignacionCaso = this.asignacionCasoRepository.create({
        nombreCaso: asignacionGuardada.nombreCaso,
        nombreSolicitud: asignacionGuardada.conformeA,
        fechaOperativo: asignacionGuardada.fechaInicio,
        fiscalAsignado: asignacionGuardada.remiteFiscal,
        usuario: asignacionGuardada.usuario,
        idDepartamento: asignacionGuardada.dptoavId,
        nroOperativo: asignacionGuardada.nroCaso,
        nroCaso: asignacionGuardada.nroCaso,
        codigoServicio: asignacionGuardada.codigoServicio,
        idUnidad: uniAbrev,
      })

      await this.asignacionCasoRepository.save(asignacionCaso)
    } catch (error) {
      console.error('Error real al guardar AsignacionCaso:', error)
      await this.repository.remove(asignacionGuardada)

      throw new BadRequestException(
        error instanceof Error
          ? `No se pudo registrar AsignacionCaso: ${error.message}`
          : 'No se pudo registrar AsignacionCaso'
      )
    }

    return asignacionGuardada
  }

  async findAllPaginadoInvestigado(
    pagination: PaginacionQueryDto,
    numeroPase: string
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('a')
      .where('a.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('a.usuario = :numeroPase', {
        numeroPase: numeroPase.trim(),
      })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('a.nombrecaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasogiaef ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasofis ILIKE :filtro', { filtro: valor })
            .orWhere('a.cudifp ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const total = await query.clone().getCount()

    const filas = await query
      .leftJoin(
        '(SELECT * FROM parametricas.etapainvest)',
        'e',
        'a.eta_inv = e.eta_inv'
      )
      .select([
        'a.*',
        'e.descripcion AS "etapaInvestigacion"',
      ])
      .orderBy('a.casos_id', 'DESC')
      .limit(limite)
      .offset(saltar)
      .getRawMany()

    const distritosIds = [
      ...new Set(
        filas
          .filter((fila) => fila.dis_id != null)
          .map((fila) => Number(fila.dis_id))
      ),
    ]

    const gruposIds = [
      ...new Set(
        filas
          .filter((fila) => fila.id_grupo != null)
          .map((fila) => Number(fila.id_grupo))
      ),
    ]

    // Consultar cada ID una sola vez por página en DB_AUTH.
    const [distritos, grupos] = await Promise.all([
      Promise.all(
        distritosIds.map(async (id) => ({
          id,
          datos: await this.distritalLgiRepository.findOne(id),
        }))
      ),

      Promise.all(
        gruposIds.map(async (id) => ({
          id,
          datos: await this.grupoLgiRepository.findOne(id),
        }))
      ),
    ])

    const distritosMap = new Map(
      distritos.map(({ id, datos }) => [id, datos])
    )

    const gruposMap = new Map(
      grupos.map(({ id, datos }) => [id, datos])
    )

    const data = filas.map((fila) => {
      const distrito = fila.dis_id != null
        ? distritosMap.get(Number(fila.dis_id))
        : null

      const grupo = fila.id_grupo != null
        ? gruposMap.get(Number(fila.id_grupo))
        : null

      return {
        ...fila,
        unidad: distrito?.unidad ?? null,
        regional: distrito?.descripcion ?? null,
        puesto: grupo?.descripcion ?? null,
      }
    })

    return [data, total]
  }

  async findAllPaginado(
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('a')
      .where('a.estado = :estado', { estado: 'ACTIVO' })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('a.nombrecaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocaso ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasogiaef ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasoperdom ILIKE :filtro', { filtro: valor })
            .orWhere('a.nrocasofis ILIKE :filtro', { filtro: valor })
            .orWhere('a.cudifp ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const total = await query.clone().getCount()

    const filas = await query
      .leftJoin(
        '(SELECT * FROM parametricas.etapainvest)',
        'e',
        'a.eta_inv = e.eta_inv'
      )
      .select([
        'a.*',
        'e.descripcion AS "etapaInvestigacion"',
      ])
      .orderBy('a.casos_id', 'DESC')
      .limit(limite)
      .offset(saltar)
      .getRawMany()

    const distritosIds = [
      ...new Set(
        filas
          .filter((fila) => fila.dis_id != null)
          .map((fila) => Number(fila.dis_id))
      ),
    ]

    const gruposIds = [
      ...new Set(
        filas
          .filter((fila) => fila.id_grupo != null)
          .map((fila) => Number(fila.id_grupo))
      ),
    ]

    const [distritos, grupos] = await Promise.all([
      Promise.all(
        distritosIds.map(async (id) => ({
          id,
          datos: await this.distritalLgiRepository.findOne(id),
        }))
      ),

      Promise.all(
        gruposIds.map(async (id) => ({
          id,
          datos: await this.grupoLgiRepository.findOne(id),
        }))
      ),
    ])

    const distritosMap = new Map(
      distritos.map(({ id, datos }) => [id, datos])
    )

    const gruposMap = new Map(
      grupos.map(({ id, datos }) => [id, datos])
    )

    const data = filas.map((fila) => {
      const distrito = fila.dis_id != null
        ? distritosMap.get(Number(fila.dis_id))
        : null

      const grupo = fila.id_grupo != null
        ? gruposMap.get(Number(fila.id_grupo))
        : null

      return {
        ...fila,
        unidad: distrito?.unidad ?? null,
        regional: distrito?.descripcion ?? null,
        puesto: grupo?.descripcion ?? null,
      }
    })

    return [data, total]
  }

  async findOneById(id: number): Promise<
    | (AsignacionLgi & {
      regional: string | null
      unidad: string | null
      idUnidad: number | null
      puesto: string | null
    })
    | null
  > {
    const asignacion = await this.repository.findOne({
      where: {
        casosId: id,
        estado: 'ACTIVO',
      },
    })

    if (!asignacion) {
      return null
    }

    const [distrital, grupo] = await Promise.all([
      asignacion.disId != null
        ? this.distritalLgiRepository.findOne(Number(asignacion.disId))
        : Promise.resolve(null),

      asignacion.idGrupo != null
        ? this.grupoLgiRepository.findOne(Number(asignacion.idGrupo))
        : Promise.resolve(null),
    ])

    return Object.assign(asignacion, {
      regional: distrital?.descripcion ?? null,
      unidad: distrital?.unidad ?? null,
      idUnidad: distrital?.idUnidad ?? null,
      puesto: grupo?.descripcion ?? null,
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
