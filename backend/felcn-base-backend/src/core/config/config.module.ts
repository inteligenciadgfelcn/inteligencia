import { Module } from '@nestjs/common'
import { AuthorizationConfigModule } from './authorization/authorization.module'
import { DataBaseModule } from './database/database.module'
import { SubscriberModule } from './subscriber/subscriber.module'

@Module({
  imports: [DataBaseModule, AuthorizationConfigModule, SubscriberModule],
})
export class ConfigCoreModule {}
