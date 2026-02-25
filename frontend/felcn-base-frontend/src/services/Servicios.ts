import axios, {
  AxiosError,
  AxiosResponse,
  Method,
  RawAxiosRequestHeaders,
  ResponseType,
} from 'axios'
import { imprimir } from '@/utils/imprimir'

export type peticionFormatoMetodo = {
  method?: Method
} & peticionFormato

export type peticionFormato = {
  url: string
  headers?: RawAxiosRequestHeaders
  body?: object
  params?: any
  responseType?: ResponseType
  withCredentials?: boolean
}

export const estadosCorrectos: number[] = [200, 201, 202, 204]
export const estadosSinPermiso: number[] = [401]

class ServiciosClass {
  peticionHTTP = <T = any>({
    url,
    method = 'get',
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: peticionFormatoMetodo): Promise<AxiosResponse<T>> =>
    axios({
      method: method,
      url: url,
      headers: headers,
      timeout: 30000,
      data: body,
      params: params,
      responseType: responseType,
      withCredentials: withCredentials,
      validateStatus(status) {
        return estadosCorrectos.some((estado: number) => status === estado)
      },
    })

  isNetworkError(err: AxiosError | any) {
    return !!err.isAxiosError && !err.response
  }

  async peticion<T = any>({
    url,
    method = 'get',
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: peticionFormatoMetodo): Promise<T> {
    try {
      imprimir(`enviando 🌍`, body, method, url, headers)
      const response = await this.peticionHTTP<T>({
        url,
        method: method,
        headers,
        body,
        params,
        responseType,
        withCredentials,
      })
      imprimir('respuesta 📡', body, method, url, response)
      return response.data
    } catch (e: AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (this.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎')
      }

      throw e.response?.data || 'Ocurrió un error desconocido'
    }
  }

  async get<T = any>({
    url,
    body = {},
    headers = {},
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<T> {
    return await this.peticion<T>({
      url,
      method: 'get',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async post<T = any>({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<T> {
    return await this.peticion<T>({
      url,
      method: 'post',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async put<T = any>({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<T> {
    return await this.peticion<T>({
      url,
      method: 'put',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async patch<T = any>({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<T> {
    return await this.peticion<T>({
      url,
      method: 'patch',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async delete<T = any>({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<T> {
    return await this.peticion<T>({
      url,
      method: 'delete',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }
}

export const Servicios = new ServiciosClass()
