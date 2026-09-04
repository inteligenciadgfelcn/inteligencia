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
        situacionesJuridicas: true,
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
      .leftJoinAndSelect(
        'bien.situacionesJuridicas',
        'situacionesJuridicas',
        `
            situacionesJuridicas.estado =
            :estadoSituacion
          `,
        {
          estadoSituacion: 'ACTIVO',
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

    const [data, total] = await query
      .orderBy('bien.itembiensecId', 'DESC')
      .take(Number(limite))
      .skip(Number(saltar))
      .getManyAndCount()

    const resultado = data.map((item) => ({
      ...item,

      fecha: formatearFechaBolivia(item.fecha),

      fechaHoraIngreso: formatearFechaBolivia(item.fechaHoraIngreso),
    }))

    return [resultado, total]
  }

  async findOne(id: number): Promise<any> {
    const item = await this.buscarEntidad(id)

    return {
      ...item,

      fecha: formatearFechaBolivia(item.fecha),

      fechaHoraIngreso: formatearFechaBolivia(item.fechaHoraIngreso),
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
        situacionesJuridicas: true,
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
        situacionesJuridicas: true,
      },
    })

    if (!item) {
      throw new NotFoundException(`No existe el bien secuestrado con id ${id}`)
    }

    return item
  }
}
