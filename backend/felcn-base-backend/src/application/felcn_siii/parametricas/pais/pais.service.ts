import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreatePaisDto } from './dto/create-pais.dto'
import { UpdatePaisDto } from './dto/update-pais.dto'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'
import { Pais } from './entities/pais.entity'
import { Estado } from '@/application/felcn_siii/estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Continente } from '../continente/entities/continente.entity'

@Injectable()
export class PaisService {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly datasource: DataSource
  ) {}

  private get repo() {
    return this.datasource.getRepository(Pais)
  }
  private get continenteRepo() {
    return this.datasource.getRepository(Continente)
  }

  async create(dto: CreatePaisDto): Promise<Pais> {
    const exists = await this.repo.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException('Ya existe un país con ese código')
    }

    // Validar continente
    const continente = await this.continenteRepo.findOne({
      where: {
        idContinente: dto.idContinente,
        estado: Estado.ACTIVO,
      },
    })

    if (!continente) {
      throw new BadRequestException('Continente no válido o inactivo')
    }

    const pais = this.repo.create({
      ...dto,
      continente,
    })

    return await this.repo.save(pais)
  }

  async findAllContinente(idContinente: number): Promise<Pais[]> {
    return await this.repo.find({
      where: {
        estado: Estado.ACTIVO,
        continente: {
          idContinente,
        },
      },
      relations: ['continente'], // opcional
      order: {
        descripcion: 'ASC',
      },
    })
  }

  async findAllGeneral(): Promise<Pais[]> {
    return await this.repo.find({
      where: {
        estado: Estado.ACTIVO,
      },
      relations: ['continente'],
    })
  }

  async findAll(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination
    const query = this.repo
      .createQueryBuilder('pais')
      .leftJoinAndSelect('pais.continente', 'continente')
      .where('pais.estado = :estado', { estado: Estado.ACTIVO })
      .take(limite)
      .skip(saltar)
    if (filtro) {
      query.andWhere('pais.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    query.orderBy('pais.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
    return await query.getManyAndCount()
  }

  async findOne(id: number): Promise<Pais> {
    const pais = await this.repo.findOne({
      where: { idPais: id },
      relations: ['continente'],
    })

    if (!pais) {
      throw new NotFoundException('País no encontrado')
    }

    return pais
  }

  async update(id: number, dto: UpdatePaisDto): Promise<Pais> {
    const pais = await this.repo.findOne({
      where: { idPais: id, estado: Estado.ACTIVO },
      relations: ['continente'],
    })

    if (!pais) {
      throw new NotFoundException('País no encontrado')
    }

    // Validar código único si lo están actualizando
    if (dto.descripcion && dto.descripcion !== pais.descripcion) {
      const exists = await this.repo.findOne({
        where: { descripcion: dto.descripcion },
      })

      if (exists) {
        throw new BadRequestException('Ya existe un país con esa descripcion')
      }
    }

    // Validar continente si lo envían
    if (dto.idContinente !== undefined) {
      const continente = await this.continenteRepo.findOne({
        where: { idContinente: dto.idContinente, estado: Estado.ACTIVO },
      })

      if (!continente) {
        throw new BadRequestException('Continente no válido o inactivo')
      }

      pais.continente = continente
      delete dto.idContinente
    }

    Object.assign(pais, dto)

    return await this.repo.save(pais)
  }

  async remove(id: number): Promise<Pais> {
    const pais = await this.repo.findOne({
      where: {
        idPais: id,
        estado: Estado.ACTIVO,
      },
    })

    if (!pais) {
      throw new NotFoundException('País no encontrado')
    }

    pais.estado = Estado.INACTIVO

    return await this.repo.save(pais)
  }
}
