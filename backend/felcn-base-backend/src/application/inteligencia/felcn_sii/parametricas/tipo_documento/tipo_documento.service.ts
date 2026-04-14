import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto'
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoDocumento } from './entities/tipo_documento.entity'

@Injectable()
export class TipoDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento, DB_SII)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>
  ) {}

  async create(dto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
    const exists = await this.tipoDocumentoRepository.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un tipo de documento con esa descripcion'
      )
    }

    const data = this.tipoDocumentoRepository.create(dto)
    return await this.tipoDocumentoRepository.save(data)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.tipoDocumentoRepository
      .createQueryBuilder('c')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('c.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    query.orderBy('c.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
    return await query.getManyAndCount()
  }

  async findAll(): Promise<TipoDocumento[]> {
    return this.tipoDocumentoRepository.find()
  }

  async findOne(id: number): Promise<TipoDocumento> {
    const data = await this.tipoDocumentoRepository.findOne({
      where: { idTipoDocumento: id },
    })

    if (!data) {
      throw new NotFoundException('Tipo de documento no encontrada')
    }
    return data
  }

  async update(id: number, dto: UpdateTipoDocumentoDto) {
    const data = await this.tipoDocumentoRepository.findOne({
      where: { idTipoDocumento: id },
    })

    if (!data) {
      throw new NotFoundException('Tipo de documento no encontrada')
    }

    if (dto.descripcion !== data.descripcion) {
      const exists = await this.tipoDocumentoRepository.findOne({
        where: { descripcion: dto.descripcion },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un tipo de documento con esa descripcion'
        )
      }
    }
    Object.assign(data, dto)
    return await this.tipoDocumentoRepository.save(data)
  }
}
