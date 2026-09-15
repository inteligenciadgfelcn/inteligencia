import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_SII } from '@/core/config/database/database.module'
import { Detenido } from '@/application/inteligencia/felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '@/application/inteligencia/felcn_sii/huella/entities/huella.entity'

@Injectable()
export class TarjetaProntuariaRepository {
  constructor(
    @InjectRepository(Detenido, DB_SII)
    private readonly detenidoRepository: Repository<Detenido>,

    @InjectRepository(Huella, DB_SII)
    private readonly huellaRepository: Repository<Huella>
  ) {}

  async obtenerDetenido(id: number) {
    return this.detenidoRepository
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.aliases', 'aliases')
      .leftJoinAndSelect('detenido.pais', 'pais')
      .leftJoinAndSelect('detenido.estadoCivil', 'estadoCivil')
      .leftJoinAndSelect('detenido.profesiones', 'profesiones')
      .leftJoinAndSelect('profesiones.idProfesion', 'profesion')
      .select([
        'detenido.idDetenido',
        'detenido.numeroCaso',
        'detenido.nombres',
        'detenido.apellidoPaterno',
        'detenido.apellidoMaterno',
        'detenido.fechaNacimiento',
        'detenido.direccion',
        'detenido.observaciones',
        'aliases',
        'pais',
        'estadoCivil',
        'profesiones',
        'profesion',
        'detenido.observacionHuella'
      ])
      .where('detenido.idDetenido = :id', { id })
      .getOne()
  }

  async obtenerFenotipo(id: number) {
    return this.detenidoRepository
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.fenotipo', 'fenotipo')
      .leftJoinAndSelect('fenotipo.colorPiel', 'colorPiel')
      .leftJoinAndSelect('fenotipo.colorCabello', 'colorCabello')
      .leftJoinAndSelect('fenotipo.tipoCabello', 'tipoCabello')
      .leftJoinAndSelect('fenotipo.colorOjos', 'colorOjos')
      .leftJoinAndSelect('fenotipo.tipoOjos', 'tipoOjos')
      .leftJoinAndSelect('fenotipo.tipoNariz', 'tipoNariz')
      .leftJoinAndSelect(
        'fenotipo.constitucionCorporal',
        'constitucionCorporal'
      )
      .select([
        'detenido.idDetenido',
        'fenotipo',
        'colorPiel',
        'colorCabello',
        'tipoCabello',
        'colorOjos',
        'tipoOjos',
        'tipoNariz',
        'constitucionCorporal',
      ])
      .where('detenido.idDetenido = :id', { id })
      .getOne()
  }

  async obtenerFamiliares(id: number) {
    return this.detenidoRepository
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.datosFamiliares', 'datosFamiliares')
      .leftJoinAndSelect('datosFamiliares.parentezco', 'parentezco')
      .select(['detenido.idDetenido', 'datosFamiliares', 'parentezco'])
      .where('detenido.idDetenido = :id', { id })
      .getOne()
  }

  async obtenerDocumentos(id: number) {
    const resultados = await this.detenidoRepository
      .createQueryBuilder('detenido')
      .leftJoin('detenido.documentos', 'documentos')
      .leftJoin('documentos.tipoDocumento', 'tipoDocumento')
      .select('documentos.numeroDocumento', 'numeroDocumento')
      .addSelect('tipoDocumento.descripcion', 'tipoDocumento')
      .where('detenido.idDetenido = :id', {
        id,
      })

      .getRawMany<{
        numeroDocumento: string | null

        tipoDocumento: string | null
      }>()

    return {
      documentos: resultados.map((documento) => ({
        numeroDocumento: documento.numeroDocumento ?? '',

        tipoDocumento: {
          descripcion: documento.tipoDocumento ?? '',
        },
      })),
    }
  }

  async obtenerNombresSupuestos(id: number) {
    return this.detenidoRepository
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.nombresSupuestos', 'nombresSupuestos')
      .select(['detenido.idDetenido', 'nombresSupuestos'])
      .where('detenido.idDetenido = :id', { id })
      .getOne()
  }

  async obtenerHuellas(id: number): Promise<
    Array<{
      idHuella: number
      dedo: string
      rutaArchivo: string
    }>
  > {
    const resultados = await this.huellaRepository
      .createQueryBuilder('huella')
      .select('huella.id_huella', 'id_huella')
      .addSelect('huella.dedo', 'dedo')
      .addSelect('huella.rutaArchivo', 'ruta_archivo')
      .where('huella.idPersona = :id', { id })
      .orderBy('huella.id_huella', 'ASC')
      .getRawMany<{
        id_huella: number
        dedo: string
        ruta_archivo: string
      }>()

    return resultados.map((resultado) => ({
      idHuella: Number(resultado.id_huella),
      dedo: resultado.dedo || '',
      rutaArchivo: resultado.ruta_archivo || '',
    }))
  }

  async obtenerFotografias(id: number) {
    return this.detenidoRepository
      .createQueryBuilder('detenido')
      .select([
        'detenido.idDetenido',
        'detenido.fotoFrente',
        'detenido.fotoPerfilDerecho',
        'detenido.fotoPerfilIzquierdo',
      ])
      .where('detenido.idDetenido = :id', { id })
      .getOne()
  }
}
