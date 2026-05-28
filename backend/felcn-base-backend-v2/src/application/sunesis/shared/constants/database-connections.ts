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
 * Conexión a la base de datos S2I (f_s2i)
 * Schema 'parametricas': bien, catalogo_clase, catalogo_tipo, catalogo_caracteristica,
 *   contenido_caso, continente, estado_caso, etapa_investigacion, pais,
 *   tipo_delito, tipo_investigacion_bien, tipo_organizacion
 * Schema 'public': asignacion, blanco, antecedente_blanco, red_social,
 *   lugar_blanco, archivos_blanco, empresa, lugar_empresa, archivos_organizacion,
 *   item_bien_investigado, item_bien_caracteristica, lugar_bien, archivos_bien
 */
export const DB_S2I = 's2i'

/**
 * Esquemas de la base de datos SIII
 */
export const SCHEMA_PARAMETRICAS = 'parametricas'
export const SCHEMA_PUBLIC = 'public'
export const SCHEMA_AUTH_FDW = 'auth_fdw'
