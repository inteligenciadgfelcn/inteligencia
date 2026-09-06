import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, DeepPartial, Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { formatearFechaBolivia } from '@/common/utils/date.util'

import { CreateBienesSecuestradoDto } from '../dto/create-bienes_secuestrado.dto'
import { UpdateBieneSecuestradoLgiDto } from '../dto/update-bienes_secuestrado.dto'
import { BieneSecuestradoLgi } from '../entities/bienes_secuestrado.entity'
import { FotoBienLgi } from '../../foto_bienes/entities/foto_biene.entity'

@Injectable()
export class BienSecuestradoLgiRepository {
  constructor(
    @InjectRepository(BieneSecuestradoLgi, DB_LGI)
    private readonly repository: Repository<BieneSecuestradoLgi>,

    @InjectRepository(FotoBienLgi, DB_LGI)
    private readonly fotoRepository: Repository<FotoBienLgi>
  ) {}

  async create(
    dto: CreateBienesSecuestradoDto,
    archivos: Express.Multer.File[]
  ): Promise<any> {
    const { fotografias, ...datosBien } = dto

    const datosAuditoria = dto as CreateBienesSecuestradoDto & {
      usuario?: string
    }

    if (!datosAuditoria.usuario) {
      throw new UnauthorizedException(
        'No se pudo obtener el usuario autenticado'
      )
    }

    const id = await this.repository.manager.transaction(async (manager) => {
      const bienRepository = manager.getRepository(BieneSecuestradoLgi)

      const fotoRepository = manager.getRepository(FotoBienLgi)

      const item = bienRepository.create({
        ...datosBien,

        usuario: datosAuditoria.usuario,

        fechaHoraIngreso: new Date(),

        estado: 'ACTIVO',
      } as DeepPartial<BieneSecuestradoLgi>)

      const bienGuardado = await bienRepository.save(item)

      if (archivos?.length) {
        const registrosFotografias = archivos.map((archivo) =>
          fotoRepository.create({
            itembiensecId: bienGuardado.itembiensecId,

            fotografia: archivo.buffer,

            descripcion: archivo.originalname.substring(0, 75),

            estado: 'ACTIVO',
          })
        )

        await fotoRepository.save(registrosFotografias)
      }

      return bienGuardado.itembiensecId
    })

    return this.findOne(Number(id))
  }

  findAll(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.repository.find({
      where: {
        opId,
        estado: 'ACTIVO',
      },

      relations: {
        operativo: true,
        categoriaTipo: true,
        tipoVinculo: true,
        caracteristicas: true,
      },

      order: {
        itembiensecId: 'DESC',
      },
    })
  }

