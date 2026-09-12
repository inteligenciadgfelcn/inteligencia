import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import sharp from 'sharp'
import { Detenido } from '../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../felcn_sii/huella/entities/huella.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { ReporteServicioRepository } from './repository/reporte_servicio.repository'
import { imagenBase64 } from '@/common/utils/huella.util'

@Injectable()
export class ReporteService {
  private readonly cacheHuellas = new Map<string, string>()

  constructor(
    @InjectRepository(Detenido, DB_SII)
    private readonly repoDetenido: Repository<Detenido>,
    @InjectRepository(Huella, DB_SII)
    private readonly huellaRepository: Repository<Huella>,
    private readonly reporteServicioRepository: ReporteServicioRepository
  ) {}

  async GenerarPDF(id: number) {
    try {
      const [
        detenido,
        fenotipoData,
        familiaresData,
        documentosData,
        nombresData,
        huellas,
        fotografiasData,
      ] = await Promise.all([
        this.medirTiempo(`DETENIDO-${id}`, () => this.obtenerDetenido(id)),
        this.medirTiempo(`FENOTIPO-${id}`, () => this.obtenerFenotipo(id)),
        this.medirTiempo(`FAMILIARES-${id}`, () => this.obtenerFamiliares(id)),
        this.medirTiempo(`DOCUMENTOS-${id}`, () => this.obtenerDocumentos(id)),
        this.medirTiempo(`NOMBRES-${id}`, () =>
          this.obtenerNombresSupuestos(id)
        ),
        this.medirTiempo(`HUELLAS-DB-${id}`, () => this.obtenerHuellas(id)),
        this.medirTiempo(`FOTOGRAFIAS-DB-${id}`, () =>
          this.obtenerFotografias(id)
        ),
      ])

      if (!detenido) {
        throw new NotFoundException(`No se encontró el detenido ${id}`)
      }
      const ultimasHuellas = new Map<
        string,
        {
          idHuella: number
          dedo: string
          rutaArchivo: string
        }
      >()

      for (const huella of huellas) {
        if (!huella.dedo || !huella.rutaArchivo) {
          continue
        }
        ultimasHuellas.set(huella.dedo, huella)
      }

      const huellasUnicas = Array.from(ultimasHuellas.values())

      const huellasProcesadas = await Promise.all(
        huellasUnicas.map(async (huella) => ({
          dedo: huella.dedo,

          imagen: await this.imagenBase64Optimizada(huella.rutaArchivo),
        }))
      )

      const manoDerecha: Record<string, string> = {
        Derecho_Pulgar: '',
        Derecho_Indice: '',
        Derecho_Medio: '',
        Derecho_Anular: '',
        Derecho_Menique: '',
      }

      const manoIzquierda: Record<string, string> = {
        Izquierdo_Pulgar: '',
        Izquierdo_Indice: '',
        Izquierdo_Medio: '',
        Izquierdo_Anular: '',
        Izquierdo_Menique: '',
      }

      for (const huella of huellasProcesadas) {
        if (!huella.dedo || !huella.imagen) {
          continue
        }

        if (huella.dedo.startsWith('Derecho_')) {
          manoDerecha[huella.dedo] = huella.imagen
        }

        if (huella.dedo.startsWith('Izquierdo_')) {
          manoIzquierda[huella.dedo] = huella.imagen
        }
      }

      for (const huella of huellasProcesadas) {
        if (!huella.dedo) {
          continue
        }

        if (huella.dedo.includes('Derecho')) {
          manoDerecha[huella.dedo] = huella.imagen
        } else if (huella.dedo.includes('Izquierdo')) {
          manoIzquierda[huella.dedo] = huella.imagen
        }
      }

      const [fotoFrontal, fotoPerfil, fotoPerfilIzquierdo] = await Promise.all([
        this.bufferToBase64Optimizado(fotografiasData?.fotoFrente),
        this.bufferToBase64Optimizado(fotografiasData?.fotoPerfilDerecho),
        this.bufferToBase64Optimizado(fotografiasData?.fotoPerfilIzquierdo),
      ])

      const nombresSupuestos =
        nombresData?.nombresSupuestos
          ?.map((nombre) =>
            [
              nombre.nombres,
              nombre.paterno,
              nombre.materno,
              nombre.apellidoEsposo,
            ]
              .filter(Boolean)
              .join(' ')
          )
          .join(' | ') || ''

      const datosFamiliares =
        familiaresData?.datosFamiliares?.map((familiar) => ({
          nombreCompleto: [familiar.nombres, familiar.paterno, familiar.materno]
            .filter(Boolean)
            .join(' '),
          parentesco: familiar.parentezco?.descripcion || '',
          telefono: familiar.telefono || '',
          direccion: familiar.direccion || '',
          implicado: familiar.implicado === true ? 'SI' : 'NO',
          estado: familiar.vivo === true ? 'VIVO' : 'MUERTO',
        })) || []

      const documentos =
        documentosData?.documentos?.map((documento) => ({
          tipoDocumento: documento.tipoDocumento?.descripcion || '',
          numeroDocumento: documento.numeroDocumento || '',
        })) || []

      const fenotipo = fenotipoData?.fenotipo
      const seniasParticulares =
        (fenotipo as any)?.senaParticular ??
        (fenotipo as any)?.senasParticulares ??
        ''
      return {
        nombre: [
          detenido.nombres,
          detenido.apellidoPaterno,
          detenido.apellidoMaterno,
        ]
          .filter(Boolean)
          .join(' '),

        alias: detenido.aliases?.[0]?.descripcion || '',
        numeroCaso: detenido.numeroCaso || '',
        direccion: detenido.direccion || '',
        lugarOperativo: detenido.lugarOperativo || '',
        observaciones: detenido.observaciones || '',
        fechaNacimiento: detenido.fechaNacimiento || '',
        nacionalidad: detenido.pais?.descripcion || '',
        estadoCivil: detenido.estadoCivil?.descripcion || '',
        profesion: detenido.profesiones?.[0]?.idProfesion?.descripcion || '',
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
        seniasParticulares,
        tatuajes: fenotipo?.tatuaje || '',
      }
    } finally {
    }
  }

