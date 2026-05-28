import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

const schema = process.env.DB_SCHEMA_FAKE || 'fake_ciudadania'

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'felcn_auth_v3',
  ssl: process.env.DB_USE_SSL === 'true',
  synchronize: false,
  logging: true,
})

async function runMigrations() {
  await AppDataSource.initialize()

  console.log(`Creando schema "${schema}" si no existe...`)
  await AppDataSource.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`)

  console.log('Creando tablas...')

  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.ciudadania_usuario (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ci VARCHAR(20) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      nombres VARCHAR(255) NOT NULL,
      primer_apellido VARCHAR(255) NOT NULL,
      segundo_apellido VARCHAR(255),
      fecha_nacimiento VARCHAR(10) NOT NULL,
      celular VARCHAR(20),
      tipo_documento VARCHAR(10) NOT NULL DEFAULT 'CI',
      estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
      creado_en TIMESTAMP NOT NULL DEFAULT now(),
      actualizado_en TIMESTAMP NOT NULL DEFAULT now()
    )
  `)

  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.ciudadania_otp (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID NOT NULL REFERENCES ${schema}.ciudadania_usuario(id) ON DELETE CASCADE,
      interaction_uid VARCHAR(255) NOT NULL,
      codigo VARCHAR(6) NOT NULL,
      expira_en TIMESTAMP NOT NULL,
      usado BOOLEAN NOT NULL DEFAULT false,
      creado_en TIMESTAMP NOT NULL DEFAULT now()
    )
  `)

  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.ciudadania_session (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      interaction_uid VARCHAR(255) NOT NULL UNIQUE,
      params JSONB NOT NULL,
      usuario_id UUID,
      code_hash VARCHAR(255),
      code_usado BOOLEAN NOT NULL DEFAULT false,
      expira_en TIMESTAMP NOT NULL,
      creado_en TIMESTAMP NOT NULL DEFAULT now()
    )
  `)

  console.log('Tablas creadas exitosamente.')
  await AppDataSource.destroy()
}

runMigrations().catch((err) => {
  console.error('Error en migración:', err)
  process.exit(1)
})
