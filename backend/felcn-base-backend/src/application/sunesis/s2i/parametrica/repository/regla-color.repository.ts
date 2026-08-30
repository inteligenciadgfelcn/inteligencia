import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { LoggerService } from '@/core/logger'
import { DB_S2I, DB_PERSONAS, DB_VLS } from '../../../shared/constants'
import { S2iReglaColor } from '../entity/regla-color.entity'

/**
 * Nombre de identificador SQL válido: letras, dígitos y guión bajo, sin empezar con dígito.
 * persona_funcion/vehiculo_funcion vienen de una tabla parametrizable por un administrador,
 * así que igual se validan contra este patrón antes de interpolarlos en una consulta —
 * nunca se ejecuta un nombre que no lo cumpla.
 */
const IDENTIFICADOR_VALIDO = /^[a-zA-Z_][a-zA-Z0-9_]*$/

/**
 * Mapea el valor guardado en persona_database/vehiculo_database — el nombre de la variable
 * de entorno que define el dbname de esa conexión (ej. 'DB_S2I_DATABASE', ver
 * database.module.ts) — a la conexión TypeORM correspondiente. Cualquier valor fuera de
 * este whitelist se ignora (la regla se salta, no rompe la resolución).
 */
@Injectable()
export class ReglaColorRepository {
  private readonly logger = LoggerService.getInstance()
  private readonly conexionesPorClave: Map<string, DataSource>

  constructor(
    @InjectDataSource(DB_S2I) private readonly dsS2i: DataSource,
    @InjectDataSource(DB_PERSONAS) private readonly dsPersonas: DataSource,
    @InjectDataSource(DB_VLS) private readonly dsVls: DataSource
  ) {
    this.conexionesPorClave = new Map([
      ['DB_S2I_DATABASE', this.dsS2i],
      ['DB_PERSONAS_DATABASE', this.dsPersonas],
      ['DB_VLS_DATABASE', this.dsVls],
    ])
  }

  async listarActivasConPersonaFuncion(): Promise<S2iReglaColor[]> {
    return this.dsS2i.getRepository(S2iReglaColor).find({
      where: { estado: 'ACTIVO' },
      order: { id: 'ASC' },
    })
  }

  /**
   * Invoca `parametricas.<funcion>($1)` en la conexión indicada por `claveDatabase` y
   * retorna su resultado booleano. Devuelve `false` (regla no aplica) si la clave de
   * conexión no está en el whitelist, si el nombre de función no es un identificador
   * válido, o si la función no existe en el esquema `parametricas` con la firma
   * `(character varying) RETURNS boolean` — nunca lanza por una regla mal configurada.
   */
  async evaluarFuncion(
    claveDatabase: string | null,
    funcion: string | null,
    valor: string
  ): Promise<boolean> {
    if (!claveDatabase || !funcion) return false

    const dataSource = this.conexionesPorClave.get(claveDatabase)
    if (!dataSource) {
      this.logger.warn(
        `regla_color: clave de conexión desconocida '${claveDatabase}', se omite la regla`
      )
      return false
    }

    if (!IDENTIFICADOR_VALIDO.test(funcion)) {
      this.logger.warn(
        `regla_color: nombre de función inválido '${funcion}', se omite la regla`
      )
      return false
    }

    try {
      const existe: unknown[] = await dataSource.query(
        `SELECT 1
           FROM pg_proc p
           JOIN pg_namespace n ON n.oid = p.pronamespace
          WHERE n.nspname = 'parametricas'
            AND p.proname = $1
            AND p.pronargs = 1
            AND p.proargtypes[0] = 'character varying'::regtype
            AND p.prorettype = 'boolean'::regtype
          LIMIT 1`,
        [funcion]
      )
      if (existe.length === 0) {
        this.logger.warn(
          `regla_color: función 'parametricas.${funcion}' no existe con la firma esperada, se omite la regla`
        )
        return false
      }

      const resultado: Array<{ resultado: boolean }> = await dataSource.query(
        `SELECT parametricas."${funcion}"($1) AS resultado`,
        [valor]
      )
      return resultado[0]?.resultado === true
    } catch (e) {
      this.logger.warn(
        `regla_color: error evaluando 'parametricas.${funcion}': ${e instanceof Error ? e.message : e}`
      )
      return false
    }
  }
}
