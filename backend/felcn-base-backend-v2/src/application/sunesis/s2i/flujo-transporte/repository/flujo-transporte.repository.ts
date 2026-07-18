import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
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
   * Lista los registros de flujo_transporte para el reporte, con conductor,
   * transporte, lugar y color resueltos por left join. Filtrable por documento,
   * placa y/o rango de fechas sobre fecha_hora.
   */
  async listar(filtro: FiltroFlujoTransporte): Promise<FlujoTransporteReporteRow[]> {
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
      .orderBy('ft.fechaHora', 'DESC')

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

    const filas = await qb.getRawMany()

    return filas.map((f) => ({
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
    }))
  }
}
