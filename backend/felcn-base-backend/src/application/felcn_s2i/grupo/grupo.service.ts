import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateGrupoDto } from './dto/create-grupo.dto'
import { UpdateGrupoDto } from './dto/update-grupo.dto'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_S2I } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'
import { Grupo } from './entities/grupo.entity'
import { Estado } from '../estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class GrupoService {
  constructor(
    @InjectDataSource(DB_S2I)
    private readonly datasource: DataSource
  ) {}

  async create(dto: CreateGrupoDto): Promise<Grupo> {
    const distrital = await this.datasource.getRepository('distrital').findOne({
      where: { idDistrital: dto.idDistrital, estado: Estado.ACTIVO },
    })

    if (!distrital) {
      throw new BadRequestException('Distrital no válida o inactiva')
    }

    const exists = await this.datasource.getRepository('grupo').findOne({
      where: {
        descripcion: dto.descripcion,
        distrital: { idDistrital: dto.idDistrital },
      },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un grupo con esa descripción en el distrito'
      )
    }

    const grupo = this.datasource.getRepository('grupo').create({
      descripcion: dto.descripcion,
      distrital: distrital,
    })

    return await this.datasource.getRepository<Grupo>('grupo').save(grupo)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination
    const query = this.datasource
      .getRepository('grupo')
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.distrital', 'distrital')
      .where('grupo.estado = :estado', {
        estado: Estado.ACTIVO,
      })

    if (filtro) {
      query.andWhere('(grupo.descripcion ILIKE :filtro )', {
        filtro: `%${filtro}%`,
      })
    }
    return await query.getManyAndCount()
  }

  async findAllDistrito(idDistrital?: number): Promise<Grupo[]> {
    return this.datasource.getRepository(Grupo).find({
      where: {
        estado: Estado.ACTIVO,
        ...(idDistrital ? { distrital: { idDistrital } } : {}),
      },
      relations: ['distrital'],
    })
  }

  async findAllGeneral(): Promise<Grupo[]> {
    return this.datasource.getRepository<Grupo>('grupo').find({
      where: { estado: Estado.ACTIVO },
      relations: ['distrital'],
      order: { descripcion: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.datasource.getRepository(Grupo).findOne({
      where: {
        idGrupo: id,
        estado: Estado.ACTIVO,
      },
      relations: ['distrital', 'distrital.unidad'],
    })
    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado')
    }
    return grupo
  }

  async update(id: number, dto: UpdateGrupoDto): Promise<Grupo> {
    const grupo = await this.datasource.getRepository('grupo').findOne({
      where: { idGrupo: id, estado: Estado.ACTIVO },
      relations: ['distrital'],
    })

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado')
    }

    // Validar cambio de descripción
    if (dto.descripcion && dto.descripcion !== grupo.descripcion) {
      const exists = await this.datasource.getRepository('grupo').findOne({
        where: {
          descripcion: dto.descripcion,
          distrital: { id: grupo.distrital.id },
        },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un grupo con esa descripción en el distrito'
        )
      }
    }

    if (dto.idDistrital !== undefined) {
      const distrito = await this.datasource
        .getRepository('distrital')
        .findOne({
          where: { idDistrital: dto.idDistrital, estado: Estado.ACTIVO },
        })

      if (!distrito) {
        throw new BadRequestException('Distrital no válida o inactiva')
      }

      grupo.distrital = distrito
      delete dto.idDistrital
    }

    Object.assign(grupo, dto)

    return await this.datasource.getRepository<Grupo>('grupo').save(grupo)
  }

  async remove(id: number): Promise<Grupo> {
    const grupo = await this.datasource.getRepository('grupo').findOne({
      where: { idGrupo: id, estado: Estado.ACTIVO },
    })

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado')
    }

    grupo.estado = Estado.INACTIVO

    return await this.datasource.getRepository<Grupo>('grupo').save(grupo)
  }
}
