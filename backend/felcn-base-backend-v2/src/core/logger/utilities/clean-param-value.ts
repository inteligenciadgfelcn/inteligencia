import { toJSON } from 'flatted'
import { CLEAN_PARAM_VALUE_MAX_DEEP } from '../constants'
import { BaseException, LoggerParams } from '../classes'
import { IncomingMessage } from 'http'
import { Socket } from 'net'

export function cleanParamValue(
  value: unknown,
  deep = 0,
  sensitiveParams = LoggerParams.HIDE
) {
  try {
    // Para evitar recursividad infinita
    if (deep > CLEAN_PARAM_VALUE_MAX_DEEP) return String(value)

    // START
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) =>
          cleanParamValue(item, deep + 1, sensitiveParams)
        )
      }
      if (isAxiosResponse(value)) {
        return {
          data:
            'data' in value
              ? cleanParamValue(value.data, 0, sensitiveParams)
              : undefined,
          status: 'status' in value ? value.status : undefined,
          statusText: 'statusText' in value ? value.statusText : undefined,
        }
      }
      if (isAxiosRequest(value)) {
        return {
          path: 'path' in value ? value.path : undefined,
          method: 'method' in value ? value.method : undefined,
          host: 'host' in value ? value.host : undefined,
          protocol: 'protocol' in value ? value.protocol : undefined,
        }
      }
      if (isAxiosError(value)) {
        const config =
          'config' in value && value.config && typeof value.config === 'object'
            ? value.config
            : undefined
        const response =
          'response' in value &&
          value.response &&
          typeof value.response === 'object'
            ? value.response
            : undefined

        const responseData =
          response && 'data' in response
            ? cleanParamValue(response.data, 0, sensitiveParams)
            : undefined

        return {
          code: 'code' in value ? value.code : undefined,
          config: config
            ? {
                headers:
                  'headers' in config
                    ? cleanParamValue(config.headers, 0, sensitiveParams)
                    : undefined,
                baseURL: 'baseURL' in config ? config.baseURL : undefined,
                method: 'method' in config ? config.method : undefined,
                url: 'url' in config ? config.url : undefined,
                data: getAndCleanRequestDataFromConfig(config, sensitiveParams),
              }
            : undefined,
          response: response
            ? {
                status: 'status' in response ? response.status : undefined,
                statusText:
                  'statusText' in response ? response.statusText : undefined,
                data: responseData,
              }
            : undefined,
        }
      }
      if (isConexionError(value)) {
        const config =
          'config' in value && value.config && typeof value.config === 'object'
            ? value.config
            : undefined
        const cause =
          'cause' in value && typeof value.cause === 'object'
            ? value.cause
            : undefined
        return {
          name: 'name' in value ? value.name : undefined,
          message: 'message' in value ? value.message : undefined,
          errno: 'errno' in value ? value.errno : undefined,
          code: 'code' in value ? value.code : undefined,
          syscall: 'syscall' in value ? value.syscall : undefined,
          address: 'address' in value ? value.address : undefined,
          port: 'port' in value ? value.port : undefined,
          config: config
            ? {
                headers:
                  'headers' in config
                    ? cleanParamValue(config.headers, 0, sensitiveParams)
                    : undefined,
                baseURL: 'baseURL' in config ? config.baseURL : undefined,
                method: 'method' in config ? config.method : undefined,
                url: 'url' in config ? config.url : undefined,
                data: getAndCleanRequestDataFromConfig(config, sensitiveParams),
              }
            : undefined,
          cause: cause
            ? {
                name: 'name' in value ? value.name : undefined,
                message: 'message' in value ? value.message : undefined,
                errno: 'errno' in cause ? cause.errno : undefined,
                code: 'code' in cause ? cause.code : undefined,
                syscall: 'syscall' in cause ? cause.syscall : undefined,
                address: 'address' in cause ? cause.address : undefined,
                port: 'port' in cause ? cause.port : undefined,
              }
            : undefined,
        }
      }
      if (isCertExpiredError(value)) {
        const config =
          'config' in value && value.config && typeof value.config === 'object'
            ? value.config
            : undefined
        const cause =
          'cause' in value && typeof value.cause === 'object'
            ? value.cause
            : undefined
        return {
          name: 'name' in value ? value.name : undefined,
          message: 'message' in value ? value.message : undefined,
          code: 'code' in value ? value.code : undefined,
          config: config
            ? {
                headers:
                  'headers' in config
                    ? cleanParamValue(config.headers, 0, sensitiveParams)
                    : undefined,
                baseURL: 'baseURL' in config ? config.baseURL : undefined,
                method: 'method' in config ? config.method : undefined,
                url: 'url' in config ? config.url : undefined,
                data: getAndCleanRequestDataFromConfig(config, sensitiveParams),
              }
            : undefined,
          cause: cause
            ? {
                name: 'name' in value ? value.name : undefined,
                message: 'message' in value ? value.message : undefined,
                code: 'code' in cause ? cause.code : undefined,
              }
            : undefined,
        }
      }

      if (isIncomingMessage(value)) {
        return {
          statusCode:
            'statusCode' in value && typeof value.statusCode === 'number'
              ? value.statusCode
              : undefined,
          statusMessage:
            'statusMessage' in value && typeof value.statusMessage === 'string'
              ? value.statusMessage
              : undefined,
          responseUrl:
            'responseUrl' in value && typeof value.responseUrl === 'string'
              ? value.responseUrl
              : undefined,
          request:
            'socket' in value &&
            typeof value.socket === 'object' &&
            value.socket !== null &&
            '_httpMessage' in value.socket &&
            typeof value.socket._httpMessage === 'object' &&
            value.socket._httpMessage !== null
              ? {
                  path:
                    'path' in value.socket._httpMessage &&
                    typeof value.socket._httpMessage.path === 'string'
                      ? value.socket._httpMessage.path
                      : undefined,
                  method:
                    'method' in value.socket._httpMessage &&
                    typeof value.socket._httpMessage.method === 'string'
                      ? value.socket._httpMessage.method
                      : undefined,
                  host:
                    'host' in value.socket._httpMessage &&
                    typeof value.socket._httpMessage.host === 'string'
                      ? value.socket._httpMessage.host
                      : undefined,
                }
              : undefined,
          headers:
            'headers' in value
              ? cleanParamValue(value.headers, 0, sensitiveParams)
              : undefined,
          responseBody:
            '_readableState' in value &&
            typeof value._readableState === 'object' &&
            value._readableState !== null &&
            'buffer' in value._readableState &&
            Array.isArray(value._readableState.buffer) &&
            value._readableState.buffer.length > 0
              ? getAndCleanRequestDataFromConfig(
                  {
                    data: Buffer.concat(value._readableState.buffer).toString(),
                  },
                  sensitiveParams
                )
              : undefined,
          socket:
            'socket' in value &&
            typeof value.socket === 'object' &&
            value.socket !== null
              ? {
                  hadError:
                    'hadError' in value.socket &&
                    typeof value.socket.hadError === 'boolean'
                      ? value.socket.hadError
                      : undefined,
                  host:
                    'host' in value.socket &&
                    typeof value.socket.host === 'string'
                      ? value.socket.host
                      : undefined,
                  timeout:
                    'timeout' in value.socket &&
                    typeof value.socket.timeout === 'number'
                      ? value.socket.timeout
                      : undefined,
                }
              : undefined,
        }
      }

      if (value instanceof BaseException) {
        return value.toString()
      }

      if (value instanceof Error) {
        return value.stack
      }

      if (value instanceof Date) {
        return value.toJSON()
      }

      return Object.keys(value).reduce((prev, curr) => {
        // Por seguridad se ofusca el valor de parámetros con información sensible
        if (sensitiveParams.includes(curr.toLowerCase())) {
          prev[curr] = '*****'
        }

        // en otros casos
        else {
          prev[curr] = cleanParamValue(
            (value as object)[curr],
            deep + 1,
            sensitiveParams
          )
        }

        return prev
      }, {})
    }
    // END

    // Por seguridad se ofuscan los tokens
    if (typeof value === 'string' && value.indexOf('Bearer') > -1) {
      const regex = /Bearer\s+[A-Za-z0-9.-_]+/g
      return value.replace(regex, 'Bearer *****')
    }

    return value
  } catch (error) {
    try {
      return toJSON(value)
    } catch (e) {
      return e.toString()
    }
  }
}

