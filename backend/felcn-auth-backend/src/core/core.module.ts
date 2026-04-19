import { Module } from '@nestjs/common'
import { AuthenticationModule } from './authentication/authentication.module'
import { AuthorizationModule } from './authorization/authorization.module'
import { ConfigCoreModule } from './config/config.module'
import { ExternalServicesModule } from './external-services/external.module'
import { FileModule } from '@/core/file/file.module'
import { EstructuraModule } from './estructura/estructura.module'

@Module({
  imports: [
    ConfigCoreModule,
    ExternalServicesModule,
    AuthorizationModule,
    AuthenticationModule,
    FileModule,
    EstructuraModule,
  ],
  exports: [ExternalServicesModule],
})
export class CoreModule {}
