import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, SelectQueryBuilder } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto'
import { DB_S2I } from '../../../shared/constants'
import { S2iFlujoTransporte } from '../entity/flujo-transporte.entity'
import { S2iConductor } from '../../conductor/entity/conductor.entity'
import { S2iTransporte } from '../../transporte/entity/transporte.entity'
import { S2iLugar } from '../../lugar/entity/lugar.entity'
import { S2iColor } from '../../parametrica/entity/color.entity'

export interface FiltroFlujoTransporte {
  documento?: string
  placa?: string
  /** Fecha ISO (YYYY-MM-DD), límite inferior inclusivo sobre fecha_hora */
  fechaDesde?: string
  /** Fecha ISO (YYYY-MM-DD), límite superior inclusivo sobre fecha_hora */
  fechaHasta?: string
  idColor?: number
}

export interface FlujoTransporteReporteRow {
  idFlujoTransporte: string
  codigoTransporte: string
  numeroDocumento: string
  conductorNombreCompleto: string | null
  transporteMarca: string | null
  transporteModelo: string | null
  lugarDescripcion: string | null
  origen: string
  destino: string
  carga: string
  fechaHora: string
  idColor: number
  colorNombre: string | null
  colorDescripcion: string | null
  colorHex: string | null
  latitud: number
  longitud: number
}

@Injectable()
export class FlujoTransporteRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  async crear(flujo: S2iFlujoTransporte): Promise<S2iFlujoTransporte> {
    return this.dataSource.getRepository(S2iFlujoTransporte).save(flujo)
  }

  /**
   * Query base de flujo_transporte para el reporte, con conductor, transporte,
   * lugar y color resueltos por left join. Filtrable por documento, placa,
   * rango de fechas sobre fecha_hora y/o color. Sin orden ni paginación:
   * cada método público decide cómo ordenar/limitar antes de ejecutarla.
   */
  private construirQuery(
    filtro: FiltroFlujoTransporte
  ): SelectQueryBuilder<S2iFlujoTransporte> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select('ft.idFlujoTransporte', 'idFlujoTransporte')
      .addSelect('ft.codigoTransporte', 'codigoTransporte')
      .addSelect('ft.numeroDocumento', 'numeroDocumento')
      .addSelect('ft.origen', 'origen')
      .addSelect('ft.destino', 'destino')
      .addSelect('ft.carga', 'carga')
      .addSelect('ft.fechaHora', 'fechaHora')
      .addSelect('ft.latitud', 'latitud')
      .addSelect('ft.longitud', 'longitud')
      .addSelect('ft.idColor', 'idColor')
      .addSelect('col.color', 'colorNombre')
      .addSelect('col.descripcion', 'colorDescripcion')
      .addSelect('col.hexadecimal', 'colorHex')
      .addSelect('c.nombres', 'conductorNombres')
      .addSelect('c.paterno', 'conductorPaterno')
      .addSelect('c.materno', 'conductorMaterno')
      .addSelect('t.marca', 'transporteMarca')
      .addSelect('t.modelo', 'transporteModelo')
      .addSelect('l.descripcion', 'lugarDescripcion')
      .from(S2iFlujoTransporte, 'ft')
      .leftJoin(S2iColor, 'col', 'col.id = ft.idColor')
      .leftJoin(S2iConductor, 'c', 'c.numeroDocumento = ft.numeroDocumento')
      .leftJoin(S2iTransporte, 't', 't.codigoTransporte = ft.codigoTransporte')
      .leftJoin(S2iLugar, 'l', 'l.idLugar = ft.idLugar')

    if (filtro.documento)
      qb.andWhere('ft.numeroDocumento = :documento', {
        documento: filtro.documento,
      })
    if (filtro.placa)
      qb.andWhere('ft.codigoTransporte = :placa', { placa: filtro.placa })
    if (filtro.fechaDesde)
      qb.andWhere('ft.fechaHora >= :fechaDesde', {
        fechaDesde: `${filtro.fechaDesde} 00:00:00`,
      })
    if (filtro.fechaHasta)
      qb.andWhere('ft.fechaHora <= :fechaHasta', {
        fechaHasta: `${filtro.fechaHasta} 23:59:59`,
      })
    if (filtro.idColor)
      qb.andWhere('ft.idColor = :idColor', { idColor: filtro.idColor })

    return qb
  }

  private mapearFila(f: any): FlujoTransporteReporteRow {
    return {
      idFlujoTransporte: f.idFlujoTransporte,
      codigoTransporte: f.codigoTransporte,
      numeroDocumento: f.numeroDocumento,
      conductorNombreCompleto:
        [f.conductorNombres, f.conductorPaterno, f.conductorMaterno]
          .filter(Boolean)
          .join(' ') || null,
      transporteMarca: f.transporteMarca ?? null,
      transporteModelo: f.transporteModelo ?? null,
      lugarDescripcion: f.lugarDescripcion?.trim() || null,
      origen: f.origen,
      destino: f.destino,
      carga: f.carga,
      fechaHora: f.fechaHora,
      idColor: f.idColor,
      colorNombre: f.colorNombre ?? null,
      colorDescripcion: f.colorDescripcion ?? null,
      colorHex: f.colorHex ?? null,
      latitud: Number(f.latitud),
      longitud: Number(f.longitud),
    }
  }

  /**
   * Lista paginada (server-side) para la grilla del reporte, usada por los
   * tabs "Búsqueda" y por color. Devuelve también el total de filas que
   * cumplen el filtro (sin paginar) para calcular el número de páginas.
   */
  async listar(
    filtro: FiltroFlujoTransporte,
    paginacion: PaginacionQueryDto
  ): Promise<[FlujoTransporteReporteRow[], number]> {
    const qb = this.construirQuery(filtro)
    const total = await qb.clone().getCount()

    const filas = await qb
      .orderBy('ft.fechaHora', 'DESC')
      .skip(paginacion.saltar)
      .take(paginacion.limite)
      .getRawMany()

    return [filas.map((f) => this.mapearFila(f)), total]
  }

  /** Lista sin paginar, usada para la exportación a PDF. */
  async listarTodos(
    filtro: FiltroFlujoTransporte
  ): Promise<FlujoTransporteReporteRow[]> {
    const filas = await this.construirQuery(filtro)
      .orderBy('ft.fechaHora', 'DESC')
      .getRawMany()

    return filas.map((f) => this.mapearFila(f))
  }

  /** Últimos N registros ingresados, para el tab "Recientes" con auto-refresh. */
  async listarRecientes(limite: number): Promise<FlujoTransporteReporteRow[]> {
    const filas = await this.construirQuery({})
      .orderBy('ft.fechaHora', 'DESC')
      .take(limite)
      .getRawMany()

    return filas.map((f) => this.mapearFila(f))
  }
}
