import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Huella } from './entities/huella.entity';
import { DB_SII } from '@/core/config/database/database.module';

@Injectable()
export class HuellaService {
  constructor(
    @InjectRepository(Huella,DB_SII)
    private repo: Repository<Huella>,
  ) {}

  async guardar(data: any) {
    const huella = this.repo.create(data);
    return this.repo.save(huella);
  }

  async obtenerPorPersona(idPersona: number) {
  return this.repo.find({
    where: { idPersona },
    order: { fecha: 'ASC' },
  });
}

async obtenerUno(id: number) {
  return this.repo.findOne({
    where: { id },
  });
}
}