import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateNombresSupuestoDto } from './dto/create-nombres_supuesto.dto'
import { UpdateNombresSupuestoDto } from './dto/update-nombres_supuesto.dto'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Detenido } from '../filiacion/detenido/entities/detenido.entity'
import { NombresSupuesto } from './entities/nombres_supuesto.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
@Injectable()
export class NombresSupuestosService {
  constructor(
    @InjectRepository(NombresSupuesto, DB_SII)
    private readonly nombresSupuestosRepository: Repository<NombresSupuesto>,

    @InjectRepository(Detenido, DB_SII)
    private readonly detenidoRepository: Repository<Detenido>
  ) {}
  async create(dto: CreateNombresSupuestoDto) {
    const detenido = await this.detenidoRepository.findOne({
      where: { idDetenido: dto.idDetenido },
    })

    if (!detenido) {
      throw new BadRequestException('Detenido no válido o inactivo')
    }

    const nombreSupuesto = this.nombresSupuestosRepository.create({
      ...dto,
      detenido,
    })

    await this.nombresSupuestosRepository.save(nombreSupuesto)

    return {
      message: 'Registrado correctamente',
    }
  }

  async findAll(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination

    const query = this.nombresSupuestosRepository
      .createQueryBuilder('df')
      .leftJoin('df.detenido', 'detenido')
      .addSelect([
        'detenido.id_detenido',
        'detenido.nombres',
        'detenido.apellido_paterno',
        'detenido.apellido_materno',
      ])
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        `(df.nombres ILIKE :filtro OR df.paterno ILIKE :filtro OR df.materno ILIKE :filtro)`,
        { filtro: `%${filtro}%` }
      )
    }

    return await query.getManyAndCount()
  }

  async findByDetenido(idDetenido: number) {
    return this.nombresSupuestosRepository.find({
      where: {
        detenido: { idDetenido },
      },
    })
  }

  async findOne(id: number) {
    const nombreSupuesto = await this.nombresSupuestosRepository.findOne({
      where: {
        idNombresSupuestos: id,
      },
      relations: ['detenido'],
    })

    if (!nombreSupuesto) {
      throw new NotFoundException('Registro no encontrado')
    }

    return nombreSupuesto
  }

  async update(id: number, dto: UpdateNombresSupuestoDto) {
    const nombreSupuesto = await this.nombresSupuestosRepository.findOne({
      where: {
        idNombresSupuestos: id,
      },
      relations: ['detenido'],
    })

    if (!nombreSupuesto) {
      throw new NotFoundException('Registro no encontrado')
    }

    if (dto.idDetenido !== undefined) {
      const detenido = await this.detenidoRepository.findOne({
        where: { idDetenido: dto.idDetenido },
      })

      if (!detenido) {
        throw new BadRequestException('Detenido no válido o inactivo')
      }

      nombreSupuesto.detenido = detenido
      delete dto.idDetenido
    }

    Object.assign(nombreSupuesto, dto)

    return await this.nombresSupuestosRepository.save(nombreSupuesto)
  }
}
