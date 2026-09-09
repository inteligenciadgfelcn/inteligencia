/**
 * Sistema Nacional de Inteligencia de la FELCN — Fase 1
 * Autoría: Ing. Erika Carmiña Camargo Salvatierra · Ing. Eitner Montero
 * Proyecto BOLEU1 (UNODC) — DG-FELCN
 */
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { LoggerService, SQLLogger } from '@/core/logger'

dotenv.config()

const SeedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  ssl:
    process.env.DB_USE_SSL === 'true'
      ? { rejectUnauthorized: process.env.DB_VERIFY_SSL === 'true' }
      : false,
  logger: new SQLLogger({
    logger: LoggerService.getInstance(),
    level: {
      query: true,
      error: true,
    },
  }),
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/seeds/*.ts'],
})

export default SeedDataSource
