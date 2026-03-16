import { Injectable } from '@nestjs/common'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { UpdateFiliacionDto } from './dto/update-filiacion.dto'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { PersonasRepository } from './repository/personas.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { ArrestadoAuxiliar } from './arrestado_auxiliar/entities/arrestado_auxiliar.entity'
import { Profesion } from '../../parametricas/profesion/entities/profesion.entity'
import { FiliacionRepository } from './repository/filiacion.repository'
import { mapArrestadoEntity } from './mappers/arrestado.mapper'
import { FenotipoDetenido } from './fenotipo_detenido/entities/fenotipo_detenido.entity'
import { mapFenotipoDtoToEntity } from './fenotipo_detenido/mappers/fenotipo-mapper'
import { ProfesionDetenido } from './profesion_detenido/entities/profesion_detenido.entity'
import { Detenido } from './detenido/entities/detenido.entity'
import { mapDetenidoEntity } from './mappers/detenido.mapper'

@Injectable()
export class FiliacionService {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource,
    @InjectRepository(Profesion, DB_SIII)
    private profesionRepository: Repository<Profesion>,
    private readonly personasRepository: PersonasRepository,
    private readonly filiacionRepository: FiliacionRepository
  ) {}

  async create(dto: CreateFiliacionDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      let profesionDescripcion: string | null = null
      if (dto.profesion?.idProfesion) {
        const profesion = await this.profesionRepository.findOne({
          where: { idProfesion: dto.profesion.idProfesion },
          select: ['descripcion'],
        })

        profesionDescripcion = profesion?.descripcion ?? null
      }

      let arrestado: ArrestadoAuxiliar | null = null
      let detenido: Detenido | null = null

      // ===== CREAR ARRESTADO =====
      if (dto.estadoPersona === 'Arrestado') {
        const arrestadoData = mapArrestadoEntity(dto, profesionDescripcion)

        arrestado = await manager.save(
          ArrestadoAuxiliar,
          manager.create(ArrestadoAuxiliar, arrestadoData)
        )
      }

      // ===== CREAR DETENIDO =====
      const detenidoData = mapDetenidoEntity(dto)

      detenido = await manager.save(
        Detenido,
        manager.create(Detenido, detenidoData)
      )

      if (!detenido) {
        throw new Error('No se pudo crear el detenido')
      }

      const operations: Promise<unknown>[] = []

      // ===== ALIAS =====
      if (dto.alias) {
        operations.push(
          this.filiacionRepository.crearAlias(manager, dto.alias, detenido)
        )
      }

      // ===== DOCUMENTO =====
      if (dto.documento) {
        operations.push(
          this.filiacionRepository.crearDocumento(
            manager,
            dto.documento,
            detenido
          )
        )
      }

      // ===== FENOTIPO =====
      if (dto.fenotipo) {
        operations.push(
          manager.save(
            FenotipoDetenido,
            mapFenotipoDtoToEntity(dto.fenotipo, detenido!)
          )
        )
      }

      // ===== PROFESION =====
      if (dto.profesion?.idProfesion) {
        operations.push(
          manager.save(
            ProfesionDetenido,
            manager.create(ProfesionDetenido, {
              detenido: detenido!,
              idProfesion: { idProfesion: dto.profesion.idProfesion },
            })
          )
        )
      }

      await Promise.all(operations)

      await manager.update(
        'persona_auxiliar',
        { id_persona_auxiliar: dto.idPersona },
        { enviado: 1 }
      )

      return {
        message: 'Filiación registrada correctamente',
        idDetenido: detenido!.idDetenido,
        idArrestado: arrestado?.idArrestadoAuxiliar ?? null,
      }
    })
  }

  obtenerPersonasPorCaso(
    nroCaso: string,
    filiado: number,
    pagination: PaginacionQueryDto
  ) {
    return this.personasRepository.obtenerPersonasPorCaso(
      nroCaso,
      filiado,
      pagination
    )
  }

  async obtenerPersona(id: number) {
  return this.personasRepository.obtenerPersona(id)
}

  
}
