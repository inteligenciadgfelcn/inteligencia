import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AuditSubscriber } from 'src/common/subscribers/audit.subscriber';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'database',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/core/database/migrations/*.ts'],
  synchronize: false,
  subscribers: [AuditSubscriber],
  logging: process.env.NODE_ENV === 'development',

  // Para migraciones
  migrationsRun: false,
  migrationsTableName: 'migrations_history',
});

export default AppDataSource;
