import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Detenido } from '../filiacion/detenido/entities/detenido.entity'
import { DatosFamiliaresRepository } from './repository/datos_familiares.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CreateDatosFamiliaresDto } from './dto/create-datos_familiare.dto'
import { UpdateDatosFamiliaresDto } from './dto/update-datos_familiare.dto'

@Injectable()
export class DatosFamiliaresService {
  constructor(
    private readonly datosFamiliaresRepository: DatosFamiliaresRepository,

    @InjectRepository(Detenido, DB_SII)
    private readonly detenidoRepository: Repository<Detenido>
  ) {}

 async create(dto: CreateDatosFamiliaresDto) {
  const detenido = await this.detenidoRepository.findOne({
    where: { idDetenido: dto.idDetenido },
  })

  if (!detenido) {
    throw new BadRequestException('Detenido no válido o inactivo')
  }

  const familiar = this.datosFamiliaresRepository.create({
    ...dto,
    detenido: detenido,
  })

  await this.datosFamiliaresRepository.save(familiar) 

  return {
    message: 'Registrado correctamente',
  }
}

  async findAll(pagination: PaginacionQueryDto) {
    return await this.datosFamiliaresRepository.findAllPaginated(pagination)
  }

  async findByDetenido(idDetenido: number) {
    return await this.datosFamiliaresRepository.findByDetenido(idDetenido)
  }

  async findOne(id: number) {
    const familiar = await this.datosFamiliaresRepository.findActiveById(id)

    if (!familiar) {
      throw new NotFoundException('Familiar no encontrado')
    }

    return familiar
  }

  async update(id: number, dto: UpdateDatosFamiliaresDto) {
    const familiar = await this.datosFamiliaresRepository.findActiveById(id)

    if (!familiar) {
      throw new NotFoundException('Familiar no encontrado')
    }

    if (dto.idDetenido !== undefined) {
      const detenido = await this.detenidoRepository.findOne({
        where: { idDetenido: dto.idDetenido },
      })

      if (!detenido) {
        throw new BadRequestException('Detenido no válido o inactivo')
      }

      familiar.detenido = detenido
      delete dto.idDetenido
    }

    Object.assign(familiar, dto)

    return await this.datosFamiliaresRepository.save(familiar)
  }
}
