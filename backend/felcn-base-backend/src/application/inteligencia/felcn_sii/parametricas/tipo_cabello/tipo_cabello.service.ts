import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoCabelloDto } from './dto/create-tipo_cabello.dto';
import { UpdateTipoCabelloDto } from './dto/update-tipo_cabello.dto';
import { TipoCabello } from './entities/tipo_cabello.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { DB_SIII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoCabelloService {
  constructor(
     @InjectRepository(TipoCabello, DB_SIII)
     private readonly tipoCabelloRepository: Repository<TipoCabello>
   ) {}
 
   async create(dto: CreateTipoCabelloDto): Promise<TipoCabello> {
     const exists = await this.tipoCabelloRepository.findOne({
       where: { descripcion: dto.descripcion },
     })
 
     if (exists) {
       throw new BadRequestException(
         'Ya existe un tipo de cabello con esa descripcion'
       )
     }
 
     const data = this.tipoCabelloRepository.create(dto)
     return await this.tipoCabelloRepository.save(data)
   }
 
   async findAllPaginado(pagination: PaginacionQueryDto) {
     const { limite, saltar, filtro, sentido } = pagination
 
     const query = this.tipoCabelloRepository
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
 
   async findAll(): Promise<TipoCabello[]> {
     return this.tipoCabelloRepository.find()
   }
 
   async findOne(id: number): Promise<TipoCabello> {
     const data = await this.tipoCabelloRepository.findOne({
       where: { idTipoCabello: id },
     })
 
     if (!data) {
       throw new NotFoundException('Tipo de cabello no encontrada')
     }
     return data
   }
 
   async update(id: number, dto: UpdateTipoCabelloDto) {
     const data = await this.tipoCabelloRepository.findOne({
       where: { idTipoCabello: id },
     })
 
     if (!data) {
       throw new NotFoundException('Tipo de cabello no encontrada')
     }
 
     if (dto.descripcion !== data.descripcion) {
       const exists = await this.tipoCabelloRepository.findOne({
         where: { descripcion: dto.descripcion },
       })
 
       if (exists) {
         throw new BadRequestException(
           'Ya existe un tipo de cabello con esa descripcion'
         )
       }
     }
     Object.assign(data, dto)
     return await this.tipoCabelloRepository.save(data)
   }
}