  async findAllPaginado(
    opId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('bien')
      .leftJoinAndSelect('bien.operativo', 'operativo')
      .leftJoinAndSelect('bien.categoriaTipo', 'categoriaTipo')
      .leftJoinAndSelect('bien.tipoVinculo', 'tipoVinculo')
      .leftJoinAndSelect(
        'bien.caracteristicas',
        'caracteristicas',
        `
          caracteristicas.estado =
          :estadoCaracteristica
        `,
        {
          estadoCaracteristica: 'ACTIVO',
        }
      )
      .where('bien.opId = :opId', {
        opId,
      })
      .andWhere('bien.estado = :estadoBien', {
        estadoBien: 'ACTIVO',
      })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            `
            bien.lugarSecuestro
            ILIKE :filtro
          `,
            {
              filtro: valor,
            }
          )
            .orWhere(
              `
              bien.nombreCompletoVinculo
              ILIKE :filtro
            `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
              bien.cedulaIdentidadVinculo
              ILIKE :filtro
            `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
              categoriaTipo.descripcion
              ILIKE :filtro
            `,
              {
                filtro: valor,
              }
            )
            .orWhere(
              `
              tipoVinculo.descripcion
              ILIKE :filtro
            `,
              {
                filtro: valor,
              }
            )
        })
      )
    }

    query.orderBy('bien.itembiensecId', 'DESC').take(limite).skip(saltar)

    const [bienes, total] = await query.getManyAndCount()

    if (!bienes.length) {
      return [[], total]
    }

    const idsBienes = bienes.map((bien) => Number(bien.itembiensecId))

    const ultimasSituaciones = await this.obtenerUltimasSituaciones(idsBienes)

    const mapaSituaciones = new Map<number, any>(
      ultimasSituaciones.map((situacion) => [
        Number(situacion.itembiensecId),
        situacion,
      ])
    )

    const resultado = bienes.map((bien) => ({
      ...bien,

      ultimaSituacionJuridica:
        mapaSituaciones.get(Number(bien.itembiensecId)) ?? null,
    }))

    return [resultado, total]
  }

  async findOne(id: number): Promise<any> {
    const item = await this.buscarEntidad(id)

    const [fotografias, situacionesJuridicas] = await Promise.all([
      this.fotoRepository.find({
        where: {
          itembiensecId: String(id),

          estado: 'ACTIVO',
        },

        order: {
          fotobienId: 'ASC',
        },
      }),

      this.obtenerSituacionesPorBien(id),
    ])

    const fotografiasBase64 = fotografias.map((foto) => {
      const { fotografia, ...datosFotografia } = foto

      const base64 = fotografia
        ? Buffer.from(fotografia).toString('base64')
        : null

      const tipoMime = this.obtenerTipoMime(foto.descripcion)

      return {
        ...datosFotografia,

        fotografiaBase64: base64,

        fotografiaDataUrl: base64 ? `data:${tipoMime};base64,${base64}` : null,
      }
    })

    const caracteristicasActivas =
      item.caracteristicas?.filter(
        (caracteristica) => caracteristica.estado === 'ACTIVO'
      ) ?? []

    return {
      ...item,

      fechaHoraIngreso: formatearFechaBolivia(item.fechaHoraIngreso),

      caracteristicas: caracteristicasActivas,

      fotografias: fotografiasBase64,

      ultimaSituacionJuridica: situacionesJuridicas[0] ?? null,

      situacionesJuridicas,
    }
  }

  findAllByOperativo(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.repository.find({
      where: {
        opId,
        estado: 'ACTIVO',
      },

      relations: {
        operativo: true,
        categoriaTipo: true,
        tipoVinculo: true,
        caracteristicas: true,
      },

      order: {
        itembiensecId: 'DESC',
      },
    })
  }

  async update(id: number, dto: UpdateBieneSecuestradoLgiDto): Promise<any> {
    const item = await this.buscarEntidad(id)

    const { fotografias, ...datos } = dto

    this.repository.merge(item, datos as DeepPartial<BieneSecuestradoLgi>)

    await this.repository.save(item)

    return this.findOne(id)
  }

  async guardarFotografias(
    itembiensecId: number,
    archivos: Express.Multer.File[]
  ): Promise<FotoBienLgi[]> {
    await this.buscarEntidad(itembiensecId)

    if (!archivos?.length) {
      return []
    }

    const fotografias = archivos.map((archivo) =>
      this.fotoRepository.create({
        itembiensecId: String(itembiensecId),

        fotografia: archivo.buffer,

        descripcion: archivo.originalname.substring(0, 75),

        estado: 'ACTIVO',
      })
    )

    return this.fotoRepository.save(fotografias)
  }

  async findFotografias(itembiensecId: number): Promise<FotoBienLgi[]> {
    await this.buscarEntidad(itembiensecId)

    return this.fotoRepository.find({
      where: {
        itembiensecId: String(itembiensecId),

        estado: 'ACTIVO',
      },

      order: {
        fotobienId: 'ASC',
      },
    })
  }

  async inactivarFotografia(fotoId: number): Promise<void> {
    const fotografia = await this.fotoRepository.findOne({
      where: {
        fotobienId: String(fotoId),

        estado: 'ACTIVO',
      },
    })

    if (!fotografia) {
      throw new NotFoundException(
        `No existe una fotografía activa con id ${fotoId}`
      )
    }

    fotografia.estado = 'INACTIVO'

    await this.fotoRepository.save(fotografia)
  }

  async inactivar(id: number): Promise<void> {
    const item = await this.buscarEntidad(id)

    await this.repository.manager.transaction(async (manager) => {
      await manager.update(
        BieneSecuestradoLgi,
        {
          itembiensecId: item.itembiensecId,
        },
        {
          estado: 'INACTIVO',
        }
      )

      await manager.update(
        FotoBienLgi,
        {
          itembiensecId: item.itembiensecId,

          estado: 'ACTIVO',
        },
        {
          estado: 'INACTIVO',
        }
      )
    })
  }

  private async buscarEntidad(id: number): Promise<BieneSecuestradoLgi> {
    const item = await this.repository.findOne({
      where: {
        itembiensecId: String(id),

        estado: 'ACTIVO',
      },

      relations: {
        operativo: true,
        categoriaTipo: true,
        tipoVinculo: true,
        caracteristicas: true,
      },
    })

    if (!item) {
      throw new NotFoundException(`No existe el bien secuestrado con id ${id}`)
    }

    return item
  }

  private async obtenerUltimasSituaciones(idsBienes: number[]): Promise<any[]> {
    if (!idsBienes.length) {
      return []
    }

    const registros = await this.repository.manager.query(
      `
        SELECT DISTINCT ON (
          situacion.itembiensec_id
        )
          situacion.itembiensec_id
            AS "itembiensecId",

          situacion.id_registro
            AS "idRegistro",

          situacion.id_tipo
            AS "idTipoSituacionLegalBien",

          situacion.descripcion_tipo
            AS "descripcionTipo",

          situacion.tabla,

          situacion.fecha_situacion
            AS "fechaSituacion",

          situacion.fecha_hora_ingreso
            AS "fechaHoraIngreso"

        FROM (
          SELECT
            sec.itembiensec_id,
            sec.bsec_id
              AS id_registro,
            1
              AS id_tipo,
            'Secuestrado'
              AS descripcion_tipo,
            'bienessecuestados'
              AS tabla,
            sec.fechaactsec
              AS fecha_situacion,
            sec.fechahoraing
              AS fecha_hora_ingreso

          FROM bienessecuestados sec

          WHERE sec.itembiensec_id =
            ANY($1::bigint[])

          UNION ALL

          SELECT
            inc.itembiensec_id,
            inc.binc_id
              AS id_registro,
            2
              AS id_tipo,
            'Incautado'
              AS descripcion_tipo,
            'bienesincautados'
              AS tabla,
            inc.fechares
              AS fecha_situacion,
            inc.fechahoraing
              AS fecha_hora_ingreso

          FROM bienesincautados inc

          WHERE inc.itembiensec_id =
            ANY($1::bigint[])

          UNION ALL

          SELECT
            con.itembiensec_id,
            con.bconf_id
              AS id_registro,
            3
              AS id_tipo,
            'Confiscado/Decomisado'
              AS descripcion_tipo,
            'bienesconfiscados'
              AS tabla,
            con.fechasenjud
              AS fecha_situacion,
            con.fechahoraing
              AS fecha_hora_ingreso

          FROM bienesconfiscados con

          WHERE con.itembiensec_id =
            ANY($1::bigint[])

          UNION ALL

          SELECT
            sit.itembiensec_id,
            sit.sitb_id
              AS id_registro,
            4
              AS id_tipo,
            'Entrega a DIRCABI'
              AS descripcion_tipo,
            'situacionbienes'
              AS tabla,
            COALESCE(
              sit.fechaent,
              sit.fechareq
            )
              AS fecha_situacion,
            sit.fechahoraing
              AS fecha_hora_ingreso

          FROM situacionbienes sit

          WHERE sit.itembiensec_id =
            ANY($1::bigint[])
        ) situacion

        ORDER BY
          situacion.itembiensec_id,
          situacion.fecha_situacion DESC,
          situacion.fecha_hora_ingreso DESC,
          situacion.id_registro DESC
      `,
      [idsBienes]
    )

    return registros
  }

  private async obtenerSituacionesPorBien(
    itembiensecId: number
  ): Promise<any[]> {
    const registros = await this.repository.manager.query(
      `
        SELECT
          situacion.itembiensec_id
            AS "itembiensecId",

          situacion.id_registro
            AS "idRegistro",

          situacion.id_tipo
            AS "idTipoSituacionLegalBien",

          situacion.descripcion_tipo
            AS "descripcionTipo",

          situacion.tabla,

          situacion.fecha_situacion
            AS "fechaSituacion",

          situacion.fecha_hora_ingreso
            AS "fechaHoraIngreso",

          situacion.datos

        FROM (
          SELECT
            sec.itembiensec_id,

            sec.bsec_id
              AS id_registro,

            1
              AS id_tipo,

            'Secuestrado'
              AS descripcion_tipo,

            'bienessecuestados'
              AS tabla,

            sec.fechaactsec
              AS fecha_situacion,

            sec.fechahoraing
              AS fecha_hora_ingreso,

            jsonb_build_object(
              'bsecId',
                sec.bsec_id,

              'itemBienSecId',
                sec.itembiensec_id,

              'fiscal',
                sec.fiscal,

              'fechaActaSecuestro',
                sec.fechaactsec,

              'investigador',
                sec.investigador,

              'usuario',
                sec.usuario
            )
              AS datos

          FROM bienessecuestados sec

          WHERE sec.itembiensec_id =
            $1

          UNION ALL

          SELECT
            inc.itembiensec_id,

            inc.binc_id
              AS id_registro,

            2
              AS id_tipo,

            'Incautado'
              AS descripcion_tipo,

            'bienesincautados'
              AS tabla,

            inc.fechares
              AS fecha_situacion,

            inc.fechahoraing
              AS fecha_hora_ingreso,

            jsonb_build_object(
              'bincId',
                inc.binc_id,

              'itemBienSecId',
                inc.itembiensec_id,

              'nroResol',
                inc.nroresol,

              'fechaResolucion',
                inc.fechares,

              'autoridad',
                inc.autoridad,

              'usuario',
                inc.usuario
            )
              AS datos

          FROM bienesincautados inc

          WHERE inc.itembiensec_id =
            $1

          UNION ALL

          SELECT
            con.itembiensec_id,

            con.bconf_id
              AS id_registro,

            3
              AS id_tipo,

            'Confiscado/Decomisado'
              AS descripcion_tipo,

            'bienesconfiscados'
              AS tabla,

            con.fechasenjud
              AS fecha_situacion,

            con.fechahoraing
              AS fecha_hora_ingreso,

            jsonb_build_object(
              'bconfId',
                con.bconf_id,

              'itemBienSecId',
                con.itembiensec_id,

              'numSentJud',
                con.numsentjud,

              'fechaSenjud',
                con.fechasenjud,

              'autoridad',
                con.autoridad,

              'usuario',
                con.usuario
            )
              AS datos

          FROM bienesconfiscados con

          WHERE con.itembiensec_id =
            $1

          UNION ALL

          SELECT
            sit.itembiensec_id,

            sit.sitb_id
              AS id_registro,

            4
              AS id_tipo,

            'Entrega a DIRCABI'
              AS descripcion_tipo,

            'situacionbienes'
              AS tabla,

            COALESCE(
              sit.fechaent,
              sit.fechareq
            )
              AS fecha_situacion,

            sit.fechahoraing
              AS fecha_hora_ingreso,

            jsonb_build_object(
              'sitbId',
                sit.sitb_id,

              'itemBienSecId',
                sit.itembiensec_id,

              'fechaRequerimiento',
                sit.fechareq,

              'fiscalRequirente',
                sit.fisreq,

              'calbId',
                sit.calb_id,

              'fechaEntrega',
                sit.fechaent,

              'responsableEntrega',
                sit.responsablee,

              'responsableRecepcion',
                sit.responsabler,

              'institucion',
                sit.institucion,

              'ubicacion',
                sit.ubicacion,

              'usuario',
                sit.usuario
            )
              AS datos

          FROM situacionbienes sit

          WHERE sit.itembiensec_id =
            $1
        ) situacion

        ORDER BY
          situacion.fecha_situacion
            DESC,

          situacion.fecha_hora_ingreso
            DESC,

          situacion.id_registro
            DESC
      `,
      [itembiensecId]
    )

    return registros
  }

  private obtenerTipoMime(nombre?: string | null): string {
    const extension = nombre?.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'png':
        return 'image/png'

      case 'webp':
        return 'image/webp'

      case 'gif':
        return 'image/gif'

      case 'bmp':
        return 'image/bmp'

      case 'jpg':
      case 'jpeg':
      default:
        return 'image/jpeg'
    }
  }
}
