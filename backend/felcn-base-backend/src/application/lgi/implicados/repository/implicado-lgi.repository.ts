import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CreateImplicadoLgiDto } from '../dto/create-implicado.dto'
import { UpdateImplicadoLgiDto } from '../dto/update-implicado.dto'
import { ImplicadoLgi } from '../entities/implicado.entity'

@Injectable()
export class ImplicadoLgiRepository {
  constructor(
    @InjectRepository(ImplicadoLgi, DB_LGI)
    private readonly repository: Repository<ImplicadoLgi>
  ) {}

  async create(
    dto: CreateImplicadoLgiDto,
    usuario: string
  ): Promise<ImplicadoLgi> {
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
    empresaId?: number
  ): Promise<ImplicadoLgi[]> {
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

    if (empresaId !== undefined) {
      query.andWhere('i.empresaId = :empresaId', {
        empresaId,
      })
    }

    return query
      .orderBy('i.fechaHoraIngreso', 'DESC')
      .addOrderBy('i.id', 'DESC')
      .getMany()
  }

  async findOne(id: string): Promise<ImplicadoLgi | null> {
    return this.repository.findOne({
      where: {
        id,
        estado: 'ACTIVO',
      },
    })
  }

  async findByOperativo(
    operativoId: string
  ): Promise<ImplicadoLgi[]> {
    return this.findAll(operativoId)
  }

  async update(
    id: string,
    dto: UpdateImplicadoLgiDto,
    usuario: string
  ): Promise<ImplicadoLgi | null> {
    return this.repository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(ImplicadoLgi)

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