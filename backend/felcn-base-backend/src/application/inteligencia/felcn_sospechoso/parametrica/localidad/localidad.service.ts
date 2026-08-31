import { Injectable } from '@nestjs/common';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localidad } from './entities/localidad.entity';

@Injectable()
export class LocalidadService {
constructor(
  @InjectRepository(Localidad, DB_SOSPECHOSO)
    private readonly localidadRepository: Repository<Localidad>,
   ) {}

  async findByProvincia(idProvincia: number) {
  const data = await this.localidadRepository.find({
    where: { idProvincia },
    relations: ['provincia', 'provincia.departamento'],
    order: { descripcion: 'ASC' },
  })

  return data.map((l) => ({
    ...l,
    descripcion: l.descripcion.replace(/"/g, '').trim(),
  }))
}

}
