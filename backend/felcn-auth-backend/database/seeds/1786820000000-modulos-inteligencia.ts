import { Modulo, Propiedades } from '@/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Módulos de menú del rol INTELIGENCIA — ya existían en la base real
 * (creados a mano, nunca versionados). Datos tomados tal cual de la base
 * real de `servertest` (label, url, nombre, propiedades) — mismo patrón que
 * `1786800000000-modulos-f1.ts`: la PK la genera la secuencia, padre antes
 * que los submódulos.
 */
export class modulosInteligencia1786820000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const secciones = [
      {
        label: 'Inteligencia',
        url: '/inteligencia',
        nombre: 'Inteligencia',
        propiedades: { orden: 5, descripcion: 'Sección del menú para el rol de inteligencia' },
        subMenus: [
          { label: 'Creación del servicio', url: '/inteligencia/creacion', nombre: 'Creación del servicio', propiedades: { icono: 'create', orden: 1, descripcion: 'Registro de servicio' } },
          { label: 'Asignación de caso', url: '/inteligencia/registro', nombre: 'Asignación de caso', propiedades: { icono: 'create', orden: 2, descripcion: 'Registro de asignación de caso operativo' } },
          { label: 'Actualización del caso', url: '/inteligencia/actualizacion', nombre: 'Actualización del caso', propiedades: { icono: 'refresh', orden: 3, descripcion: 'Asignación de numero de caso' } },
          { label: 'Lista de servicios', url: '/inteligencia/servicio', nombre: 'Lista de servicios', propiedades: { icono: 'request_page', orden: 4, descripcion: 'Vista de servicios creados' } },
          { label: 'Antecedentes', url: '/inteligencia/antecedentes', nombre: 'Antecedentes', propiedades: { icono: 'visibility', orden: 5, descripcion: 'Búsqueda de antecedentes de una persona' } },
          { label: 'Búsqueda por numero operativo', url: '/inteligencia/buscar_operativo', nombre: 'Búsqueda por numero operativo', propiedades: { icono: 'search', orden: 6, descripcion: 'Búsqueda por numero de caso' } },
        ],
      },
      {
        label: 'Filiación de personas',
        url: '/filiacion',
        nombre: 'Filiación de personas',
        propiedades: { orden: 6, descripcion: 'Filiación de personas' },
        subMenus: [
          { label: 'Fenotipos', url: '/filiacion/registro', nombre: 'Fenotipos', propiedades: { icono: 'create', orden: 1, descripcion: 'Registro de datos de fenotipos' } },
          { label: 'Parentescos', url: '/filiacion/parentesco', nombre: 'Parentescos', propiedades: { icono: 'create', orden: 2, descripcion: 'Registro de datos de parentesco y nombres supuestos' } },
          { label: 'Tarjeta prontuaria', url: '/filiacion/tarjeta_prontuaria', nombre: 'Tarjeta prontuaria', propiedades: { icono: 'search', orden: 3, descripcion: 'Búsqueda de tarjeta prontuaria por numero de caso' } },
        ],
      },
      {
        label: 'Interoperabilidad',
        url: '/interoperabilidad',
        nombre: 'Interoperabilidad',
        propiedades: { orden: 7, descripcion: 'Interoperabilidad con entidades del INRA, SEGIP, ITV, SIN' },
        subMenus: [
          { label: 'INRA', url: '/interoperabilidad/inra', nombre: 'INRA', propiedades: { icono: 'search', orden: 1, descripcion: 'Interoperabilidad con el INRA' } },
          { label: 'ITV', url: '/interoperabilidad/itv', nombre: 'ITV', propiedades: { icono: 'search', orden: 2, descripcion: 'Interoperabilidad con el ITV' } },
        ],
      },
      {
        label: 'Casos X',
        url: '/casos_x',
        nombre: 'Casos X',
        propiedades: { orden: 8, descripcion: 'Sección de casos x' },
        subMenus: [
          { label: 'Registro', url: '/casos_x/registro', nombre: 'Registro', propiedades: { icono: 'create', orden: 1, descripcion: 'Registro de casos x' } },
          { label: 'Actualización', url: '/casos_x/actualizacion', nombre: 'Actualización', propiedades: { icono: 'edit', orden: 2, descripcion: 'Actualización de casos x por el usuario' } },
          { label: 'Listado', url: '/casos_x/listado', nombre: 'Listado', propiedades: { icono: 'engineering', orden: 3, descripcion: 'Listado de registros de casos x' } },
          { label: 'Consultas', url: '/casos_x/consulta', nombre: 'Consultas', propiedades: { icono: 'search', orden: 4, descripcion: 'Consultas de casos x' } },
        ],
      },
    ]

    for (const seccion of secciones) {
      const propiedadesPadre: Propiedades = {
        orden: seccion.propiedades.orden,
        descripcion: seccion.propiedades.descripcion,
      }

      const moduloPadre = await queryRunner.manager.save(
        new Modulo({
          label: seccion.label,
          url: seccion.url,
          nombre: seccion.nombre,
          propiedades: propiedadesPadre,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )

      for (const subMenu of seccion.subMenus) {
        const propiedades: Propiedades = {
          icono: subMenu.propiedades.icono,
          orden: subMenu.propiedades.orden,
          descripcion: subMenu.propiedades.descripcion,
        }
        await queryRunner.manager.save(
          new Modulo({
            label: subMenu.label,
            url: subMenu.url,
            nombre: subMenu.nombre,
            idModulo: moduloPadre.id,
            propiedades,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
        )
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
