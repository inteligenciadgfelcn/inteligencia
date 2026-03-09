import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorPielDto } from './dto/create-color_piel.dto';
import { UpdateColorPielDto } from './dto/update-color_piel.dto';
import { ColorPiel } from './entities/color_piel.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { DB_SIII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColorPielService {

   constructor(
      @InjectRepository(ColorPiel, DB_SIII)
      private readonly colorPielRepository: Repository<ColorPiel>
    ) {}

 async create(dto: CreateColorPielDto): Promise<ColorPiel> {
     const exists = await this.colorPielRepository.findOne({
       where: { descripcion: dto.descripcion },
     })
 
     if (exists) {
       throw new BadRequestException(
         'Ya existe un color de piel con esa descripcion'
       )
     }
 
     const data = this.colorPielRepository.create(dto)
     return await this.colorPielRepository.save(data)
   }
 
   async findAllPaginado(pagination: PaginacionQueryDto) {
     const { limite, saltar, filtro, sentido } = pagination
 
     const query = this.colorPielRepository
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
 
   async findAll(): Promise<ColorPiel[]> {
     return this.colorPielRepository.find()
   }
 
   async findOne(id: number): Promise<ColorPiel> {
     const data = await this.colorPielRepository.findOne({
       where: { idColorPiel: id },
     })
 
     if (!data) {
       throw new NotFoundException('Color de piel no encontrada')
     }
     return data
   }
 
   async update(id: number, dto: UpdateColorPielDto) {
     const data = await this.colorPielRepository.findOne({
       where: { idColorPiel: id },
     })
 
     if (!data) {
       throw new NotFoundException('color de piel no encontrada')
     }
 
     if (dto.descripcion !== data.descripcion) {
       const exists = await this.colorPielRepository.findOne({
         where: { descripcion: dto.descripcion },
       })
 
       if (exists) {
         throw new BadRequestException(
           'Ya existe un color de piel con esa descripcion'
         )
       }
     }
     Object.assign(data, dto)
     return await this.colorPielRepository.save(data)
   }
}
