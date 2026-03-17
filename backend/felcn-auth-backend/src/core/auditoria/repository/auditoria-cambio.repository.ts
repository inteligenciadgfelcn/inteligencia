import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { AuditoriaCambio } from '../entity/auditoria-cambio.entity'
import { AccionAuditoria } from '../constant'

export interface RegistrarCambioParams {
  baseDatos: string
  schemaAfectado?: string | null
  tablaAfectada: string
  accion: AccionAuditoria
  contenidoAnterior?: Record<string, unknown> | null
  contenidoActual?: Record<string, unknown> | null
  idRegistro?: string | null
  usuario?: string | null
  idUsuario?: string | null
}

@Injectable()
export class AuditoriaCambioRepository {
  constructor(private dataSource: DataSource) {}

  async registrar(params: RegistrarCambioParams) {
    const auditoria = new AuditoriaCambio()
    auditoria.baseDatos = params.baseDatos
    auditoria.schemaAfectado = params.schemaAfectado ?? null
    auditoria.tablaAfectada = params.tablaAfectada
    auditoria.accion = params.accion
    auditoria.contenidoAnterior = params.contenidoAnterior ?? null
    auditoria.contenidoActual = params.contenidoActual ?? null
    auditoria.idRegistro = params.idRegistro ?? null
    auditoria.usuario = params.usuario ?? null
    auditoria.idUsuario = params.idUsuario ?? null

    return await this.dataSource.getRepository(AuditoriaCambio).save(auditoria)
  }

  async listar(tabla?: string, limite = 50, saltar = 0) {
    const query = this.dataSource
      .getRepository(AuditoriaCambio)
      .createQueryBuilder('auditoria')
      .orderBy('auditoria.fecha_hora', 'DESC')
      .take(limite)
      .skip(saltar)

    if (tabla) {
      query.where('auditoria.tabla_afectada = :tabla', { tabla })
    }

    return await query.getManyAndCount()
  }
}
