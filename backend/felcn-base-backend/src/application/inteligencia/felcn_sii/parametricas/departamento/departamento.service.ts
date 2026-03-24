import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateDepartamentoDto } from './dto/create-departamento.dto'
import { UpdateDepartamentoDto } from './dto/update-departamento.dto'
import { InjectRepository } from '@nestjs/typeorm'
import {  Repository } from 'typeorm'
import { DB_SII } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import { Departamento } from './entities/departamento.entity'
import { Pais } from '@/application/inteligencia/felcn_sii/parametricas/pais/entities/pais.entity'

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento, DB_SII)
    private readonly departamentoRepository: Repository<Departamento>,

    @InjectRepository(Pais, DB_SII)
    private readonly paisRepository: Repository<Pais>
  ) {}

  async create(dto: CreateDepartamentoDto): Promise<Departamento> {
    const pais = await this.paisRepository.findOne({
      where: {
        idPais: dto.idPais,
        estado: Estado.ACTIVO,
      },
    })

    if (!pais) {
      throw new BadRequestException('País no válido o inactivo')
    }
    const exists = await this.departamentoRepository.findOne({
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
    const departamento = this.departamentoRepository.create({
      ...dto,
      pais,
    })

    return await this.departamentoRepository.save(departamento)
  }

  async findAll(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination
    const query = this.departamentoRepository
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
    return this.departamentoRepository.find({
      where: { estado: Estado.ACTIVO },
      relations: ['pais'],
      order: { descripcion: 'ASC' },
    })
  }

  async findAllPais(idPais?: number): Promise<Departamento[]> {
    return await this.departamentoRepository.find({
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
    const departamento = await this.departamentoRepository.findOne({
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
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: id, estado: Estado.ACTIVO },
      relations: ['pais'],
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    // Validar código único si cambia
    if (dto.descripcion && dto.descripcion !== departamento.descripcion) {
      const exists = await this.departamentoRepository.findOne({
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
      const pais = await this.paisRepository.findOne({
        where: { idPais: dto.idPais, estado: Estado.ACTIVO },
      })

      if (!pais) {
        throw new BadRequestException('País no válido o inactivo')
      }

      departamento.pais = pais
      delete dto.idPais
    }

    Object.assign(departamento, dto)

    return await this.departamentoRepository.save(departamento)
  }

  async remove(id: number): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: id, estado: Estado.ACTIVO },
    })

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado')
    }

    departamento.estado = Estado.INACTIVO

    return await this.departamentoRepository.save(departamento)
  }
}
