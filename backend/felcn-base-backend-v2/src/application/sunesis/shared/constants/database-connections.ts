/**
 * Constantes para las conexiones de base de datos
 * Usadas en TypeOrmModule.forFeature() e @InjectRepository()
 */

/**
 * Conexión a la base de datos ASIG-CASOS (felcn_asignacion_casos)
 * Tablas: asignacion, servicio, departamento, unidad, letra, usuario_unidad, usuario_icia
 */
export const DB_ASIG_CASOS = 'default'

/**
 * Conexión a la base de datos S2I (felcn_s3i)
 * Tablas: usuario, rol, grado, unidad, distrital, grupo, menu, menu_hijo, formulario, auditoria_cambio
 */
export const DB_S2I = 's2i'

/**
 * Conexión a la base de datos SIII (felcn_iii)
 * Esquema 'parametricas': tipo_droga, pais, continente, departamento, provincia, localidad, etc.
 * Esquema 'public': operativo, detenido_auxiliar, arrestado_auxiliar, galeria, etc.
 */
export const DB_SIII = 'siii'

/**
 * Esquemas de la base de datos SIII
 */
export const SCHEMA_PARAMETRICAS = 'parametricas'
export const SCHEMA_PUBLIC = 'public'
