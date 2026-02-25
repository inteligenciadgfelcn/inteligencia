import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { RequestContextService } from "./request-context.service"

@EventSubscriber()
export class AuditSubscriber
  implements EntitySubscriberInterface<any>
{
  constructor(private readonly context: RequestContextService) {}

  beforeInsert(event: InsertEvent<any>) {

    if (!event.metadata.columns.some(c => c.propertyName === 'idUsuarioCreacion')) {
      return
    }

    const user = this.context.get('user')

    event.entity.idUsuarioCreacion = user?.id ?? 0
    event.entity.usuarioCreacion = user?.rol ?? 'system'
  }

  beforeUpdate(event: UpdateEvent<any>) {

    if (!event.metadata.columns.some(c => c.propertyName === 'idUsuarioModificacion')) {
      return
    }

    const user = this.context.get('user')

    if (event.entity) {
      event.entity.idUsuarioModificacion = user?.id ?? 0
      event.entity.usuarioModificacion = user?.rol ?? 'system'
    }
  }
}