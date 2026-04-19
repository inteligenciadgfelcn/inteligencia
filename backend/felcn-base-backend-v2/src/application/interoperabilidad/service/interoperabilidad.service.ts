import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { ConsultarItvDto } from '../dto/consultar-itv.dto'
import { ConsultarSegipDto } from '../dto/consultar-segip.dto'
import { SinConsultaContribuyenteDto } from '../dto/sin-consulta-contribuyente.dto'

@Injectable()
export class InteroperabilidadService {
  private readonly itvUrl = process.env.IOP_ITV_URL || ''
  private readonly itvToken = process.env.IOP_ITV_TOKEN || ''
  private readonly segipUrl = process.env.IOP_SEGIP_URL || ''
  private readonly segipToken = process.env.IOP_SEGIP_TOKEN || ''
  private readonly inraTituloUrl = process.env.IOP_INRA_TITULO_URL || ''
  private readonly inraTituloToken = process.env.IOP_INRA_TITULO_TOKEN || ''
  private readonly inraNroIdentificacionUrl =
    process.env.IOP_INRA_NRO_IDENTIFICACION_URL || ''
  private readonly inraNroIdentificacionToken =
    process.env.IOP_INRA_NRO_IDENTIFICACION_TOKEN || ''
  private readonly sinUrl = process.env.IOP_SIN_URL || ''
  private readonly sinToken = process.env.IOP_SIN_TOKEN || ''

  constructor(private readonly httpService: HttpService) {}

  private ensureConfig(values: string[], message: string) {
    if (values.some((value) => !value)) {
      throw new InternalServerErrorException(message)
    }
  }

  private authHeader(token: string, scheme: 'Bearer' | 'Token' = 'Bearer') {
    if (token.startsWith('Bearer ') || token.startsWith('Token ')) {
      return token
    }
    return `${scheme} ${token}`
  }

  async consultarInspeccion(payload: ConsultarItvDto) {
    this.ensureConfig(
      [this.itvUrl, this.itvToken],
      'Falta configurar IOP_ITV_URL o IOP_ITV_TOKEN en variables de entorno'
    )

    const authorization = this.authHeader(this.itvToken, 'Bearer')

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.itvUrl, payload, {
          headers: {
            Authorization: authorization,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
      )

      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio ITV'
      )
    }
  }

  async consultarSegip(payload: ConsultarSegipDto) {
    this.ensureConfig(
      [this.segipUrl, this.segipToken],
      'Falta configurar IOP_SEGIP_URL o IOP_SEGIP_TOKEN en variables de entorno'
    )

    const body = {
      ced: payload.ced,
      com: payload.com || '',
      nom: payload.nom || '',
      pat: payload.pat || '',
      mat: payload.mat || '',
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.segipUrl, body, {
          headers: {
            Authorization: this.authHeader(this.segipToken, 'Bearer'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
      )
      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio SEGIP'
      )
    }
  }

  async consultarInraTitulo(numTitulo: string) {
    this.ensureConfig(
      [this.inraTituloUrl, this.inraTituloToken],
      'Falta configurar IOP_INRA_TITULO_URL o IOP_INRA_TITULO_TOKEN en variables de entorno'
    )

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.inraTituloUrl, {
          params: { numTitulo },
          headers: {
            Authorization: this.authHeader(this.inraTituloToken, 'Bearer'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
      )
      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio INRA (titulo ejecutorial)'
      )
    }
  }

  async consultarInraIdentificacion(numeroIdentificacion: string) {
    this.ensureConfig(
      [this.inraNroIdentificacionUrl, this.inraNroIdentificacionToken],
      'Falta configurar IOP_INRA_NRO_IDENTIFICACION_URL o IOP_INRA_NRO_IDENTIFICACION_TOKEN en variables de entorno'
    )

    try {
      const response = await firstValueFrom(
        this.httpService.get(this.inraNroIdentificacionUrl, {
          params: { numeroIdentificacion },
          headers: {
            Authorization: this.authHeader(
              this.inraNroIdentificacionToken,
              'Bearer'
            ),
            Accept: 'application/json',
          },
        })
      )
      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio INRA (identificacion)'
      )
    }
  }

  async consultarSinDatosContribuyente(payload: SinConsultaContribuyenteDto) {
    this.ensureConfig(
      [this.sinUrl, this.sinToken],
      'Falta configurar IOP_SIN_URL o IOP_SIN_TOKEN en variables de entorno'
    )

    const url = `${this.sinUrl.replace(/\/$/, '')}/consultaDatosContribuyente`

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: this.authHeader(this.sinToken, 'Token'),
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
      )
      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio SIN (consultaDatosContribuyente)'
      )
    }
  }

  async verificarComunicacionSin() {
    this.ensureConfig(
      [this.sinUrl, this.sinToken],
      'Falta configurar IOP_SIN_URL o IOP_SIN_TOKEN en variables de entorno'
    )

    const url = `${this.sinUrl.replace(/\/$/, '')}/verificarComunicacionMinGob`

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: this.authHeader(this.sinToken, 'Token'),
            Accept: 'application/json',
          },
        })
      )
      return response.data
    } catch (error) {
      throw new BadGatewayException(
        'No se pudo obtener una respuesta valida del servicio SIN (verificarComunicacionMinGob)'
      )
    }
  }
}
