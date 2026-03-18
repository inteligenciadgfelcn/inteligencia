import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Auditoria } from './auditoria.entity';
import { RequestContext } from '../../common/context/request-context';

@EventSubscriber()
export class AuditoriaSubscriber implements EntitySubscriberInterface {
  constructor(private dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Object;
  }

  async afterInsert(event: InsertEvent<any>) {
    await this.guardar(event, 'INSERT');
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.guardar(event, 'UPDATE');
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.guardar(event, 'DELETE');
  }

  private async guardar(event: any, accion: string) {
    if (event.metadata.tableName === 'auditoria') return;

    const usuarioId = RequestContext.get('idUsuario');
    const nroPase = RequestContext.get('nroPase');
    const repo = event.manager.getRepository(Auditoria);

    const registroId = event.entity?.id ?? event.databaseEntity?.id ?? null;
    await repo.save({
      tabla: event.metadata.tableName,
      registroId,
      accion,
      datosAntes: accion === 'UPDATE' ? event.databaseEntity : null,
      datosDespues: accion === 'DELETE' ? null : event.entity,
      idUsuario: usuarioId ?? null,
      nroPase: nroPase ?? null,
    });
  }
}
