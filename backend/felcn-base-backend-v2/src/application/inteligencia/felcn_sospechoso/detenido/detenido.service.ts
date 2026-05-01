import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateDetenidoDto } from './dto/create-detenido.dto'
import { UpdateDetenidoDto } from './dto/update-detenido.dto'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DetenidoSospechoso } from './entities/detenido-sospechoso.entity'
import { PaginacionQueryDto } from '@/common/dto'
import { DetenidoSospechosoRepository } from './repository/detenido.repository'
import { formatearFecha } from '@/common/utils/date.util'

@Injectable()
export class DetenidoSospechosoService {
  constructor(
    @InjectRepository(DetenidoSospechoso, DB_SOSPECHOSO)
    private readonly detenidoRepository: Repository<DetenidoSospechoso>,

    private readonly detenidoRepo: DetenidoSospechosoRepository
  ) {}

  async create(dto: CreateDetenidoDto) {
    if (dto.numeroDocumento && dto.idOperativo) {
      const exists = await this.detenidoRepository.findOne({
        where: {
          numeroDocumento: dto.numeroDocumento,
          idOperativo: dto.idOperativo,
        },
      })

      if (exists) {
        throw new BadRequestException(
          'Este detenido ya fue registrado en este operativo'
        )
      }
    }

    const detenido = this.detenidoRepository.create(dto)
    return this.detenidoRepository.save(detenido)
  }

  async findAllPaginado(
    pagination: PaginacionQueryDto,
    idOperativo?: number
  ): Promise<[any[], number]> {
    const [data, total] = await this.detenidoRepo.findAllPaginado(
      pagination,
      idOperativo
    )

    const resultado = data.map((d) => this.mapDetenido(d))
    return [resultado, total]
  }

  async findOne(id: number) {
    const d = await this.detenidoRepository.findOne({
      where: { idDetenido: id },
      relations: ['estado', 'pais', 'tipoDocumento'],
    })

    if (!d) {
      throw new NotFoundException('Detenido no encontrado')
    }

    return this.mapDetenido(d)
  }

  async update(id: number, dto: UpdateDetenidoDto) {
    return this.detenidoRepo.updateDetenido(id, dto)
  }

  async remove(id: number) {
    await this.detenidoRepository.delete(id)
    return { mensaje: 'Eliminado correctamente' }
  }

  private mapDetenido(d: DetenidoSospechoso) {
    const clean = (v?: string) => (v ? v.trim().replace(/\s+/g, ' ') : '')

    return {
      idDetenido: d.idDetenido,
      idOperativo: d.idOperativo,

      nombreCompleto: [
        clean(d.nombres),
        clean(d.apellidoPaterno),
        clean(d.apellidoMaterno),
        clean(d.apellidoEsposo),
      ]
        .filter((v) => v && v !== '*')
        .join(' '),

      numeroDocumento: clean(d.numeroDocumento),

      genero: d.genero === null ? null : d.genero ? 'MASCULINO' : 'FEMENINO',

      idEstado: d.idEstado,
      estado: d.estado?.descripcion ?? null,
      tipoDocumento: d.tipoDocumento?.descripcion ?? null,
      idTipoDocumento: d.idTipoDocumento,
      pais: d.pais?.descripcion ?? null,
      idPais: d.idPais,

      fechaCreacion: formatearFecha(d.fechaCreacion),
    }
  }
}
