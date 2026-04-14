import { Client, Issuer } from 'openid-client'
import { LoggerService } from '@/core/logger'
import { custom } from 'openid-client'

//Para cambiar el timeout del cliente de ciudadanía en caso de ser necesario.
//Para cambiar el timeout del cliente de ciudadanía en caso de ser necesario.
if (process.env.NODE_ENV === 'development') {
  custom.setHttpOptionsDefaults({
    timeout: 10000,
    // @ts-expect-error - Allow self-signed certs in dev
    hooks: {
      beforeRequest: [
        (options) => {
          options.https = { rejectUnauthorized: false }
        },
      ],
    },
  })
} else {
  custom.setHttpOptionsDefaults({ timeout: 10000 }) // Valor por defecto: 3500
}

const logger = LoggerService.getInstance()

export class ClientOidcService {
  private static client: Client

  static async getInstance(): Promise<Client | undefined> {
    if (ClientOidcService.client) {
      return ClientOidcService.client
    }
    const oidcIssuer = process.env[`OIDC_ISSUER`] || ''
    const oidcClient = process.env[`OIDC_CLIENT_ID`] || ''
    const oidcSecret = process.env[`OIDC_CLIENT_SECRET`] || ''

    try {
      const issuer = await Issuer.discover(oidcIssuer)
      ClientOidcService.client = new issuer.Client({
        client_id: oidcClient,
        client_secret: oidcSecret,
      })
    } catch (error: unknown) {
      logger.warn(
        `OIDC: No se pudo conectar a ${oidcIssuer} - Iniciando sin autenticación Ciudanería`
      )
      return undefined
    }
    return ClientOidcService.client
  }
}
