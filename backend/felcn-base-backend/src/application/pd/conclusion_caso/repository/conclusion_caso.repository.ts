import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { CreateConclusionPdDto } from '../dto/create-conclusion_caso.dto'
import { UpdateConclusionPdDto } from '../dto/update-conclusion_caso.dto'

type Grupo = 'bienesSujetosPd' | 'sentencias'

interface ConfiguracionGrupo {
  tabla: string
  columnaId: string
  catalogo: string
}

interface SeleccionResultado {
  id: number
  descripcion: string
}

export interface ConclusionPdResultado {
  casosId: number
  bienesSujetosPd: SeleccionResultado[]
  sentencias: SeleccionResultado[]
}

@Injectable()
export class ConclusionPdRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  private readonly grupos: Record<Grupo, ConfiguracionGrupo> = {
    bienesSujetosPd: {
      tabla: 'public.caso_bien_sujeto_pd',
      columnaId: 'id_bien_sujeto_pd',
      catalogo: 'parametricas.bien_sujeto_pd',
    },
    sentencias: {
      tabla: 'public.caso_sentencia',
      columnaId: 'id_sentencia',
      catalogo: 'parametricas.sentencia',
    },
  }

  private validarId(id: number): void {
    if (
      !Number.isInteger(id) ||
      id < 1 ||
      id > 2147483647
    ) {
      throw new BadRequestException(
        'Los IDs deben ser enteros positivos válidos para integer'
      )
    }
  }

  private validarUsuario(usuario: string): string {
    if (typeof usuario !== 'string') {
      throw new BadRequestException(
        'El usuario de auditoría es obligatorio'
      )
    }

    const valor = usuario.trim()

    if (!valor || valor.length > 100) {
      throw new BadRequestException(
        'El usuario de auditoría es obligatorio y admite hasta 100 caracteres'
      )
    }

    return valor
  }

  private obtenerGrupo(tipo: string): Grupo {
    switch (tipo) {
      case 'bienes-sujetos-pd':
        return 'bienesSujetosPd'

      case 'sentencias':
        return 'sentencias'

      default:
        throw new BadRequestException(
          'tipo debe ser bienes-sujetos-pd o sentencias'
        )
    }
  }

  private async verificarCaso(
    manager: EntityManager,
    casosId: number,
    bloquear = false
  ): Promise<void> {
    this.validarId(casosId)

    const resultado = await manager.query(
      `
        SELECT casos_id
        FROM public.asignacion
        WHERE casos_id = $1
        ${bloquear ? 'FOR UPDATE' : ''}
      `,
      [casosId]
    )

    if (!resultado.length) {
      throw new NotFoundException(
        `El caso ${casosId} no existe`
      )
    }
  }

 

  private async sincronizarGrupo(
    manager: EntityManager,
    grupo: Grupo,
    casosId: number,
    ids: number[],
    usuario: string,
    fecha: Date
  ): Promise<void> {

    const config = this.grupos[grupo]
    await manager.query(
      `
        DELETE FROM ${config.tabla}
        WHERE casos_id = $1
          AND NOT (${config.columnaId} = ANY($2::integer[]))
      `,
      [casosId, ids]
    )

    if (!ids.length) return
    await manager.query(
      `
        INSERT INTO ${config.tabla} (
          casos_id,
          ${config.columnaId},
          usuario,
          fechahoraing
        )
        SELECT
          $1::integer,
          seleccion.id,
          $3,
          $4
        FROM unnest($2::integer[]) AS seleccion(id)
        ON CONFLICT (casos_id, ${config.columnaId})
        DO NOTHING
      `,
      [casosId, ids, usuario, fecha]
    )
  }

  private async leerConclusion(
    manager: EntityManager,
    casosId: number
  ): Promise<ConclusionPdResultado> {
    const resultado: ConclusionPdResultado = {
      casosId,
      bienesSujetosPd: [],
      sentencias: [],
    }

    for (const grupo of Object.keys(this.grupos) as Grupo[]) {
      const config = this.grupos[grupo]

      resultado[grupo] = await manager.query(
        `
          SELECT
            catalogo.${config.columnaId} AS id,
            catalogo.descripcion
          FROM ${config.tabla} relacion
          INNER JOIN ${config.catalogo} catalogo
            ON catalogo.${config.columnaId}
               = relacion.${config.columnaId}
          WHERE relacion.casos_id = $1
          ORDER BY catalogo.${config.columnaId} ASC
        `,
        [casosId]
      )
    }

    return resultado
  }

  async create(
    dto: CreateConclusionPdDto,
    usuario: string
  ): Promise<ConclusionPdResultado> {
    const usuarioAuditoria = this.validarUsuario(usuario)

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, dto.casosId, true)

      const fecha = new Date()

      await this.sincronizarGrupo(
        manager,
        'bienesSujetosPd',
        dto.casosId,
        dto.bienesSujetosPd,
        usuarioAuditoria,
        fecha
      )

      await this.sincronizarGrupo(
        manager,
        'sentencias',
        dto.casosId,
        dto.sentencias,
        usuarioAuditoria,
        fecha
      )

      return this.leerConclusion(manager, dto.casosId)
    })
  }

  async findByCaso(
    casosId: number
  ): Promise<ConclusionPdResultado> {
    return this.dataSource.transaction(
      'REPEATABLE READ',
      async (manager) => {
        await this.verificarCaso(manager, casosId)

        return this.leerConclusion(manager, casosId)
      }
    )
  }

  async update(
    casosId: number,
    dto: UpdateConclusionPdDto,
    usuario: string
  ): Promise<ConclusionPdResultado> {
    const usuarioAuditoria = this.validarUsuario(usuario)

    if (
      dto.bienesSujetosPd === undefined &&
      dto.sentencias === undefined
    ) {
      throw new BadRequestException(
        'Debes enviar al menos un grupo de selecciones'
      )
    }

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casosId, true)

      const fecha = new Date()

      if (dto.bienesSujetosPd !== undefined) {
        await this.sincronizarGrupo(
          manager,
          'bienesSujetosPd',
          casosId,
          dto.bienesSujetosPd,
          usuarioAuditoria,
          fecha
        )
      }

      if (dto.sentencias !== undefined) {
        await this.sincronizarGrupo(
          manager,
          'sentencias',
          casosId,
          dto.sentencias,
          usuarioAuditoria,
          fecha
        )
      }

      return this.leerConclusion(manager, casosId)
    })
  }

  async removeSeleccion(
    casosId: number,
    tipo: string,
    seleccionId: number
  ): Promise<{ message: string }> {
    this.validarId(casosId)
    this.validarId(seleccionId)

    const grupo = this.obtenerGrupo(tipo)
    const config = this.grupos[grupo]

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casosId, true)

      const resultado = await manager
        .createQueryBuilder()
        .delete()
        .from(config.tabla)
        .where('casos_id = :casosId', { casosId })
        .andWhere(`${config.columnaId} = :seleccionId`, {
          seleccionId,
        })
        .execute()

      if ((resultado.affected ?? 0) === 0) {
        throw new NotFoundException(
          'La selección no existe en este caso'
        )
      }

      return {
        message: 'Selección eliminada correctamente',
      }
    })
  }

  async remove(
    casosId: number
  ): Promise<{ message: string }> {
    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casosId, true)

      let totalEliminados = 0

      for (const grupo of Object.keys(this.grupos) as Grupo[]) {
        const config = this.grupos[grupo]

        const resultado = await manager
          .createQueryBuilder()
          .delete()
          .from(config.tabla)
          .where('casos_id = :casosId', { casosId })
          .execute()

        totalEliminados += resultado.affected ?? 0
      }

      if (totalEliminados === 0) {
        throw new NotFoundException(
          `El caso ${casosId} no tiene selecciones para eliminar`
        )
      }

      return {
        message: 'Selecciones de la conclusión eliminadas correctamente',
      }
    })
  }
}