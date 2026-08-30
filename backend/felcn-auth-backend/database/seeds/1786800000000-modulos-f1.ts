import { Modulo, Propiedades } from '@/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Seed: Módulos de menú de la Fase 1 (docs/MODULOS-F1.SQL).
 *
 * Se insertan los registros tal cual el archivo (label, url, nombre y
 * propiedades). Los ids del script (38, 48, 43, ...) NO se reutilizan: la PK
 * la genera la secuencia y queda correlativa, insertando siempre el módulo
 * padre antes que sus submódulos para respetar la FK id_modulo — mismo patrón
 * que 1611497480901-modulo.ts y 1709000004000-modulos-estructura.ts.
 */
export class modulosFaseUno1786800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const secciones = [
      {
        label: 'Operativos',
        url: '/operativos',
        nombre: 'Operativos',
        propiedades: {
          icono: 'engineering',
          orden: 4,
          descripcion: 'Operativos',
        },
        subMenus: [
          {
            label: 'Registro y Listado',
            url: '/operativos/listado',
            nombre: 'Registro y Listado',
            propiedades: {
              icono: 'mobile',
              orden: 1,
              descripcion: 'Registro y Listado de Operativos',
            },
          },
        ],
      },
      {
        label: 'Investigación Financiera',
        url: '/investigaciones',
        nombre: 'Investigación Financiera',
        propiedades: {
          icono: 'search',
          orden: 15,
          descripcion: 'Investigación Financiera',
        },
        subMenus: [
          {
            label: 'Paralela',
            url: '/investigaciones/paralelo',
            nombre: 'Paralela',
            propiedades: {
              icono: 'gavel',
              orden: 1,
              descripcion: 'Investigacion Financiera Paralelo al opertivo',
            },
          },
          {
            label: 'LGI',
            url: '/investigaciones/lgi',
            nombre: 'LGI',
            propiedades: {
              icono: 'drag_indicator',
              orden: 2,
              descripcion: 'Investigacion Financiera LGI',
            },
          },
        ],
      },
      {
        label: 'Seguimientos Casos Jurídicos',
        url: '/seguimientos',
        nombre: 'Seguimientos Casos Jurídicos',
        propiedades: {
          icono: 'schedule',
          orden: 16,
          descripcion: 'Seguimientos Casos Jurídicos',
        },
        subMenus: [
          {
            label: 'Seguimiento',
            url: '/seguimientos/listado',
            nombre: 'Seguimiento',
            propiedades: {
              icono: 'table_chart',
              orden: 1,
              descripcion: 'Seguimiento',
            },
          },
        ],
      },
      {
        label: 'Reportes',
        url: '/reportes',
        nombre: 'Reportes',
        propiedades: {
          icono: 'view_quilt',
          orden: 17,
          descripcion: 'Reportes Casos Operativos',
        },
        subMenus: [
          {
            label: 'Reportes Cruzados',
            url: '/reportes/cruzados',
            nombre: 'Reportes Cruzados',
            propiedades: {
              icono: 'view_module',
              orden: 1,
              descripcion: 'Reportes Cruzados',
            },
          },
          {
            label: 'Cuadros',
            url: '/reportes/cuadros',
            nombre: 'Cuadros',
            propiedades: {
              icono: 'storage',
              orden: 2,
              descripcion: 'Reporte en cuadros',
            },
          },
          {
            label: 'Avanzado',
            url: '/reportes/cruzados-all',
            nombre: 'Reportes cruzados filtrados',
            propiedades: {
              icono: 'monitor',
              orden: 3,
              descripcion: 'Reportes cruzados con filtros',
            },
          },
        ],
      },
      {
        label: 'Análisis de Información de Inteligencia',
        url: '/analisis',
        nombre: 'Análisis de Información de Inteligencia',
        propiedades: {
          icono: 'widgets',
          orden: 21,
          descripcion: 'Análisis de Información de Inteligencia',
        },
        subMenus: [
          {
            label: 'Casos Investigados',
            url: '/analisis/casos',
            nombre: 'Casos Investigados',
            propiedades: {
              icono: 'plus',
              orden: 1,
              descripcion: 'Casos Investigados',
            },
          },
          {
            label: 'REPORTES CASOS',
            url: '/analisis/reportes',
            nombre: 'REPORTES CASOS',
            propiedades: { icono: 'view', orden: 2, descripcion: 'Reportes' },
          },
          {
            label: 'FLUJO DE TRANSPORTE',
            url: '/analisis/transporte',
            nombre: 'FLUJO DE TRANSPORTE',
            propiedades: {
              icono: 'sticky_note_2',
              orden: 3,
              descripcion: 'FLUJO DE TRANSPORTE',
            },
          },
          {
            label: 'REPORTE DE FLUJOS DE TRANSPORTE',
            url: '/analisis/transporte/reportes',
            nombre: 'REPORTE DE FLUJOS DE TRANSPORTE',
            propiedades: {
              icono: 'open_with',
              orden: 4,
              descripcion: 'REPORTE DE FLUJOS DE TRANSPORTE',
            },
          },
          {
            label: 'DIAGRAMA DE VÍNCULOS',
            url: '/analisis/reportes/vinculos',
            nombre: 'DIAGRAMA DE VÍNCULOS',
            propiedades: {
              icono: 'grid_on',
              orden: 5,
              descripcion: 'DIAGRAMA DE VÍNCULOS',
            },
          },
        ],
      },
    ]

    for (const seccion of secciones) {
      const propiedadesPadre: Propiedades = {
        icono: seccion.propiedades.icono,
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
