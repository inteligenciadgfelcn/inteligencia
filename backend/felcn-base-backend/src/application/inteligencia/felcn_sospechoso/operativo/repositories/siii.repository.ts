import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'

@Injectable()
export class SiiiRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) {}

  async getOperativoByCaso(numero_caso: string) {
    return await this.dataSource.query(
      `SELECT 
        a.nombre_caso, 
        a.numero_caso,
        a.asignado_caso,
        a.fiscal_asignado_caso,
        o.fecha_operativo, 
        d.id_departamento,
        d.abreviatura as departamento_abreviatura, 
        o.descripcion,
        d.descripcion as departamento, 
        o.id_provincia,
        p.descripcion as provincia, 
        o.id_localidad, 
        l.descripcion as localidad, 
        o.lugar,
        o.id_categoria_operativo,
        c.descripcion as categoria_operativo,
        o.id_item_operativo,
        i.descripcion as item_operativo, 
        o.id_unidad, 
        o.id_distrital, 
        o.id_grupo, 
        o.mando,

        COALESCE(bienes.bienes, '[]') AS bienes_secuestrados,
        COALESCE(aux.auxiliares, '[]') AS detenidos,
        COALESCE(drogas.drogas, '[]') AS drogas,
        COALESCE(sustancia_liquida.sustancia_liquida, '[]') AS sustancia_liquida,
        COALESCE(sustancia_solida.sustancia_solida, '[]') AS sustancia_solida,
        COALESCE(vehiculo.vehiculo, '[]') AS vehiculo

    FROM operativo o

    INNER JOIN asignacion a 
      ON o.numero_operativo = a.numero_operativo

    INNER JOIN parametricas.departamento d 
      ON o.id_departamento = d.id_departamento

    INNER JOIN parametricas.provincia p 
      ON o.id_provincia = p.id_provincia

    INNER JOIN parametricas.localidad l 
      ON o.id_localidad = l.id_localidad

    INNER JOIN parametricas.categoria_operativo c 
      ON o.id_categoria_operativo = c.id_categoria_operativo

    INNER JOIN public.item_operativo i 
      ON o.id_item_operativo = i.id_item_operativo

    --  DETENIDOS
    LEFT JOIN (
      SELECT 
        pa.id_operativo,
        json_agg(
          json_build_object(
            'id_persona_auxiliar', pa.id_persona_auxiliar,
            'nombre_completo', 
              TRIM(
                COALESCE(pa.nombres,'') || ' ' ||
                COALESCE(pa.apellido_paterno,'') || ' ' ||
                COALESCE(pa.apellido_materno,'') || ' ' ||
                COALESCE(pa.apellido_esposo,'')
              ),
            'nro_documento', pa.nro_documento,
            'estado', pa.estado
          )
        ) AS auxiliares
      FROM public.persona_auxiliar pa
      GROUP BY pa.id_operativo
    ) aux ON aux.id_operativo = o.id_operativo

    --  BIENES
    LEFT JOIN (
      SELECT 
        ib.id_operativo,
        json_agg(
          json_build_object(
            'tipo_bien', ct.descripcion,
            'cantidad', ib.cantidad_bien
          )
        ) AS bienes
      FROM public.item_bien_secuestrado ib
      INNER JOIN public.catalogo_tipo ct
        ON ib.id_catalogo_tipo = ct.id_catalogo_tipo
      GROUP BY ib.id_operativo
    ) bienes ON bienes.id_operativo = o.id_operativo

    --  DROGAS
    LEFT JOIN (
      SELECT 
        id.id_operativo,
        json_agg(
          json_build_object(
            'tipo_droga', ed.descripcion,
            'tipo_transporte', ft.descripcion,
            'cantidad', id.cantidad,
            'capsulas', id.capsulas
          )
        ) AS drogas
      FROM public.droga id
      INNER JOIN parametricas.forma_transporte ft
        ON id.id_forma_transporte = ft.id_forma_transporte
      INNER JOIN public.estado_droga ed
        ON id.id_estado_droga = ed.id_estado_droga
      GROUP BY id.id_operativo
    ) drogas ON drogas.id_operativo = o.id_operativo

    --  SUSTANCIA LÍQUIDA
    LEFT JOIN (
      SELECT 
        id.id_operativo,
        json_agg(
          json_build_object(
            'sustancia_liquida', ft.descripcion,
            'cantidad', id.cantidad
          )
        ) AS sustancia_liquida
      FROM public.sustancia_liquida id
      INNER JOIN parametricas.sustancia_liquida_descripcion ft
        ON id.id_sustancia_liquida_descripcion = ft.id_sustancia_liquida_descripcion
      GROUP BY id.id_operativo
    ) sustancia_liquida 
      ON sustancia_liquida.id_operativo = o.id_operativo

    -- SUSTANCIA SÓLIDA
    LEFT JOIN (
      SELECT 
        id.id_operativo,
        json_agg(
          json_build_object(
            'sustancia_solida', ed.descripcion,
            'cantidad', id.cantidad
          )
        ) AS sustancia_solida
      FROM public.sustancia_solida id
      INNER JOIN parametricas.sustancia_solida_descripcion ed
        ON id.id_sustancia_solida_descripcion = ed.id_sustancia_solida_descripcion
      GROUP BY id.id_operativo
    ) sustancia_solida 
      ON sustancia_solida.id_operativo = o.id_operativo

       --  VEHICULO
    LEFT JOIN (
      SELECT 
        id.id_operativo,
        json_agg(
          json_build_object(
            'tipo_vehiculo', ft.descripcion,
            'placa', id.placa,
            'color', id.color,
            'marca', id.marca
          )
        ) AS vehiculo
      FROM public.vehiculo id
      INNER JOIN public.catalogo_tipo ft
        ON id.id_catalogo_tipo = ft.id_catalogo_tipo
      GROUP BY id.id_operativo
    ) vehiculo 
      ON vehiculo.id_operativo = o.id_operativo

      WHERE TRIM(a.numero_caso) = $1
`,
      [numero_caso]
    )
  }
}