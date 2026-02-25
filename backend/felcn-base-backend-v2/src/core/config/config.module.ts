import { Module } from '@nestjs/common'
// import { AuthorizationConfigModule } from './authorization/authorization.module'
import { DataBaseModule } from './database/database.module'

// TODO: Reactivar para producción (requiere tabla casbin_rule)
@Module({
  imports: [DataBaseModule], // AuthorizationConfigModule desactivado
})
export class ConfigCoreModule {}
