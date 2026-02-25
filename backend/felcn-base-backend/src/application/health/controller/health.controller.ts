import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus'
@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get('health.services')
  async check_Services() {
    try {
      const result: HealthCheckResult = await this.health.check([
        async () => await this.db.pingCheck('database'),
        async () =>
          await this.http.pingCheck(
            'Ciudadanía Digital',
            process.env.OIDC_ISSUER
              ? `${process.env.OIDC_ISSUER}/estado`
              : 'https://proveedor-cd3.test.agetic.gob.bo/estado'
          ),
      ])
      return {
        overallStatus: result.status,
        checks: result.details,
      }
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        const responsePayload = error.getResponse()
        const healthCheckResult = responsePayload as HealthCheckResult
        return {
          overallStatus: healthCheckResult.status,
          checks: healthCheckResult.details,
        }
      }
      throw error
    }
  }
}
