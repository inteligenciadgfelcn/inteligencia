import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateDepartamentoDto } from './dto/create-departamento.dto'
import { UpdateDepartamentoDto } from './dto/update-departamento.dto'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { Departamento } from './entities/departamento.entity'
import { Estado } from '@/application/felcn_siii/estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Pais } from '../pais/entities/pais.entity'

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly datasource: DataSource
  ) {}

  private get repo() {
    return this.datasource.getRepository(Departamento)
  }
  private get paisRepo() {
    return this.datasource.getRepository(Pais)
  }

  async create(dto: CreateDepartamentoDto): Promise<Departamento> {
    const pais = await this.paisRepo.findOne({
      where: {
        idPais: dto.idPais,
        estado: Estado.ACTIVO,
      },
    })

    if (!pais) {
      throw new BadRequestException('País no válido o inactivo')
    }
    const exists = await this.repo.findOne({
      where: {
        descripcion: dto.descripcion,
        pais: { idPais: dto.idPais },
      },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un departamento con ese código en el país'
      )
    }
    const departamento = this.repo.create({
      ...dto,
      pais,
    })

    return await this.repo.save(departamento)
  }

  async findAll(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination
    const query = this.repo
      .createQueryBuilder('departamento')
      .leftJoinAndSelect('departamento.pais', 'pais')
      .where('departamento.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('departamento.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    return await query.getManyAndCount()
  }

  async findAllGeneral(): Promise<Departamento[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['pais'],
      order: { descripcion: 'ASC' },
    })
  }

  async findAllPais(idPais?: number): Promise<Departamento[]> {
    return await this.repo.find({
      where: {
        estado: Estado.ACTIVO,
        ...(idPais && {
          pais: { idPais },
        }),
      },
      order: {
        descripcion: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<Departamento> {
    const departamento = await this.repo.findOne({
      where: {
        idDepartamento: id,
        estado: Estado.ACTIVO,
        pais: {
          estado: Estado.ACTIVO,
        },
      },
      relations: ['pais'],
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    return departamento
  }

  async update(id: number, dto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.repo.findOne({
      where: { idDepartamento: id, estado: Estado.ACTIVO },
      relations: ['pais'],
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    // Validar código único si cambia
    if (dto.descripcion && dto.descripcion !== departamento.descripcion) {
      const exists = await this.repo.findOne({
        where: {
          descripcion: dto.descripcion,
          pais: { idPais: departamento.pais.idPais },
        },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un departamento con ese código en el país'
        )
      }
    }

    // Cambiar país si lo envían
    if (dto.idPais !== undefined) {
      const pais = await this.paisRepo.findOne({
        where: { idPais: dto.idPais, estado: Estado.ACTIVO },
      })

      if (!pais) {
        throw new BadRequestException('País no válido o inactivo')
      }

      departamento.pais = pais
      delete dto.idPais
    }

    Object.assign(departamento, dto)

    return await this.repo.save(departamento)
  }

  async remove(id: number): Promise<Departamento> {
    const departamento = await this.repo.findOne({
      where: { idDepartamento: id, estado: Estado.ACTIVO },
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    departamento.estado = Estado.INACTIVO

    return await this.repo.save(departamento)
  }
}
