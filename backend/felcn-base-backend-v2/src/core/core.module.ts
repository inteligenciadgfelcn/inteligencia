import { Module } from '@nestjs/common'
// import { AuthenticationModule } from './authentication/authentication.module'
// import { AuthorizationModule } from './authorization/authorization.module'
import { ConfigCoreModule } from './config/config.module'
import { ExternalServicesModule } from './external-services/external.module'
import { FileModule } from '@/core/file/file.module'

// TODO: Reactivar para producción
// AuthorizationModule - Casbin (requiere tabla casbin_rule)
// AuthenticationModule - JWT (requiere tabla usuarios)

@Module({
  imports: [
    ConfigCoreModule,
    ExternalServicesModule,
    // AuthorizationModule,
    // AuthenticationModule,
    FileModule,
  ],
  exports: [ExternalServicesModule],
})
export class CoreModule {}
