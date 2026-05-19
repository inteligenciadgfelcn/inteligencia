/**
 * Constantes para las conexiones de base de datos
 * Usadas en TypeOrmModule.forFeature() e @InjectRepository()
 */

/**
 * Conexión a la base de datos SIII (felcn_siii)
 * Esquema 'parametricas': tipo_droga, pais, continente, departamento, provincia, localidad, etc.
 * Esquema 'public': operativo, persona_auxiliar, arrestado_auxiliar, galeria, etc.
 */
export const DB_SIII = 'siii'

/**
 * Conexión a la base de datos LGI (felcn_lgi)
 * Schema: public
 * Tablas: asignacion, operativo, investigador, departamentosc, distritales, localidad, provincias
 * Origen: sistema legacy GIAEF migrado
 */
export const DB_LGI = 'lgi'

/**
 * Esquemas de la base de datos SIII
 */
export const SCHEMA_PARAMETRICAS = 'parametricas'
export const SCHEMA_PUBLIC = 'public'
export const SCHEMA_AUTH_FDW = 'auth_fdw'
