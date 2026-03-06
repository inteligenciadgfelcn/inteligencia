import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateGrupoDto } from './dto/create-grupo.dto'
import { UpdateGrupoDto } from './dto/update-grupo.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { Grupo } from './entities/grupo.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '../../estado.enum'
import { Repository } from 'typeorm'
import { Distrital } from '../distrital/entities/distrital.entity'

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo, DB_SIII)
    private readonly grupoRepository: Repository<Grupo>,

    @InjectRepository(Distrital, DB_SIII)
    private readonly distritalRepository: Repository<Distrital>
  ) {}

  async create(dto: CreateGrupoDto): Promise<Grupo> {
    const distrital = await this.distritalRepository.findOne({
      where: { idDistrital: dto.idDistrital, estado: Estado.ACTIVO },
    })

    if (!distrital) {
      throw new BadRequestException('Distrital no válida o inactiva')
    }

    const exists = await this.grupoRepository.findOne({
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

    const grupo = this.grupoRepository.create({
      descripcion: dto.descripcion,
      distrital: distrital,
    })

    return await this.grupoRepository.save(grupo)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination
    const query = this.grupoRepository
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
    return this.grupoRepository.find({
      where: {
        estado: Estado.ACTIVO,
        ...(idDistrital ? { distrital: { idDistrital } } : {}),
      },
      relations: ['distrital'],
    })
  }

  async findAllGeneral(): Promise<Grupo[]> {
    return this.grupoRepository.find({
      where: { estado: Estado.ACTIVO },
      relations: ['distrital'],
      order: { descripcion: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
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
    const grupo = await this.grupoRepository.findOne({
      where: { idGrupo: id, estado: Estado.ACTIVO },
      relations: ['distrital'],
    })

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado')
    }

    // Validar cambio de descripción
    if (dto.descripcion && dto.descripcion !== grupo.descripcion) {
      const exists = await this.grupoRepository.findOne({
        where: {
          descripcion: dto.descripcion,
          distrital: { idDistrital: grupo.distrital.idDistrital },
        },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un grupo con esa descripción en el distrito'
        )
      }
    }

    if (dto.idDistrital !== undefined) {
      const distrito = await this.distritalRepository.findOne({
        where: { idDistrital: dto.idDistrital, estado: Estado.ACTIVO },
      })

      if (!distrito) {
        throw new BadRequestException('Distrital no válida o inactiva')
      }

      grupo.distrital = distrito
      delete dto.idDistrital
    }

    Object.assign(grupo, dto)

    return await this.grupoRepository.save(grupo)
  }

  async remove(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { idGrupo: id, estado: Estado.ACTIVO },
    })

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado')
    }

    grupo.estado = Estado.INACTIVO

    return await this.grupoRepository.save(grupo)
  }
}
