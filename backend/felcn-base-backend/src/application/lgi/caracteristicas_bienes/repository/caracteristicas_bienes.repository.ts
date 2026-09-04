import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'

import { CreateCaracteristicasBieneDto } from '../dto/create-caracteristicas_biene.dto'
import { UpdateCaracteristicasBieneDto } from '../dto/update-caracteristicas_biene.dto'
import { CaracteristicasBiene } from '../entities/caracteristicas_biene.entity'

@Injectable()
export class CaracteristicasBienesRepository {
  constructor(
    @InjectRepository(CaracteristicasBiene, DB_LGI)
    private readonly repository: Repository<CaracteristicasBiene>,

    @InjectRepository(BieneSecuestradoLgi, DB_LGI)
    private readonly bienesRepository: Repository<BieneSecuestradoLgi>
  ) {}

  private queryConRelaciones(): SelectQueryBuilder<CaracteristicasBiene> {
    return this.repository
      .createQueryBuilder('caracteristica')
      .leftJoinAndSelect('caracteristica.bienSecuestrado', 'bien')
      .leftJoinAndSelect('bien.categoriaTipo', 'categoriaTipo')
      .leftJoinAndSelect('bien.tipoVinculo', 'tipoVinculo')
      .where('UPPER(TRIM(caracteristica.estado)) = :estado', {
        estado: 'ACTIVO',
      })
  }

  async create(
    createDto: CreateCaracteristicasBieneDto
  ): Promise<CaracteristicasBiene> {
    await this.verificarBien(createDto.itembiensecId)
    const caracteristica = this.repository.create({
      ...createDto,
      itembiensecId: createDto.itembiensecId,
      catcaracId: createDto.catcaracId,
      fechaHoraIngreso: new Date(),
    })

    return this.repository.save(caracteristica)
  }

  async findAll(): Promise<CaracteristicasBiene[]> {
    return this.repository.find({
      where: {
        estado: 'ACTIVO',
      },

      relations: {
        bienSecuestrado: {
          operativo: true,
          categoriaTipo: true,
          tipoVinculo: true,
        },
      },

      order: {
        itembiencarId: 'DESC',
      },
    })
  }

  async findByBien(itembiensecId: number): Promise<CaracteristicasBiene[]> {
    await this.verificarBien(itembiensecId)

    return this.repository.find({
      where: {
        itembiensecId: itembiensecId,

        estado: 'ACTIVO',
      },

      relations: {
        catalogoCaracteristica: true,
      },

      order: {
        itembiencarId: 'ASC',
      },
    })
  }

  async findOne(id: number | string): Promise<CaracteristicasBiene> {
    const caracteristica = await this.queryConRelaciones()
      .andWhere('caracteristica.itembiencarId = :id', {
        id: String(id),
      })
      .getOne()

    if (!caracteristica) {
      throw new NotFoundException(
        `No existe una característica activa con ID ${id}`
      )
    }

    return caracteristica
  }

  async update(
    id: number,
    updateDto: UpdateCaracteristicasBieneDto
  ): Promise<CaracteristicasBiene> {
    const caracteristica = await this.findOne(id)

    if (updateDto.itembiensecId !== undefined) {
      await this.verificarBien(updateDto.itembiensecId)

      caracteristica.itembiensecId = updateDto.itembiensecId
    }

    if (updateDto.catcaracId !== undefined) {
      caracteristica.catcaracId = updateDto.catcaracId
    }

    if (updateDto.descripcion !== undefined) {
      caracteristica.descripcion = updateDto.descripcion
    }

    const datosAuditoria = updateDto as UpdateCaracteristicasBieneDto & {
      usuario?: string
    }

    if (datosAuditoria.usuario) {
      caracteristica.usuario = datosAuditoria.usuario
    }

    return this.repository.save(caracteristica)
  }

  async remove(id: number): Promise<void> {
    const caracteristica = await this.findOne(id)

    caracteristica.estado = 'INACTIVO'

    await this.repository.save(caracteristica)
  }

  private async verificarBien(itembiensecId: number): Promise<void> {
    const existe = await this.bienesRepository.exists({
      where: {
        itembiensecId: String(itembiensecId),
      },
    })

    if (!existe) {
      throw new NotFoundException(
        `No existe el bien secuestrado con ID ${itembiensecId}`
      )
    }
  }
}
