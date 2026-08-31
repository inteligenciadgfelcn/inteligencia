import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import { Detenido } from '../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../felcn_sii/huella/entities/huella.entity'
import { DB_SII } from '@/core/config/database/database.module'

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Detenido, DB_SII)
    private readonly repoDetenido: Repository<Detenido>,

    @InjectRepository(Huella, DB_SII)
    private readonly huellaRepository: Repository<Huella>
  ) {}

  async GenerarPDF(id: number) {
    const [
      detenido,
      fenotipoData,
      familiaresData,
      documentosData,
      nombresData,
      huellas,
    ] = await Promise.all([
      this.obtenerDetenido(id),
      this.obtenerFenotipo(id),
      this.obtenerFamiliares(id),
      this.obtenerDocumentos(id),
      this.obtenerNombresSupuestos(id),
      this.obtenerHuellas(id),
    ])

    const huellasProcesadas = await Promise.all(
      huellas.map(async (h) => ({
        dedo: h.dedo,
        imagen: await this.imagenBase64Optimizada(h.rutaArchivo),
      }))
    )

    const manoDerecha: Record<string, string> = {}
    const manoIzquierda: Record<string, string> = {}

    for (const h of huellasProcesadas) {
      if (h.dedo?.includes('Derecho')) {
        manoDerecha[h.dedo] = h.imagen
      } else {
        manoIzquierda[h.dedo] = h.imagen
      }
    }

    const [fotoFrontal, fotoPerfil, fotoPerfilIzquierdo] = await Promise.all([
      this.bufferToBase64Optimizado(detenido?.fotoFrente),

      this.bufferToBase64Optimizado(detenido?.fotoPerfilDerecho),

      this.bufferToBase64Optimizado(detenido?.fotoPerfilIzquierdo),
    ])

    const nombresSupuestos =
      nombresData?.nombresSupuestos
        ?.map((n) =>
          [n.nombres, n.paterno, n.materno, n.apellidoEsposo]
            .filter(Boolean)
            .join(' ')
        )
        .join(' | ') || ''

    const datosFamiliares =
      familiaresData?.datosFamiliares?.map((f) => ({
        nombreCompleto: [f.nombres, f.paterno, f.materno]
          .filter(Boolean)
          .join(' '),

        parentesco: f.parentezco?.descripcion || '',

        telefono: f.telefono || '',

        direccion: f.direccion || '',

        implicado: f.implicado === true ? 'SI' : 'NO',

        estado: f.vivo === true ? 'VIVO' : 'MUERTO',
      })) || []

    const documentos =
      documentosData?.documentos?.map((d) => ({
        tipoDocumento: d.tipoDocumento?.descripcion || '',

        numeroDocumento: d.numeroDocumento || '',
      })) || []

    const fenotipo = fenotipoData?.fenotipo

    return {
      nombre: [
        detenido?.nombres,
        detenido?.apellidoPaterno,
        detenido?.apellidoMaterno,
      ]
        .filter(Boolean)
        .join(' '),

      alias: detenido?.aliases?.[0]?.descripcion || '',

      numeroCaso: detenido?.numeroCaso || '',

      direccion: detenido?.direccion || '',

      lugarOperativo: detenido?.lugarOperativo || '',

      observaciones: detenido?.observaciones || '',

      fechaNacimiento: detenido?.fechaNacimiento || '',

      nacionalidad: detenido?.pais?.descripcion || '',

      estadoCivil: detenido?.estadoCivil?.descripcion || '',

      profesion: detenido?.profesiones?.[0]?.idProfesion?.descripcion || '',

      fotoFrontal,
      fotoPerfil,
      fotoPerfilIzquierdo,

      manoDerecha,
      manoIzquierda,

      nombresSupuestos,
      datosFamiliares,
      documentos,

      estatura: fenotipo?.estatura || '',

      peso: fenotipo?.pesoCorporal || '',

      colorPiel: fenotipo?.colorPiel?.descripcion || '',

      colorCabello: fenotipo?.colorCabello?.descripcion || '',

      tipoCabello: fenotipo?.tipoCabello?.descripcion || '',

      colorOjos: fenotipo?.colorOjos?.descripcion || '',

      tipoOjos: fenotipo?.tipoOjos?.descripcion || '',

      tipoNariz: fenotipo?.tipoNariz?.descripcion || '',

      constitucionCorporal: fenotipo?.constitucionCorporal?.descripcion || '',

      seniasParticulares: fenotipo?.senasParticulares || '',

      tatuajes: fenotipo?.tatuaje || '',
    }
  }

  private async obtenerDetenido(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },

      relations: [
        'aliases',
        'pais',
        'estadoCivil',
        'profesiones',
        'profesiones.idProfesion',
      ],
    })
  }

  private async obtenerFenotipo(id: number) {
    return await this.repoDetenido
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.fenotipo', 'fenotipo')
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
        'd.idDetenido',

        'fenotipo',

        'colorPiel.descripcion',
        'colorCabello.descripcion',
        'tipoCabello.descripcion',
        'colorOjos.descripcion',
        'tipoOjos.descripcion',
        'tipoNariz.descripcion',
        'constitucionCorporal.descripcion',
      ])

      .where('d.idDetenido = :id', { id })

      .getOne()
  }

  private async obtenerFamiliares(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },

      relations: ['datosFamiliares', 'datosFamiliares.parentezco'],
    })
  }

  private async obtenerDocumentos(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },

      relations: ['documentos', 'documentos.tipoDocumento'],
    })
  }

  private async obtenerNombresSupuestos(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },

      relations: ['nombresSupuestos'],
    })
  }

  private async obtenerHuellas(id: number) {
    return await this.huellaRepository.find({
      where: {
        idPersona: id,
      },
    })
  }
  private async bufferToBase64Optimizado(
    buffer: any,
    mime = 'image/jpeg'
  ): Promise<string> {
    try {
      if (!buffer) {
        return ''
      }

      // si ya es base64
      const text = Buffer.isBuffer(buffer)
        ? buffer.toString()
        : buffer.toString()

      if (
        text.startsWith('iVBOR') ||
        text.startsWith('/9j/') ||
        text.startsWith('data:image')
      ) {
        return text.startsWith('data:image')
          ? text
          : `data:${mime};base64,${text}`
      }

      // buffer normal
      const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)

      return `data:${mime};base64,${buf.toString('base64')}`
    } catch (error) {
      console.error('ERROR FOTO BASE64', error)

      return ''
    }
  }
  // =====================================================
  // IMAGEN BASE64 OPTIMIZADA
  // =====================================================

  private async imagenBase64Optimizada(pathImagen: string): Promise<string> {
    try {
      if (!pathImagen) {
        return ''
      }

      const cacheB64 = `${pathImagen}.b64`

      // cache
      if (fs.existsSync(cacheB64)) {
        return await fs.promises.readFile(cacheB64, 'utf8')
      }

      // no existe
      if (!fs.existsSync(pathImagen)) {
        return ''
      }

      // leer archivo
      const bitmap = await fs.promises.readFile(pathImagen)

      const extension = pathImagen.split('.').pop()?.toLowerCase()

      let mime = 'image/png'

      if (extension === 'bmp') {
        mime = 'image/bmp'
      }

      if (extension === 'jpg' || extension === 'jpeg') {
        mime = 'image/jpeg'
      }

      if (extension === 'png') {
        mime = 'image/png'
      }

      // SIN SHARP
      const base64 = `data:${mime};base64,${bitmap.toString('base64')}`

      // guardar cache
      await fs.promises.writeFile(cacheB64, base64)

      return base64
    } catch (error) {
      console.error('ERROR IMAGEN BASE64', error)

      return ''
    }
  }
}
