import { Modulo, Propiedades } from '@/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Seed: Módulos de menú para Estructura Organizacional FELCN
 * Agrega la sección "Estructura" con submenús: Grados, Unidades, Distritales, Grupos
 */
export class modulosEstructura1709000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seccion = {
      nombre: 'estructura',
      url: '/estructura',
      label: 'Estructura',
      propiedades: {
        descripcion: 'Sección de estructura organizacional FELCN',
        orden: 3,
      },
      subMenus: [
        {
          nombre: 'grados',
          url: '/admin/estructura/grados',
          label: 'Grados',
          propiedades: {
            icono: 'military_tech',
            descripcion: 'Gestión de grados militares y policiales',
            orden: 1,
          },
        },
        {
          nombre: 'unidades',
          url: '/admin/estructura/unidades',
          label: 'Unidades',
          propiedades: {
            icono: 'account_tree',
            descripcion: 'Gestión de unidades regionales FELCN',
            orden: 2,
          },
        },
        {
          nombre: 'distritales',
          url: '/admin/estructura/distritales',
          label: 'Distritales',
          propiedades: {
            icono: 'location_on',
            descripcion: 'Gestión de distritales por unidad',
            orden: 3,
          },
        },
        {
          nombre: 'grupos',
          url: '/admin/estructura/grupos',
          label: 'Grupos',
          propiedades: {
            icono: 'groups',
            descripcion: 'Gestión de grupos operacionales',
            orden: 4,
          },
        },
      ],
    }

    const propiedadesSeccion: Propiedades = {
      orden: seccion.propiedades.orden,
      descripcion: seccion.propiedades.descripcion,
    }

    const moduloPadre = await queryRunner.manager.save(
      new Modulo({
        nombre: seccion.nombre,
        url: seccion.url,
        label: seccion.label,
        propiedades: propiedadesSeccion,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    )

    for (const subMenu of seccion.subMenus) {
      const propiedades: Propiedades = {
        icono: subMenu.propiedades.icono,
        descripcion: subMenu.propiedades.descripcion,
        orden: subMenu.propiedades.orden,
      }
      await queryRunner.manager.save(
        new Modulo({
          nombre: subMenu.nombre,
          url: subMenu.url,
          label: subMenu.label,
          idModulo: moduloPadre.id,
          propiedades,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
      )
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