  private async medirTiempo<T>(
    nombre: string,
    operacion: () => Promise<T>
  ): Promise<T> {
    console.time(nombre)

    try {
      return await operacion()
    } finally {
      console.timeEnd(nombre)
    }
  }
  private async obtenerDetenido(id: number) {
    return await this.repoDetenido
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
        'detenido.lugarOperativo',
        'detenido.observaciones',
        'aliases',
        'pais',
        'estadoCivil',
        'profesiones',
        'profesion',
      ])
      .where('detenido.idDetenido = :id', {
        id,
      })

      .getOne()
  }
  private async obtenerFenotipo(id: number) {
    return await this.repoDetenido
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

      .where('detenido.idDetenido = :id', {
        id,
      })

      .getOne()
  }
  private async obtenerFamiliares(id: number) {
    return await this.repoDetenido
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.datosFamiliares', 'datosFamiliares')
      .leftJoinAndSelect('datosFamiliares.parentezco', 'parentezco')
      .select(['detenido.idDetenido', 'datosFamiliares', 'parentezco'])
      .where('detenido.idDetenido = :id', {
        id,
      })
      .getOne()
  }

  private async obtenerDocumentos(id: number) {
    return await this.repoDetenido
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.documentos', 'documentos')
      .leftJoinAndSelect('documentos.tipoDocumento', 'tipoDocumento')
      .select(['detenido.idDetenido', 'documentos', 'tipoDocumento'])
      .where('detenido.idDetenido = :id', {
        id,
      })
      .getOne()
  }

  private async obtenerNombresSupuestos(id: number) {
    return await this.repoDetenido
      .createQueryBuilder('detenido')
      .leftJoinAndSelect('detenido.nombresSupuestos', 'nombresSupuestos')
      .select(['detenido.idDetenido', 'nombresSupuestos'])
      .where('detenido.idDetenido = :id', {
        id,
      })
      .getOne()
  }

  private async obtenerHuellas(id: number): Promise<
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

    const huellas = resultados.map((resultado) => ({
      idHuella: Number(resultado.id_huella),
      dedo: resultado.dedo || '',
      rutaArchivo: resultado.ruta_archivo || '',
    }))
    return huellas
  }

  private async obtenerFotografias(id: number) {
    return await this.repoDetenido
      .createQueryBuilder('detenido')
      .select([
        'detenido.idDetenido',
        'detenido.fotoFrente',
        'detenido.fotoPerfilDerecho',
        'detenido.fotoPerfilIzquierdo',
      ])
      .where('detenido.idDetenido = :id', {
        id,
      })
      .getOne()
  }

  private async bufferToBase64Optimizado(
    valor: Buffer | string | null | undefined
  ): Promise<string> {
    if (!valor) {
      return ''
    }
    try {
      const buffer = this.normalizarImagenBuffer(valor)
      if (!buffer || buffer.length === 0) {
        return ''
      }
      const imagenOptimizada = await sharp(buffer)
        .rotate()
        .resize({
          width: 350,
          height: 450,
          fit: 'cover',
          position: 'centre',
          withoutEnlargement: true,
        })

        .jpeg({
          quality: 72,
          mozjpeg: true,
        })
        .toBuffer()
      return 'data:image/jpeg;base64,' + imagenOptimizada.toString('base64')
    } catch (error) {
      console.error('ERROR PROCESANDO FOTOGRAFÍA', error)
      return ''
    }
  }

  private normalizarImagenBuffer(valor: Buffer | string): Buffer | null {
    try {
      if (typeof valor === 'string') {
        const contenido = valor.trim()

        if (contenido.startsWith('data:image/')) {
          const posicion = contenido.indexOf(',')

          if (posicion === -1) {
            return null
          }

          return Buffer.from(contenido.substring(posicion + 1), 'base64')
        }

        if (this.esTextoBase64(contenido)) {
          return Buffer.from(contenido, 'base64')
        }

        return null
      }

      if (!Buffer.isBuffer(valor)) {
        return null
      }

      if (this.esFormatoImagen(valor)) {
        return valor
      }

      const contenido = valor.toString('utf8').trim()

      if (contenido.startsWith('data:image/')) {
        const posicion = contenido.indexOf(',')

        if (posicion === -1) {
          return null
        }

        return Buffer.from(contenido.substring(posicion + 1), 'base64')
      }

      if (this.esTextoBase64(contenido)) {
        return Buffer.from(contenido, 'base64')
      }

      return null
    } catch (error) {
      console.error('ERROR NORMALIZANDO FOTOGRAFÍA', error)

      return null
    }
  }

  private esFormatoImagen(buffer: Buffer): boolean {
    if (buffer.length < 4) {
      return false
    }

    const esPNG =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47

    const esJPEG = buffer[0] === 0xff && buffer[1] === 0xd8

    const esBMP = buffer[0] === 0x42 && buffer[1] === 0x4d

    const esWEBP =
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'

    return esPNG || esJPEG || esBMP || esWEBP
  }

  private esTextoBase64(texto: string): boolean {
    if (!texto || texto.length < 16) {
      return false
    }

    const limpio = texto.replace(/\s/g, '')

    return limpio.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(limpio)
  }

  private async imagenBase64Optimizada(rutaImagen: string): Promise<string> {
    if (!rutaImagen) {
      return ''
    }

    const cache = this.cacheHuellas.get(rutaImagen)

    if (cache) {
      return cache
    }

    const base64 = await imagenBase64(rutaImagen)

    if (base64) {
      this.cacheHuellas.set(rutaImagen, base64)
    }

    return base64
  }

  async GenerarPDFServicio(idServicio: string) {
    const codigoServicio = idServicio.trim()
    const [resultados, drogas, sustancias, fabricas, personas, operativos] =
      await Promise.all([
        this.reporteServicioRepository.obtenerResultados(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesDrogas(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesSustancias(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesFabricas(codigoServicio),
        this.reporteServicioRepository.obtenerResumenPersonas(codigoServicio),
        this.reporteServicioRepository.obtenerOperativosMapa(codigoServicio),
      ])

    if (!resultados.length) {
      throw new NotFoundException(
        `No se encontraron resultados para el servicio ${codigoServicio}`
      )
    }

    return {
      servicio: {
        idServicio: codigoServicio,
      },
      resultados,
      totalesSustancias: [...drogas, ...sustancias, ...fabricas],
      resumenPersonas: {
        aprehendidos: Number(personas?.aprehendidos ?? 0),
        arrestados: Number(personas?.arrestados ?? 0),
      },
      operativos,
    }
  }
}