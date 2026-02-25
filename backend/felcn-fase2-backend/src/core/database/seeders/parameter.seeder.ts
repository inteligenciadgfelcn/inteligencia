
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';
import { DataSource } from 'typeorm';

export class ParameterSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const parameterRepository = dataSource.getRepository(Continente);

    const count = await parameterRepository.count();
    if (count > 0) {
      console.log('Parameters already seeded, skipping...');
      return;
    }

    const parameters = [
      {
        nombre: 'APP_NAME',
        activo: true,
        usuario_registro: 'SYSTEM',
        estado_registro: 1,
      },
      {
        nombre: 'APP_VERSION',
        activo: true,
        usuario_registro: 'SYSTEM',
        estado_registro: 1,
      },
      {
        nombre: 'MAX_UPLOAD_SIZE',
        activo: true,
        usuario_registro: 'SYSTEM',
        estado_registro: 1,
      },
      {
        nombre: 'EMAIL_NOTIFICATIONS',
        activo: true,
        usuario_registro: 'SYSTEM',
        estado_registro: 1,
      },
      {
        nombre: 'MAINTENANCE_MODE',
        activo: false,
        usuario_registro: 'SYSTEM',
        estado_registro: 1,
      },
    ];

    await parameterRepository.save(parameters);
    console.log('Parameters seeded successfully!');
  }
}
