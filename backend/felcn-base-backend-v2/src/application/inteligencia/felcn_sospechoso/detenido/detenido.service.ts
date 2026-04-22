import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateDetenidoDto } from './dto/create-detenido.dto'
import { UpdateDetenidoDto } from './dto/update-detenido.dto'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Detenido } from './entities/detenido.entity'

@Injectable()
export class DetenidoService {
  constructor(
    @InjectRepository(Detenido, DB_SOSPECHOSO)
    private readonly detenidoRepository: Repository<Detenido>
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

    const detenido = this.detenidoRepository.create({
      ...dto,
    })

    return await this.detenidoRepository.save(detenido)
  }

  findAll() {
    return `This action returns all detenido`
  }

  findOne(id: number) {
    return `This action returns a #${id} detenido`
  }

  update(id: number, updateDetenidoDto: UpdateDetenidoDto) {
    return `This action updates a #${id} detenido`
  }

  remove(id: number) {
    return `This action removes a #${id} detenido`
  }
}
