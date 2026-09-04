import { PaginacionQueryDto } from '@/common/dto'
import { DB_LGI } from '@/core/config/database/database.module'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { CreateSituacionJuridicaBienDto } from '../dto/create-situacion_juridica_bien.dto'
import { UpdateSituacionJuridicaBienDto } from '../dto/update-situacion_juridica_bien.dto'
import { SituacionJuridicaBien } from '../entities/situacion_juridica_bien.entity'

@Injectable()
export class SituacionJuridicaBienRepository {
  constructor(
    @InjectRepository(SituacionJuridicaBien, DB_LGI)
    private readonly repository: Repository<SituacionJuridicaBien>,

    @InjectRepository(BieneSecuestradoLgi, DB_LGI)
    private readonly bienesRepository: Repository<BieneSecuestradoLgi>
  ) {}

  async create(
    dto: CreateSituacionJuridicaBienDto
  ): Promise<SituacionJuridicaBien> {
    await this.verificarBien(dto.itembiensecId)

    const registro = this.repository.create({
      ...dto,
      itembiensecId: String(dto.itembiensecId),
      catjurId: String(dto.catjurId),
      fechaHoraIngreso: new Date(),
      estado: 'ACTIVO',
    })

    const resultado = await this.repository.save(registro)

    return this.findOne(resultado.itembienjurId)
  }

  async findAll(): Promise<SituacionJuridicaBien[]> {
    return this.repository.find({
      where: {
        estado: 'ACTIVO',
      },

      relations: {
        calidadBien: true,
      },

      order: {
        itembienjurId: 'DESC',
      },
    })
  }

  async findByBien(itembiensecId: number): Promise<SituacionJuridicaBien[]> {
    await this.verificarBien(itembiensecId)

    return this.repository.find({
      where: {
        itembiensecId: String(itembiensecId),
        estado: 'ACTIVO',
      },

      relations: {
        calidadBien: true,
      },

      order: {
        itembienjurId: 'ASC',
      },
    })
  }

  async findOne(id: number | string): Promise<SituacionJuridicaBien> {
    const registro = await this.repository.findOne({
      where: {
        itembienjurId: String(id),
        estado: 'ACTIVO',
      },

      relations: {
        calidadBien: true,
      },
    })

    if (!registro) {
      throw new NotFoundException(
        `No existe la situación jurídica con ID ${id}`
      )
    }

    return registro
  }

  async update(
    id: number,
    dto: UpdateSituacionJuridicaBienDto
  ): Promise<SituacionJuridicaBien> {
    const registro = await this.findOne(id)

    if (dto.itembiensecId !== undefined) {
      await this.verificarBien(dto.itembiensecId)

      registro.itembiensecId = String(dto.itembiensecId)
    }

    if (dto.catjurId !== undefined) {
      registro.catjurId = String(dto.catjurId)
    }

    if (dto.descripcion !== undefined) {
      registro.descripcion = dto.descripcion
    }

    const auditoria = dto as UpdateSituacionJuridicaBienDto & {
      usuario?: string
    }

    if (auditoria.usuario) {
      registro.usuario = auditoria.usuario
    }

    const resultado = await this.repository.save(registro)

    return this.findOne(resultado.itembienjurId)
  }

  async remove(id: number): Promise<void> {
    const registro = await this.findOne(id)

    await this.repository.update(
      {
        itembienjurId: registro.itembienjurId,
      },
      {
        estado: 'INACTIVO',
      }
    )
  }

  private async verificarBien(itembiensecId: number): Promise<void> {
    const existe = await this.bienesRepository.exists({
      where: {
        itembiensecId: String(itembiensecId),
        estado: 'ACTIVO',
      },
    })

    if (!existe) {
      throw new NotFoundException(
        `No existe el bien secuestrado con ID ${itembiensecId}`
      )
    }
  }
}
