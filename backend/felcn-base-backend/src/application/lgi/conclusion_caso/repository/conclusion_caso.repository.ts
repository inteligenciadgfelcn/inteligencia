import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CreateConclusionCasoDto } from '../dto/create-conclusion_caso.dto'
import { UpdateConclusionCasoDto } from '../dto/update-conclusion_caso.dto'

type Grupo = 'ciclos' | 'verbosRectores' | 'tipologias'

interface ConfiguracionGrupo {
  tabla: string
  columnaId: string
  catalogo: string
}

export interface ConclusionCasoResultado {
  casoId: string
  ciclos: { id: string; descripcion: string }[]
  verbosRectores: { id: string; descripcion: string }[]
  tipologias: { id: string; descripcion: string }[]
}

@Injectable()
export class ConclusionCasoRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  private readonly grupos: Record<Grupo, ConfiguracionGrupo> = {
    ciclos: {
      tabla: 'public.caso_ciclo',
      columnaId: 'id_ciclo',
      catalogo: 'parametricas.ciclo',
    },
    verbosRectores: {
      tabla: 'public.caso_verbo_rector',
      columnaId: 'id_verbo_rector',
      catalogo: 'parametricas.verbo_rector',
    },
    tipologias: {
      tabla: 'public.caso_tipologia',
      columnaId: 'id_tipologia',
      catalogo: 'parametricas.tipologia',
    },
  }

  private validarId(id: string): void {
    if (
      typeof id !== 'string' ||
      !/^[1-9]\d*$/.test(id) ||
      BigInt(id) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        'Los IDs deben ser enteros positivos válidos para bigint'
      )
    }
  }

  private validarUsuario(usuario: string): string {
    const valor = usuario?.trim()

    if (!valor || valor.length > 15) {
      throw new BadRequestException(
        'El usuario de auditoría es obligatorio y admite hasta 15 caracteres'
      )
    }

    return valor
  }

  private obtenerGrupo(tipo: string): Grupo {
    switch (tipo) {
      case 'ciclos':
        return 'ciclos'

      case 'verbos-rectores':
        return 'verbosRectores'

      case 'tipologias':
        return 'tipologias'

      default:
        throw new BadRequestException(
          'tipo debe ser ciclos, verbos-rectores o tipologias'
        )
    }
  }

  private async verificarCaso(
    manager: EntityManager,
    casoId: string,
    bloquear = false
  ): Promise<void> {
    this.validarId(casoId)

    const resultado = await manager.query(
      `
        SELECT casos_id
        FROM public.asignacion
        WHERE casos_id = $1
        ${bloquear ? 'FOR UPDATE' : ''}
      `,
      [casoId]
    )

    if (!resultado.length) {
      throw new NotFoundException(
        `El caso ${casoId} no existe`
      )
    }
  }

  private async validarSeleccion(
    manager: EntityManager,
    grupo: Grupo,
    ids: string[]
  ): Promise<void> {
    if (!Array.isArray(ids)) {
      throw new BadRequestException(
        `${grupo} debe enviarse como un arreglo`
      )
    }

    ids.forEach((id) => this.validarId(id))

    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException(
        `${grupo} contiene IDs repetidos`
      )
    }

    if (!ids.length) return

    const config = this.grupos[grupo]

    const existentes: { id: string }[] = await manager.query(
      `
        SELECT ${config.columnaId}::text AS id
        FROM ${config.catalogo}
        WHERE ${config.columnaId} = ANY($1::bigint[])
      `,
      [ids]
    )

    const encontrados = new Set(
      existentes.map((fila) => fila.id)
    )

    const faltantes = ids.filter(
      (id) => !encontrados.has(id)
    )

    if (faltantes.length) {
      throw new BadRequestException(
        `IDs inexistentes en ${grupo}: ${faltantes.join(', ')}`
      )
    }
  }

  private async sincronizarGrupo(
    manager: EntityManager,
    grupo: Grupo,
    casoId: string,
    ids: string[],
    usuario: string,
    fecha: Date
  ): Promise<void> {
    await this.validarSeleccion(manager, grupo, ids)

    const config = this.grupos[grupo]

    // Eliminar las relaciones que ya no están seleccionadas.
    await manager.query(
      `
        DELETE FROM ${config.tabla}
        WHERE casos_id = $1
          AND NOT (${config.columnaId} = ANY($2::bigint[]))
      `,
      [casoId, ids]
    )

    if (!ids.length) return

    // Insertar únicamente relaciones nuevas.
    // Las existentes conservan su usuario y fecha de creación.
    await manager.query(
      `
        INSERT INTO ${config.tabla} (
          casos_id,
          ${config.columnaId},
          usuario,
          fechahoraing
        )
        SELECT
          $1::bigint,
          seleccion.id,
          $3,
          $4
        FROM unnest($2::bigint[]) AS seleccion(id)
        ON CONFLICT (casos_id, ${config.columnaId})
        DO NOTHING
      `,
      [casoId, ids, usuario, fecha]
    )
  }

  private async leerConclusion(
    manager: EntityManager,
    casoId: string
  ): Promise<ConclusionCasoResultado> {
    const resultado: ConclusionCasoResultado = {
      casoId,
      ciclos: [],
      verbosRectores: [],
      tipologias: [],
    }

    for (const grupo of Object.keys(this.grupos) as Grupo[]) {
      const config = this.grupos[grupo]

      resultado[grupo] = await manager.query(
        `
          SELECT
            catalogo.${config.columnaId}::text AS id,
            catalogo.descripcion
          FROM ${config.tabla} relacion
          INNER JOIN ${config.catalogo} catalogo
            ON catalogo.${config.columnaId}
               = relacion.${config.columnaId}
          WHERE relacion.casos_id = $1
          ORDER BY catalogo.${config.columnaId} ASC
        `,
        [casoId]
      )
    }

    return resultado
  }

  async create(
    dto: CreateConclusionCasoDto,
    usuario: string
  ): Promise<ConclusionCasoResultado> {
    const usuarioAuditoria = this.validarUsuario(usuario)

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, dto.casoId, true)

      const fecha = new Date()

      await this.sincronizarGrupo(
        manager,
        'ciclos',
        dto.casoId,
        dto.cicloIds,
        usuarioAuditoria,
        fecha
      )

      await this.sincronizarGrupo(
        manager,
        'verbosRectores',
        dto.casoId,
        dto.verboRectorIds,
        usuarioAuditoria,
        fecha
      )

      await this.sincronizarGrupo(
        manager,
        'tipologias',
        dto.casoId,
        dto.tipologiaIds,
        usuarioAuditoria,
        fecha
      )

      return this.leerConclusion(manager, dto.casoId)
    })
  }

  async findByCaso(
    casoId: string
  ): Promise<ConclusionCasoResultado> {
    return this.dataSource.transaction(
      'REPEATABLE READ',
      async (manager) => {
        await this.verificarCaso(manager, casoId)

        return this.leerConclusion(manager, casoId)
      }
    )
  }

  async update(
    casoId: string,
    dto: UpdateConclusionCasoDto,
    usuario: string
  ): Promise<ConclusionCasoResultado> {
    const usuarioAuditoria = this.validarUsuario(usuario)

    if (
      dto.cicloIds === undefined &&
      dto.verboRectorIds === undefined &&
      dto.tipologiaIds === undefined
    ) {
      throw new BadRequestException(
        'Debes enviar al menos un grupo de selecciones'
      )
    }

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casoId, true)

      const fecha = new Date()

      if (dto.cicloIds !== undefined) {
        await this.sincronizarGrupo(
          manager,
          'ciclos',
          casoId,
          dto.cicloIds,
          usuarioAuditoria,
          fecha
        )
      }

      if (dto.verboRectorIds !== undefined) {
        await this.sincronizarGrupo(
          manager,
          'verbosRectores',
          casoId,
          dto.verboRectorIds,
          usuarioAuditoria,
          fecha
        )
      }

      if (dto.tipologiaIds !== undefined) {
        await this.sincronizarGrupo(
          manager,
          'tipologias',
          casoId,
          dto.tipologiaIds,
          usuarioAuditoria,
          fecha
        )
      }

      return this.leerConclusion(manager, casoId)
    })
  }

  async removeSeleccion(
    casoId: string,
    tipo: string,
    seleccionId: string
  ): Promise<{ message: string }> {
    this.validarId(casoId)
    this.validarId(seleccionId)

    const grupo = this.obtenerGrupo(tipo)
    const config = this.grupos[grupo]

    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casoId, true)

      const resultado = await manager
        .createQueryBuilder()
        .delete()
        .from(config.tabla)
        .where('casos_id = :casoId', { casoId })
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
    casoId: string
  ): Promise<{ message: string }> {
    return this.dataSource.transaction(async (manager) => {
      await this.verificarCaso(manager, casoId, true)

      let totalEliminados = 0

      for (const grupo of Object.keys(this.grupos) as Grupo[]) {
        const config = this.grupos[grupo]

        const resultado = await manager
          .createQueryBuilder()
          .delete()
          .from(config.tabla)
          .where('casos_id = :casoId', { casoId })
          .execute()

        totalEliminados += resultado.affected ?? 0
      }

      if (totalEliminados === 0) {
        throw new NotFoundException(
          `El caso ${casoId} no tiene selecciones para eliminar`
        )
      }

      return {
        message: 'Selecciones de la conclusión eliminadas correctamente',
      }
    })
  }
}