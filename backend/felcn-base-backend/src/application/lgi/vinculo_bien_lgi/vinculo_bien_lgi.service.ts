import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateVinculoBienLgiDto } from './dto/create-vinculo_bien_lgi.dto'
import { UpdateVinculoBienLgiDto } from './dto/update-vinculo_bien_lgi.dto'
import { VinculoBienLgi } from './entities/vinculo_bien_lgi.entity'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class VinculoBienLgiService {
   constructor(
    @InjectRepository(VinculoBienLgi, DB_LGI)
    private readonly repository: Repository<VinculoBienLgi>
  ) {}
  async create(dto: CreateVinculoBienLgiDto): Promise<VinculoBienLgi> {
    const vinculo = this.repository.create({
      idDetenidoAuxiliar: dto.idDetenidoAuxiliar,
      idVinculo: dto.idVinculo,
      idTipoVinculo: dto.idTipoVinculo,
      idItemBienSecuestrado: dto.idItemBienSecuestrado,
      fechaHoraIngreso: new Date(),
    })

    return this.repository.save(vinculo)
  }

  async findAll(): Promise<VinculoBienLgi[]> {
    return this.repository.find({
      where: {
        estado: 'ACTIVO',
      },
      order: {
        idVinculoBien: 'DESC',
      },
    })
  }

  async findOne(id: string): Promise<VinculoBienLgi> {
    this.validarId(id)

    const vinculo = await this.repository.findOne({
      where: {
        idVinculoBien: id,
        estado: 'ACTIVO',
      },
    })

    if (!vinculo) {
      throw new NotFoundException(
        `No existe un vínculo de bien activo con ID ${id}`
      )
    }

    return vinculo
  }

  async update(id: string, dto: UpdateVinculoBienLgiDto): Promise<VinculoBienLgi> {
    const vinculo = await this.findOne(id)

    this.repository.merge(vinculo, {
      idDetenidoAuxiliar: dto.idDetenidoAuxiliar,
      idVinculo: dto.idVinculo,
      idTipoVinculo: dto.idTipoVinculo,
      idItemBienSecuestrado: dto.idItemBienSecuestrado,
      fechaHoraActualizacion: new Date(),
    })

    return this.repository.save(vinculo)
  }

  async remove(id: string): Promise<{
    mensaje: string
    idVinculoBien: string
  }> {
    const vinculo = await this.findOne(id)

    vinculo.estado = 'INACTIVO'
    vinculo.fechaHoraActualizacion = new Date()

    await this.repository.save(vinculo)

    return {
      mensaje: 'Vínculo de bien eliminado correctamente',
      idVinculoBien: id,
    }
  }

  private validarId(id: string): void {
    if (!/^[1-9]\d*$/.test(id) || BigInt(id) > BigInt('9223372036854775807')) {
      throw new BadRequestException(
        'El ID debe ser un entero positivo válido de tipo bigint'
      )
    }
  }
}
