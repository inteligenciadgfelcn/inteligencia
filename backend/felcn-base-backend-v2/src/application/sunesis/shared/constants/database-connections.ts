/**
 * Constantes para las conexiones de base de datos
 * Usadas en TypeOrmModule.forFeature() e @InjectRepository()
 */

/**
 * Conexión a la base de datos SIII (felcn_siii)
 * Esquema 'parametricas': tipo_droga, pais, continente, departamento, provincia, localidad, etc.
 * Esquema 'public': operativo, detenido_auxiliar, arrestado_auxiliar, galeria, etc.
 */
export const DB_SIII = 'siii'

/**
 * Esquemas de la base de datos SIII
 */
export const SCHEMA_PARAMETRICAS = 'parametricas'
export const SCHEMA_PUBLIC = 'public'
