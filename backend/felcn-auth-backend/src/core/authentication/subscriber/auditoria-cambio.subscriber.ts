import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'
import { auditoriaContexto } from '@/common/context/auditoria-contexto'
import dotenv from 'dotenv'

dotenv.config()

const CAMPOS_SENSIBLES = new Set([
  'contrasena',
  'codigoDesbloqueo',
  'codigoRecuperacion',
  'codigoTransaccion',
  'codigoActivacion',
])

const TABLAS_EXCLUIDAS = new Set([
  'bitacora_login',
  'auditoria_cambio',
  'refresh_token',
  'session',
  'casbin_rule',
  'migrations',
])

@Injectable()
@EventSubscriber()
export class AuditoriaCambioSubscriber implements EntitySubscriberInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  private filtrar(entity: any): any {
    if (!entity || typeof entity !== 'object') return entity
    const copia = { ...entity }
    for (const campo of CAMPOS_SENSIBLES) {
      if (campo in copia) copia[campo] = '***'
    }
    return copia
  }

  /**
   * Resuelve nombre de usuario en este orden de prioridad:
   * 1. app.usuario_nombre (variable de sesión PostgreSQL fijada por el interceptor)
   * 2. Lookup por ID numérico en usuario.usuario
   * 3. El propio valor como string (si no es numérico)
   */
  private async resolverNombreUsuario(
    manager: any,
    idUsuario: string | null,
  ): Promise<string | null> {
    // Intentar leer desde la sesión PostgreSQL (misma conexión del evento)
    try {
      const rows = await manager.query(
        `SELECT nullif(trim(current_setting('app.usuario_nombre', true)), '') AS nombre`,
      )
      const nombre = rows[0]?.nombre
      if (nombre) return nombre
    } catch (_) {}

    if (!idUsuario) return null
    const id = Number(idUsuario)
    if (isNaN(id)) return idUsuario // ya es un nombre

    try {
      const schema = process.env.DB_SCHEMA_USUARIO ?? 'usuario'
      const rows = await manager.query(
        `SELECT usuario FROM ${schema}.usuario WHERE id = $1 LIMIT 1`,
        [id],
      )
      return rows[0]?.usuario ?? idUsuario
    } catch {
      return idUsuario
    }
  }

  private leerIdOperacion(): string | null {
    return auditoriaContexto.getStore()?.idOperacion ?? null
  }

  private async insertar(
    manager: any,
    accion: string,
    tableName: string,
    schema: string,
    anterior: object | null,
    actual: object | null,
    idRegistro: string | null,
    nombreUsuario: string | null,
    idUsuarioNumerico: number | null,
  ): Promise<void> {
    const db = process.env.DB_DATABASE ?? 'felcn_auth'
    const schemaAudit = process.env.DB_SCHEMA_USUARIO ?? 'usuario'
    const idOperacion = this.leerIdOperacion()

    await manager.query(
      `INSERT INTO ${schemaAudit}.auditoria_cambio
         (base_datos, schema_afectado, tabla_afectada, accion,
          contenido_anterior, contenido_actual, id_registro, usuario, id_usuario, id_operacion, fecha_hora)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        db,
        schema || null,
        tableName,
        accion,
        anterior ? JSON.stringify(this.filtrar(anterior)) : null,
        actual ? JSON.stringify(this.filtrar(actual)) : null,
        idRegistro,
        nombreUsuario,
        idUsuarioNumerico,
        idOperacion,
      ],
    )
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const entity = event.entity ?? {}
      const idUsuario = entity.usuarioCreacion?.toString() ?? null
      const nombre = await this.resolverNombreUsuario(event.manager, idUsuario)
      await this.insertar(
        event.manager,
        'INSERT',
        event.metadata.tableName,
        event.metadata.schema ?? '',
        null,
        entity,
        entity.id?.toString() ?? null,
        nombre,
        idUsuario ? Number(idUsuario) || null : null,
      )
    } catch (_) {}
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const despues = event.entity ?? {}
      // databaseEntity está disponible cuando se usa findOne + save (no con repo.update)
      const antes = event.databaseEntity ?? null

      const idRegistro =
        (despues as any).id?.toString() ??
        (antes as any)?.id?.toString() ??
        null

      const idUsuario =
        (despues as any).usuarioModificacion?.toString() ??
        (despues as any).usuarioCreacion?.toString() ??
        null

      const nombre = await this.resolverNombreUsuario(event.manager, idUsuario)

      await this.insertar(
        event.manager,
        'UPDATE',
        event.metadata.tableName,
        event.metadata.schema ?? '',
        antes,
        despues,
        idRegistro,
        nombre,
        idUsuario ? Number(idUsuario) || null : null,
      )
    } catch (_) {}
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (TABLAS_EXCLUIDAS.has(event.metadata.tableName)) return
    try {
      const entity = event.entity ?? event.databaseEntity ?? {}
      const idRegistro =
        event.entityId?.toString() ?? (entity as any).id?.toString() ?? null
      const idUsuario =
        (entity as any).usuarioModificacion?.toString() ?? null
      const nombre = await this.resolverNombreUsuario(event.manager, idUsuario)
      await this.insertar(
        event.manager,
        'DELETE',
        event.metadata.tableName,
        event.metadata.schema ?? '',
        entity,
        null,
        idRegistro,
        nombre,
        idUsuario ? Number(idUsuario) || null : null,
      )
    } catch (_) {}
  }
}
