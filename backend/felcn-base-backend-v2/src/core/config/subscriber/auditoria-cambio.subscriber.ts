import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  QueryRunner,
  RemoveEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
  UpdateEvent,
} from 'typeorm'
import {
  DB_AUTH,
  DB_S2I,
  DB_SIII,
} from '@/core/config/database/database.module'
import { auditoriaContexto } from '@/common/context/auditoria-contexto'
import dotenv from 'dotenv'

dotenv.config()

const TABLAS_EXCLUIDAS = new Set([
  'bitacora_login',
  'auditoria_cambio',
  'refresh_token',
  'session',
  'casbin_rule',
  'migrations',
])

interface EntradaPendiente {
  db: string
  schema: string | null
  tableName: string
  accion: string
  anterior: object | null
  actual: object | null
  idRegistro: string | null
  usuario: string | null
  idUsuario: number | null
  idOperacion: string | null
}

@Injectable()
@EventSubscriber()
export class AuditoriaCambioSubscriber implements EntitySubscriberInterface {
  // Keyed por queryRunner para aislar transacciones concurrentes
  private readonly buffer = new WeakMap<QueryRunner, EntradaPendiente[]>()

  constructor(
    @InjectDataSource(DB_AUTH) private readonly dsAuth: DataSource,
    @InjectDataSource(DB_SIII) private readonly dsSiii: DataSource,
    @InjectDataSource(DB_S2I) private readonly dsS2i: DataSource,
  ) {
    dsAuth.subscribers.push(this)
    dsSiii.subscribers.push(this)
    dsS2i.subscribers.push(this)
  }

  private leerIdOperacion(): string | null {
    return auditoriaContexto.getStore()?.idOperacion ?? null
  }

  private extraerUsuario(entity: any): { nombre: string | null; idNumerico: number | null } {
    const nombreVarchar = entity?._usuario_creacion
    if (nombreVarchar && typeof nombreVarchar === 'string' && isNaN(Number(nombreVarchar))) {
      return { nombre: nombreVarchar, idNumerico: null }
    }
    const idStr = entity?.usuarioCreacion?.toString() ?? entity?._usuario_creacion?.toString() ?? null
    const idNum = idStr ? Number(idStr) || null : null
    return { nombre: idStr, idNumerico: idNum }
  }

  private encolar(queryRunner: QueryRunner, entrada: EntradaPendiente): void {
    if (!this.buffer.has(queryRunner)) this.buffer.set(queryRunner, [])
    this.buffer.get(queryRunner)!.push(entrada)
  }

  // Escribe entradas pendientes a dsAuth DESPUÉS de que la transacción fuente hizo commit.
  // Esto garantiza que siii/s2i rollbacks no generen registros fantasma en la auditoría.
  async afterTransactionCommit(event: TransactionCommitEvent): Promise<void> {
    const entradas = this.buffer.get(event.queryRunner) ?? []
    this.buffer.delete(event.queryRunner)
    if (entradas.length === 0) return

    const schemaAudit = process.env.DB_SCHEMA_USUARIO ?? 'usuario'
    for (const e of entradas) {
      try {
        await this.dsAuth.manager.query(
          `INSERT INTO ${schemaAudit}.auditoria_cambio
             (base_datos, schema_afectado, tabla_afectada, accion,
              contenido_anterior, contenido_actual, id_registro, usuario, id_usuario, id_operacion, fecha_hora)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [
            e.db, e.schema, e.tableName, e.accion,
            e.anterior ? JSON.stringify(e.anterior) : null,
            e.actual ? JSON.stringify(e.actual) : null,
            e.idRegistro, e.usuario, e.idUsuario, e.idOperacion,
          ],
        )
      } catch (_) {}
    }
  }

  async afterTransactionRollback(event: TransactionRollbackEvent): Promise<void> {
    // Descartar entradas — la operación falló, no debe quedar registro
    this.buffer.delete(event.queryRunner)
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const entity = event.entity ?? {}
      const { nombre, idNumerico } = this.extraerUsuario(entity)
      this.encolar(event.queryRunner, {
        db: (event.connection.options as any).database ?? 'desconocida',
        schema: event.metadata.schema ?? null,
        tableName: event.metadata.tableName,
        accion: 'INSERT',
        anterior: null,
        actual: entity,
        idRegistro: entity.id?.toString() ?? null,
        usuario: nombre,
        idUsuario: idNumerico,
        idOperacion: this.leerIdOperacion(),
      })
    } catch (_) {}
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const antes = event.databaseEntity ?? null
      const despues = event.entity ?? {}
      const idRegistro =
        (despues as any).id?.toString() ?? (antes as any)?.id?.toString() ?? null

      const entidadUsuario = {
        usuarioCreacion: (despues as any).usuarioModificacion ?? (despues as any).usuarioCreacion,
        _usuario_creacion: (despues as any)._usuario_modificacion ?? (despues as any)._usuario_creacion,
      }
      const { nombre, idNumerico } = this.extraerUsuario(entidadUsuario)

      this.encolar(event.queryRunner, {
        db: (event.connection.options as any).database ?? 'desconocida',
        schema: event.metadata.schema ?? null,
        tableName: event.metadata.tableName,
        accion: 'UPDATE',
        anterior: antes,
        actual: despues,
        idRegistro,
        usuario: nombre,
        idUsuario: idNumerico,
        idOperacion: this.leerIdOperacion(),
      })
    } catch (_) {}
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const entity = event.entity ?? event.databaseEntity ?? {}
      const idRegistro =
        event.entityId?.toString() ?? (entity as any).id?.toString() ?? null
      const entidadUsuario = {
        usuarioCreacion: (entity as any).usuarioModificacion ?? (entity as any).usuarioCreacion,
        _usuario_creacion: (entity as any)._usuario_modificacion ?? (entity as any)._usuario_creacion,
      }
      const { nombre, idNumerico } = this.extraerUsuario(entidadUsuario)

      this.encolar(event.queryRunner, {
        db: (event.connection.options as any).database ?? 'desconocida',
        schema: event.metadata.schema ?? null,
        tableName: event.metadata.tableName,
        accion: 'DELETE',
        anterior: entity,
        actual: null,
        idRegistro,
        usuario: nombre,
        idUsuario: idNumerico,
        idOperacion: this.leerIdOperacion(),
      })
    } catch (_) {}
  }
}
