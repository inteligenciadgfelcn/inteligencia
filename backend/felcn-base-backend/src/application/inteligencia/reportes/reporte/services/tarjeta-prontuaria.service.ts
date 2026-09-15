import { Injectable, NotFoundException } from '@nestjs/common'
import sharp from 'sharp'
import { imagenBase64 } from '@/common/utils/huella.util'
import { TarjetaProntuariaRepository } from '../repository/tarjeta-prontuaria.repository'

@Injectable()
export class TarjetaProntuariaService {
  private readonly cacheHuellas = new Map<string, string>()
  constructor(
    private readonly tarjetaRepository: TarjetaProntuariaRepository
  ) {}

  async generar(id: number) {
    const [
      detenido,
      fenotipoData,
      familiaresData,
      documentosData,
      nombresData,
      huellas,
      fotografiasData,
    ] = await Promise.all([
      this.medirTiempo(`DETENIDO-${id}`, () =>
        this.tarjetaRepository.obtenerDetenido(id)
      ),
      this.medirTiempo(`FENOTIPO-${id}`, () =>
        this.tarjetaRepository.obtenerFenotipo(id)
      ),
      this.medirTiempo(`FAMILIARES-${id}`, () =>
        this.tarjetaRepository.obtenerFamiliares(id)
      ),
      this.medirTiempo(`DOCUMENTOS-${id}`, () =>
        this.tarjetaRepository.obtenerDocumentos(id)
      ),
      this.medirTiempo(`NOMBRES-${id}`, () =>
        this.tarjetaRepository.obtenerNombresSupuestos(id)
      ),
      this.medirTiempo(`HUELLAS-DB-${id}`, () =>
        this.tarjetaRepository.obtenerHuellas(id)
      ),
      this.medirTiempo(`FOTOGRAFIAS-DB-${id}`, () =>
        this.tarjetaRepository.obtenerFotografias(id)
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
      observacionHuella:detenido.observacionHuella ?? 'Sin observaciones',
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
}
