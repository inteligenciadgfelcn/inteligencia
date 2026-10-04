import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { ImplicadosBien } from '../entities/implicados_bien.entity'
import { CreateImplicadosBienDto } from '../dto/create-implicados_bien.dto'
import { UpdateImplicadosBienDto } from '../dto/update-implicados_bien.dto'

@Injectable()
export class ImplicadosBienLgiRepository {
  constructor(
    @InjectRepository(ImplicadosBien, DB_LGI)
    private readonly repository: Repository<ImplicadosBien>
  ) {}

  async create(
    dto: CreateImplicadosBienDto,
    usuario: string
  ): Promise<ImplicadosBien> {
    const implicado = this.repository.create({
      ...dto,
      estado: 'ACTIVO',
      usuario,
      fechaHoraIngreso: new Date(),
    })

    return this.repository.save(implicado)
  }

  async findAll(
    id_operativo?: string,
    idItemBien?: number
  ): Promise<ImplicadosBien[]> {
    const query = this.repository
      .createQueryBuilder('i')
      .where('i.estado = :estado', {
        estado: 'ACTIVO',
      })

    if (id_operativo !== undefined) {
      query.andWhere('i.operativoId = :operativoId', {
        operativoId: id_operativo,
      })
    }

    if (idItemBien !== undefined) {
      query.andWhere('i.idItemBien = :idItemBien', {
        idItemBien,
      })
    }

    return query
      .orderBy('i.fechaHoraIngreso', 'DESC')
      .addOrderBy('i.id', 'DESC')
      .getMany()
  }

  async findOne(id: string): Promise<ImplicadosBien | null> {
    return this.repository.findOne({
      where: {
        id,
        estado: 'ACTIVO',
      },
    })
  }

  async findByOperativo(
    operativoId: string
  ): Promise<ImplicadosBien[]> {
    return this.findAll(operativoId)
  }

  async update(
    id: string,
    dto: UpdateImplicadosBienDto,
    usuario: string
  ): Promise<ImplicadosBien | null> {
    return this.repository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(ImplicadosBien)

      const implicado = await repository.findOne({
        where: {
          id,
          estado: 'ACTIVO',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      })

      if (!implicado) {
        return null
      }

      repository.merge(implicado, dto, {
        estado: 'ACTIVO',
        usuarioActualizacion: usuario,
        fechaHoraActualizacion: new Date(),
      })

      return repository.save(implicado)
    })
  }

  async remove(
    id: string,
    usuario: string
  ): Promise<boolean> {
    const result = await this.repository.update(
      {
        id,
        estado: 'ACTIVO',
      },
      {
        estado: 'INACTIVO',
        usuarioActualizacion: usuario,
        fechaHoraActualizacion: new Date(),
      }
    )

    return (result.affected ?? 0) > 0
  }
}