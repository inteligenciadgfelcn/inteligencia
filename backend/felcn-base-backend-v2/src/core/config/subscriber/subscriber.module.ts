import { Module } from '@nestjs/common'
import { AuditoriaCambioSubscriber } from './auditoria-cambio.subscriber'

@Module({
  providers: [AuditoriaCambioSubscriber],
})
export class SubscriberModule {}
