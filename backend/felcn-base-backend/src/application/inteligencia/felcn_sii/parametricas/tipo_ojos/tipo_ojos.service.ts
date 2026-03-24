import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoOjoDto } from './dto/create-tipo_ojo.dto';
import { UpdateTipoOjoDto } from './dto/update-tipo_ojo.dto';
import { TipoOjo } from './entities/tipo_ojo.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { DB_SIII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoOjosService {
 constructor(
     @InjectRepository(TipoOjo, DB_SIII)
     private readonly tipoOjoRepository: Repository<TipoOjo>
   ) {}
 
   async create(dto: CreateTipoOjoDto): Promise<TipoOjo> {
     const exists = await this.tipoOjoRepository.findOne({
       where: { descripcion: dto.descripcion },
     })
 
     if (exists) {
       throw new BadRequestException(
         'Ya existe un tipo de ojos con esa descripcion'
       )
     }
 
     const data = this.tipoOjoRepository.create(dto)
     return await this.tipoOjoRepository.save(data)
   }
 
   async findAllPaginado(pagination: PaginacionQueryDto) {
     const { limite, saltar, filtro, sentido } = pagination
 
     const query = this.tipoOjoRepository
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
 
   async findAll(): Promise<TipoOjo[]> {
     return this.tipoOjoRepository.find()
   }
 
   async findOne(id: number): Promise<TipoOjo> {
     const data = await this.tipoOjoRepository.findOne({
       where: { idTipoOjos: id },
     })
 
     if (!data) {
       throw new NotFoundException('Tipo de ojos no encontrada')
     }
     return data
   }
 
   async update(id: number, dto: UpdateTipoOjoDto) {
     const data = await this.tipoOjoRepository.findOne({
       where: { idTipoOjos: id },
     })
 
     if (!data) {
       throw new NotFoundException('Tipo de ojos no encontrada')
     }
 
     if (dto.descripcion !== data.descripcion) {
       const exists = await this.tipoOjoRepository.findOne({
         where: { descripcion: dto.descripcion },
       })
 
       if (exists) {
         throw new BadRequestException(
           'Ya existe un tipo de ojos con esa descripcion'
         )
       }
     }
     Object.assign(data, dto)
     return await this.tipoOjoRepository.save(data)
   }
}
