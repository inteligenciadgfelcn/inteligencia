import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { Brackets, DataSource, Repository } from 'typeorm'
import { InvestigadorLgi } from '../entities/investigadore.entity'
import { DB_AUTH, DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class InvestigadorLgiRepository {
  constructor(
    @InjectRepository(InvestigadorLgi, DB_LGI)
    private readonly repository: Repository<InvestigadorLgi>,

    @InjectDataSource(DB_AUTH)
    private readonly dataSourceAuth: DataSource
  ) {}

  async findAllGeneralInvestigadores(idUsuario: number): Promise<any[]> {
  return this.dataSourceAuth.query(
    `
      SELECT
        u.numero_pase,
        CONCAT_WS(
          ' ',
          NULLIF(TRIM(gr.abreviatura), ''),
          NULLIF(TRIM(p.nombres), ''),
          NULLIF(TRIM(p.primer_apellido), ''),
          NULLIF(TRIM(p.segundo_apellido), '')
        ) AS "investigador",
        u.id AS "usuarioId",
        u.id_grado AS "gradoId",
        u.id_grupo AS "grupoId",
        u._estado AS "estado"
      FROM usuario.usuario u
      INNER JOIN usuario.persona p
        ON p.id = u.id_persona
      INNER JOIN parametro.grado gr
        ON gr.id = u.id_grado
      INNER JOIN parametro.grupo g
        ON g.id = u.id_grupo
      INNER JOIN parametro.distrital d
        ON d.id = g.id_distrital
      INNER JOIN parametro.unidad un
        ON un.id = d.id_unidad
      WHERE UPPER(TRIM(u._estado)) = 'ACTIVO'
        AND d._estado = 'ACTIVO'
        AND un._estado = 'ACTIVO'
        AND un.es_operativa_admin = true
        AND d.id_unidad = (
          SELECT d_usuario.id_unidad
          FROM usuario.usuario usuario_actual
          INNER JOIN parametro.grupo grupo_usuario
            ON grupo_usuario.id = usuario_actual.id_grupo
          INNER JOIN parametro.distrital d_usuario
            ON d_usuario.id = grupo_usuario.id_distrital
          WHERE usuario_actual.id = $1
        )
      ORDER BY "investigador" ASC, u.id ASC
    `,
    [idUsuario]
  )
}

  create(data: Partial<InvestigadorLgi>): InvestigadorLgi {
    return this.repository.create(data)
  }

  save(investigador: InvestigadorLgi): Promise<InvestigadorLgi> {
    return this.repository.save(investigador)
  }

  findAsignacionActual(
    casoId: number,
    numeroPase: string
  ): Promise<InvestigadorLgi | null> {
    return this.repository.findOne({
      where: {
        casoId,
        numeroPase,
        actual: true,
      },
    })
  }

  async tieneHistorial(casoId: number, numeroPase: string): Promise<boolean> {
    const cantidad = await this.repository.count({
      where: {
        casoId,
        numeroPase,
      },
    })

    return cantidad > 0
  }

  findOneById(investigadorId: number): Promise<InvestigadorLgi | null> {
    return this.repository.findOne({
      where: {
        investigadorId,
      },
    })
  }

 async findHistorialByCaso(
  casoId: number
): Promise<Array<InvestigadorLgi & { investigador: string }>> {
  const historial = await this.repository.find({
    where: { casoId },
    order: { fechaAsignacion: 'DESC' },
  })

  if (historial.length === 0) {
    return []
  }

  const normalizar = (valor: string) => valor.trim().toUpperCase()

  const numerosPase = [
    ...new Set(
      historial
        .map((item) => normalizar(item.numeroPase))
        .filter(Boolean)
    ),
  ]

  // Diagnóstico temporal: identifica la base AUTH utilizada por Nest.
  const [conexionAuth] = await this.dataSourceAuth.query(`
    SELECT
      current_database() AS "baseDatos",
      inet_server_addr()::text AS "servidor",
      inet_server_port() AS "puerto",
      current_user AS "usuario"
  `)

  const personas: Array<{
    numeroPase: string
    investigador: string
  }> = await this.dataSourceAuth.query(
    `
    SELECT
      UPPER(TRIM(u.numero_pase)) AS "numeroPase",
      CONCAT_WS(
        ' ',
        NULLIF(TRIM(gr.abreviatura), ''),
        NULLIF(TRIM(p.nombres), ''),
        NULLIF(TRIM(p.primer_apellido), ''),
        NULLIF(TRIM(p.segundo_apellido), '')
      ) AS "investigador"
    FROM usuario.usuario u
    LEFT JOIN usuario.persona p
      ON p.id = u.id_persona
    LEFT JOIN parametro.grado gr
      ON gr.id = u.id_grado
    WHERE UPPER(TRIM(u.numero_pase)) = ANY($1::text[])
    `,
    [numerosPase]
  )

  // Retira estos tres mensajes cuando resolvamos la conexión.
  console.log('Conexión AUTH de Nest:', conexionAuth)
  console.log('Pases buscados:', numerosPase)
  console.log('Personas devueltas por AUTH:', personas)

  const nombrePorPase = new Map(
    personas.map((persona) => [
      normalizar(persona.numeroPase),
      persona.investigador,
    ])
  )

  return historial.map((item) => ({
    ...item,
    investigador:
      nombrePorPase.get(normalizar(item.numeroPase)) ?? '',
  }))
}

  async findAllGeneralInvestigador(
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const valor = filtro?.trim() ? `%${filtro.trim()}%` : null

    const data = await this.dataSourceAuth.query(
      `
      SELECT
        u.numero_pase AS "numeroPase",

        CONCAT_WS(
          ' ',
          NULLIF(TRIM(gr.abreviatura), ''),
          NULLIF(TRIM(p.nombres), ''),
          NULLIF(TRIM(p.primer_apellido), ''),
          NULLIF(TRIM(p.segundo_apellido), '')
        ) AS "investigador",

        u.id AS "usuarioId",
        u.id_grado AS "gradoId",
        u.id_grupo AS "grupoId",
        u._estado AS "estado"

      FROM usuario.usuario u

      INNER JOIN usuario.persona p
        ON p.id = u.id_persona

      INNER JOIN parametro.grado gr
        ON gr.id = u.id_grado

      INNER JOIN parametro.grupo g
        ON g.id = u.id_grupo

      WHERE UPPER(TRIM(u._estado)) = 'ACTIVO'

        AND (
          $1::TEXT IS NULL

          OR u.numero_pase ILIKE $1

          OR p.nombres ILIKE $1

          OR p.primer_apellido ILIKE $1

          OR p.segundo_apellido ILIKE $1

          OR gr.abreviatura ILIKE $1

          OR CONCAT_WS(
            ' ',
            gr.abreviatura,
            p.nombres,
            p.primer_apellido,
            p.segundo_apellido
          ) ILIKE $1
        )

      ORDER BY
        p.primer_apellido ASC,
        p.segundo_apellido ASC,
        p.nombres ASC

      LIMIT $2
      OFFSET $3
      `,
      [valor, Number(limite), Number(saltar)]
    )

    const [resultadoTotal] = await this.dataSourceAuth.query(
      `
      SELECT COUNT(*)::INTEGER AS "total"

      FROM usuario.usuario u

      INNER JOIN usuario.persona p
        ON p.id = u.id_persona

      INNER JOIN parametro.grado gr
        ON gr.id = u.id_grado

      INNER JOIN parametro.grupo g
        ON g.id = u.id_grupo

      WHERE UPPER(TRIM(u._estado)) = 'ACTIVO'

        AND (
          $1::TEXT IS NULL

          OR u.numero_pase ILIKE $1

          OR p.nombres ILIKE $1

          OR p.primer_apellido ILIKE $1

          OR p.segundo_apellido ILIKE $1

          OR gr.abreviatura ILIKE $1

          OR CONCAT_WS(
            ' ',
            gr.abreviatura,
            p.nombres,
            p.primer_apellido,
            p.segundo_apellido
          ) ILIKE $1
        )
      `,
      [valor]
    )

    const total = Number(resultadoTotal?.total ?? 0)

    return [data, total]
  }

  async obtenerNombresPorPases(
  pases: string[]
): Promise<string[]> {
  const normalizar = (valor: string) =>
    valor.trim().toUpperCase()

  const numerosPase = [
    ...new Set(pases.map(normalizar).filter(Boolean)),
  ]

  if (numerosPase.length === 0) {
    return []
  }

  const personas: Array<{
    numeroPase: string
    investigador: string
  }> = await this.dataSourceAuth.query(
    `
      SELECT
        UPPER(TRIM(u.numero_pase)) AS "numeroPase",

        CONCAT_WS(
          ' ',
          NULLIF(TRIM(gr.abreviatura), ''),
          NULLIF(TRIM(p.nombres), ''),
          NULLIF(TRIM(p.primer_apellido), ''),
          NULLIF(TRIM(p.segundo_apellido), '')
        ) AS "investigador"

      FROM usuario.usuario u

      INNER JOIN usuario.persona p
        ON p.id = u.id_persona

      LEFT JOIN parametro.grado gr
        ON gr.id = u.id_grado

      WHERE UPPER(TRIM(u.numero_pase)) = ANY($1::text[])
    `,
    [numerosPase]
  )

  const nombrePorPase = new Map(
    personas.map((persona) => [
      normalizar(persona.numeroPase),
      persona.investigador.trim(),
    ])
  )

  return numerosPase.map(
    (pase) =>
      nombrePorPase.get(pase) ||
      `${pase} (nombre no encontrado)`
  )
}
}
