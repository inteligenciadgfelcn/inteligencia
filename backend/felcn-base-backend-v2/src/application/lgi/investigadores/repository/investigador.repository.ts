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

  async findAllGeneralInvestigadores(idGrupo: number): Promise<any[]> {
    return this.dataSourceAuth.query(
      `
      SELECT u.numero_pase,
        CONCAT(
          TRIM(gr.abreviatura),
          ' ',
          TRIM(p.nombres),
          ' ',
          TRIM(p.primer_apellido),
          ' ',
          TRIM(p.segundo_apellido)
        ) AS "investigador",
         u.id as "usuarioId",
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
      WHERE u.id_grupo = $1
        AND UPPER(TRIM(u._estado)) = 'ACTIVO'
    `,
      [idGrupo]
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

  findHistorialByCaso(casoId: number): Promise<InvestigadorLgi[]> {
    return this.repository.find({
      where: {
        casoId,
      },
      order: {
        fechaAsignacion: 'DESC',
      },
    })
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
}
