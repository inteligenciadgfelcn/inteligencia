import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Asignacion } from '../entity/asignacion.entity'
import { FiltrosAsignacionDto } from '../dto'
import { DB_ASIG_CASOS } from '../../../shared/constants'

/**
 * Repositorio para acceso a datos de asignaciones
 * Base de datos: felcn_asignacion_caso
 * Tabla: asignacion
 */
@Injectable()
export class AsignacionRepository {
  constructor(
    @InjectDataSource(DB_ASIG_CASOS)
    private dataSource: DataSource
  ) {}

  private get repository() {
    return this.dataSource.getRepository(Asignacion)
  }

  private crearQueryBase(): SelectQueryBuilder<Asignacion> {
    return this.repository
      .createQueryBuilder('asignacion')
      .leftJoinAndSelect('asignacion.departamento', 'departamento')
      .leftJoinAndSelect('asignacion.unidad', 'unidad')
      .leftJoinAndSelect('asignacion.letra', 'letra')
  }

  async crear(asignacion: Asignacion): Promise<Asignacion> {
    return this.repository.save(asignacion)
  }

  async listar(filtros: FiltrosAsignacionDto): Promise<[Asignacion[], number]> {
    const query = this.crearQueryBase()

    if (filtros.numeroCaso) {
      query.andWhere('asignacion.numeroCaso ILIKE :numeroCaso', {
        numeroCaso: `%${filtros.numeroCaso}%`,
      })
    }

    if (filtros.numeroOperativo) {
      query.andWhere('asignacion.numeroOperativo ILIKE :numeroOperativo', {
        numeroOperativo: `%${filtros.numeroOperativo}%`,
      })
    }

    if (filtros.usuarioLogin) {
      query.andWhere('asignacion.usuarioLogin = :usuarioLogin', {
        usuarioLogin: filtros.usuarioLogin,
      })
    }

    if (filtros.idDepartamento) {
      query.andWhere('asignacion.idDepartamento = :idDepartamento', {
        idDepartamento: filtros.idDepartamento,
      })
    }

    if (filtros.idUnidad) {
      query.andWhere('asignacion.idUnidad = :idUnidad', {
        idUnidad: filtros.idUnidad,
      })
    }

    // Filtro para casos no aprobados (numero_caso vacío)
    if (filtros.soloNoAprobados) {
      query.andWhere("TRIM(asignacion.numeroCaso) = ''")
    }

    query.orderBy('asignacion.fechaHoraRegistro', 'DESC')

    if (filtros.limite && filtros.pagina) {
      query.skip((filtros.pagina - 1) * filtros.limite)
      query.take(filtros.limite)
    }

    return query.getManyAndCount()
  }

  async buscarPorId(idAsignacion: string): Promise<Asignacion | null> {
    return this.crearQueryBase()
      .where('asignacion.idAsignacion = :idAsignacion', { idAsignacion })
      .getOne()
  }

  async buscarPorUsuarioLogin(usuarioLogin: string): Promise<Asignacion[]> {
    return this.crearQueryBase()
      .where('asignacion.usuarioLogin = :usuarioLogin', { usuarioLogin })
      .orderBy('asignacion.fechaHoraRegistro', 'DESC')
      .getMany()
  }

  /**
   * Buscar casos no aprobados por usuario
   * Implementa: WHERE Usuario = ? AND RTRIM(NroCaso) = ''
   * Corresponde a muestranoaprob() del FRM-OP-ING.aspx.cs
   */
  async buscarNoAprobadosPorUsuario(
    usuarioLogin: string
  ): Promise<Asignacion[]> {
    return this.crearQueryBase()
      .where('asignacion.usuarioLogin = :usuarioLogin', { usuarioLogin })
      .andWhere("TRIM(asignacion.numeroCaso) = ''")
      .orderBy('asignacion.fechaHoraRegistro', 'DESC')
      .getMany()
  }

  async buscarPorNumeroCaso(numeroCaso: string): Promise<Asignacion | null> {
    return this.crearQueryBase()
      .where('asignacion.numeroCaso = :numeroCaso', { numeroCaso })
      .getOne()
  }

  async buscarPorNumeroOperativo(
    numeroOperativo: string
  ): Promise<Asignacion | null> {
    return this.crearQueryBase()
      .where('asignacion.numeroOperativo = :numeroOperativo', {
        numeroOperativo,
      })
      .getOne()
  }

  async actualizar(asignacion: Asignacion): Promise<Asignacion> {
    return this.repository.save(asignacion)
  }

  async eliminar(idAsignacion: string): Promise<void> {
    await this.repository.delete(idAsignacion)
  }
}