function getAndCleanRequestDataFromConfig(
  config?: object,
  sensitiveParams?: string[]
): unknown | undefined {
  let dataCleaned: unknown | undefined = undefined
  if (config && 'data' in config && typeof config.data === 'string') {
    try {
      dataCleaned = JSON.stringify(
        cleanParamValue(JSON.parse(config.data), 0, sensitiveParams)
      )
    } catch (err) {
      dataCleaned = cleanParamValue(config.data, 0, sensitiveParams)
    }
  }
  return dataCleaned
}

function isAxiosResponse(data: unknown) {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'data' in data &&
      typeof data.data !== 'undefined' &&
      'status' in data &&
      typeof data.status !== 'undefined' &&
      'statusText' in data &&
      typeof data.statusText !== 'undefined' &&
      'headers' in data &&
      typeof data.headers !== 'undefined' &&
      'config' in data &&
      typeof data.config !== 'undefined'
  )
}

function isAxiosRequest(data: unknown) {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'path' in data &&
      typeof data.path !== 'undefined' &&
      'method' in data &&
      typeof data.method !== 'undefined' &&
      'host' in data &&
      typeof data.host !== 'undefined' &&
      'protocol' in data &&
      typeof data.protocol !== 'undefined' &&
      'res' in data &&
      typeof data.res !== 'undefined'
  )
}

export function isAxiosError(data: unknown): boolean {
  return Boolean(data instanceof Error && data.name === 'AxiosError')
}

export function isConexionError(data: unknown): boolean {
  const val =
    data && typeof data === 'object' && 'cause' in data
      ? (data.cause as object)
      : data

  return Boolean(
    val &&
      typeof val === 'object' &&
      'code' in val &&
      typeof val.code === 'string' &&
      [
        'ESOCKETTIMEDOUT',
        'ETIMEDOUT',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ECONNRESET',
      ].includes(val.code)
  )
}

export function isCertExpiredError(data: unknown): boolean {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'code' in data &&
      typeof data.code === 'string' &&
      data.code === 'CERT_HAS_EXPIRED'
  )
}

export function isIncomingMessage(value: unknown): value is IncomingMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof value.statusCode === 'number' &&
    'statusMessage' in value &&
    typeof value.statusMessage === 'string' &&
    value.statusMessage.length > 0 &&
    'headers' in value &&
    typeof value.headers === 'object' &&
    value.headers !== null &&
    'socket' in value &&
    typeof value.socket === 'object' &&
    value.socket !== null &&
    value.socket instanceof Socket
  )
}
