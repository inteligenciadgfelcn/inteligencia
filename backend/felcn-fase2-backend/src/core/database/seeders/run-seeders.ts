import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ParameterSeeder } from './parameter.seeder';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

config();

async function runSeeders() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Continente],
    synchronize: false,
    logging: true,
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connected successfully!');

    console.log('Starting database seeding...');

    const parameterSeeder = new ParameterSeeder();
    await parameterSeeder.run(dataSource);

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

if (require.main === module) {
  runSeeders().catch(console.error);
}
