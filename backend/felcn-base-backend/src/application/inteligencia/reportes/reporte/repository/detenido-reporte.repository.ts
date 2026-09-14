import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_SII } from '@/core/config/database/database.module'
import { Detenido } from '../../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../../felcn_sii/huella/entities/huella.entity'

@Injectable()
export class DetenidoReporteRepository {
  constructor(
    @InjectRepository(Detenido, DB_SII)
    private readonly detenidoRepository:
      Repository<Detenido>,

    @InjectRepository(Huella, DB_SII)
    private readonly huellaRepository:
      Repository<Huella>
  ) {}

  async obtenerDetenido(
    idDetenido: number
  ): Promise<Detenido | null> {
    return this.detenidoRepository.findOne({
      where: {
        idDetenido,
      },

      select: {
        idDetenido: true,
        numeroCaso: true,
        nombres: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        apellidoEsposo: true,
        fechaNacimiento: true,
        direccion: true,
        estaVivo: true,
        tieneTarjeta: true,
        fechaHoraIngreso: true,
      },

      relations: {
        pais: true,
        estadoCivil: true,
        aliases: true,

        documentos: {
          tipoDocumento: true,
        },

        fenotipo: {
          tipoNariz: true,
          constitucionCorporal: true,
          colorPiel: true,
          colorCabello: true,
          tipoCabello: true,
          colorOjos: true,
          tipoOjos: true,
        },

        profesiones: {
          idProfesion: true,
        },

        datosFamiliares: {
          parentezco: true,
        },

        nombresSupuestos: true,
      },
    })
  }

  async obtenerHuellas(
    idDetenido: number
  ): Promise<any[]> {
    return this.huellaRepository
      .createQueryBuilder('huella')
      .select([
        'huella.id_huella AS id_huella',
        'huella.dedo AS dedo',
        'huella.calidad AS calidad',
        `huella.ruta_archivo
          AS ruta_archivo`,
      ])
      .where(
        'huella.id_persona = :idDetenido',
        { idDetenido }
      )
      .orderBy(
        'huella.id_huella',
        'ASC'
      )
      .getRawMany()
  }
}