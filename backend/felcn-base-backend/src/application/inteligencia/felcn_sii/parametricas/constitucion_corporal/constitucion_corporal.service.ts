import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConstitucionCorporal } from './entities/constitucion_corporal.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { DB_SII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConstitucionCorporalDto } from './dto/create-constitucion-corporal.dto';
import { UpdateConstitucionCorporalDto } from './dto/update-constitucion-corporal.dto';

@Injectable()
export class ConstitucionCorporalService {
  constructor(
      @InjectRepository(ConstitucionCorporal, DB_SII)
      private readonly constitucionCorporalRepository: Repository<ConstitucionCorporal>
    ) {}
  
    async create(dto: CreateConstitucionCorporalDto){
      const exists = await this.constitucionCorporalRepository.findOne({
        where: { descripcion: dto.descripcion },
      })
  
      if (exists) {
        throw new BadRequestException(
          'Ya existe constitucion corporal con esa descripcion'
        )
      }
  
      const data = this.constitucionCorporalRepository.create(dto)
      return await this.constitucionCorporalRepository.save(data)
    }
  
    async findAllPaginado(pagination: PaginacionQueryDto) {
      const { limite, saltar, filtro, sentido } = pagination
  
      const query = this.constitucionCorporalRepository
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
  
    async findAll() {
      return this.constitucionCorporalRepository.find()
    }
  
    async findOne(id: number) {
      const data = await this.constitucionCorporalRepository.findOne({
        where: { idConstitucionCorporal: id },
      })
  
      if (!data) {
        throw new NotFoundException('Constitucion corporal no encontrada')
      }
      return data
    }
  
    async update(id: number, dto: UpdateConstitucionCorporalDto) {
      const data = await this.constitucionCorporalRepository.findOne({
        where: { idConstitucionCorporal: id },
      })
  
      if (!data) {
        throw new NotFoundException('Constitucion corporal no encontrada')
      }
  
      if (dto.descripcion !== data.descripcion) {
        const exists = await this.constitucionCorporalRepository.findOne({
          where: { descripcion: dto.descripcion },
        })
  
        if (exists) {
          throw new BadRequestException(
            'Ya existe constitucion corporal con esa descripcion'
          )
        }
      }
      Object.assign(data, dto)
      return await this.constitucionCorporalRepository.save(data)
    }
}
