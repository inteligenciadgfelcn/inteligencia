import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DB_SII, DB_SIII } from '@/core/config/database/database.module'
import { PersonasRepository } from './repository/personas.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Profesion } from '../parametricas/profesion/entities/profesion.entity'
import { FiliacionRepository } from './repository/filiacion.repository'
import { mapArrestadoEntity } from './mappers/arrestado.mapper'
import { FenotipoDetenido } from './fenotipo_detenido/entities/fenotipo_detenido.entity'
import { mapFenotipoDtoToEntity } from './fenotipo_detenido/mappers/fenotipo-mapper'
import { ProfesionDetenido } from './profesion_detenido/entities/profesion_detenido.entity'
import { Detenido } from './detenido/entities/detenido.entity'
import { mapDetenidoEntity } from './mappers/detenido.mapper'
import { ArrestadoAuxiliar } from '../../felcn_siii/operaciones/filiacion/arrestado_auxiliar/entities/arrestado_auxiliar.entity'
import { DetenidoAuxiliar } from '@/application/sunesis/siii/seguimiento/personas/entity/detenido-auxiliar.entity'
import { mapDetenidoAuxiliarEntity } from './mappers/detenido-auxiliar.mapper'

@Injectable()
export class FiliacionService {
  constructor(
    @InjectDataSource(DB_SII)
    private dataSource: DataSource,

    @InjectRepository(Profesion, DB_SII)
    private profesionRepository: Repository<Profesion>,

    @InjectDataSource(DB_SIII)
    private dataSourceSIII: DataSource,

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
      let detenidoAuxiliar: DetenidoAuxiliar | null = null

      // ===== CREAR ARRESTADO =====
      if (dto.estadoPersona === 'Arrestado') {
        const arrestadoData = mapArrestadoEntity(dto, profesionDescripcion)

        arrestado = await this.dataSourceSIII
          .getRepository(ArrestadoAuxiliar)
          .save(arrestadoData)
      }

   
      // ===== CREAR DETENIDO AUXILIAR EN SIII =====
      if (
        dto.estadoPersona ===
          'Principal Aprehendido' ||
        dto.estadoPersona === 'Aprehendido' ||
        dto.estadoPersona ===
          'LGI O Perdida de Dominio'
      ) {
        if (
          dto.arrestado?.idOperativo === null ||
          dto.arrestado?.idOperativo === undefined
        ) {
          throw new BadRequestException(
            'El idOperativo es obligatorio para registrar al aprehendido',
          )
        }

        if (
          dto.idPais === null ||
          dto.idPais === undefined
        ) {
          throw new BadRequestException(
            'El idPais es obligatorio para registrar al aprehendido',
          )
        }

        const detenidoAuxiliarRepository =
          this.dataSourceSIII.getRepository(
            DetenidoAuxiliar,
          )

        const detenidoAuxiliarData =
          mapDetenidoAuxiliarEntity(dto)

        detenidoAuxiliar =
          await detenidoAuxiliarRepository.save(
            detenidoAuxiliarRepository.create(
              detenidoAuxiliarData,
            ),
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

      try {
        await this.dataSourceSIII.query(
          `UPDATE public.persona_auxiliar 
   SET enviado = 1 
   WHERE id_persona_auxiliar = $1`,
          [dto.idPersona]
        )
      } catch (error) {
        console.error('Error actualizando persona_auxiliar:', error)
      }

      return {
        message: 'Filiación registrada correctamente',
        idDetenido: detenido!.idDetenido,
        idArrestado: arrestado?.idArrestadoAuxiliar ?? null,
      }
    })
  }

  async obtenerPersonasPorCaso(
    nroCaso: string,
    pagination: PaginacionQueryDto
  ) {
    const [filas, total] = await this.personasRepository.obtenerPersonasPorCaso(
      nroCaso,
      pagination
    )

    const detenidos = await this.dataSource
      .getRepository(Detenido)
      .createQueryBuilder('d')
      .select([
        'd.id_detenido AS id_detenido',
        'd.numero_caso AS numero_caso',
        'd.nombres AS nombres',
      ])
      .where('TRIM(d.numero_caso) = :caso', { caso: nroCaso.trim() })
      .getRawMany()

    const mapa = new Map(
      detenidos.map((d) => [
        `${d.numero_caso?.trim()}-${d.nombres?.trim()}`,
        d.id_detenido,
      ])
    )

    const resultado = filas.map((f) => ({
      ...f,
      id_detenido:
        mapa.get(`${f.numero_caso?.trim()}-${f.nombres?.trim()}`) ?? null,
    }))

    return [resultado, total] as [any[], number]
  }

  async obtenerPersona(id: number) {
    const persona = await this.personasRepository.obtenerPersona(id)

    if (!persona) {
      throw new NotFoundException('No existe esa persona')
    }

    return persona
  }

  async obtenerDetenido(id: number) {
    const detenido = await this.filiacionRepository.obtenerDetenido(id)

    if (!detenido) {
      throw new NotFoundException('Detenido no encontrado')
    }

    return detenido
  }
}
