/**
 * Seed de usuarios fake para desarrollo.
 * Ejecutar con: npm run migration:seed
 *
 * Usuarios creados:
 *   CI: 1234567   | password: Password1! | email: test1@mailinator.com
 *   CI: 7654321   | password: Password1! | email: test2@mailinator.com
 *   CI: 9999999   | password: Password1! | email: test3@mailinator.com
 */
import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'

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
  logging: false,
})

const usuarios = [
  {
    ci: '1234567',
    password: 'Password1!',
    email: 'test1@mailinator.com',
    nombres: 'JUAN PABLO',
    primer_apellido: 'GARCIA',
    segundo_apellido: 'LOPEZ',
    fecha_nacimiento: '15/03/1990',
    celular: '+59170000001',
    tipo_documento: 'CI',
  },
  {
    ci: '7654321',
    password: 'Password1!',
    email: 'test2@mailinator.com',
    nombres: 'MARIA ELENA',
    primer_apellido: 'MAMANI',
    segundo_apellido: 'CONDORI',
    fecha_nacimiento: '22/07/1985',
    celular: '+59170000002',
    tipo_documento: 'CI',
  },
  {
    ci: '9999999',
    password: 'Password1!',
    email: 'test3@mailinator.com',
    nombres: 'CARLOS ANTONIO',
    primer_apellido: 'QUISPE',
    segundo_apellido: null,
    fecha_nacimiento: '01/01/1995',
    celular: '+59170000003',
    tipo_documento: 'CI',
  },
]

async function seed() {
  await AppDataSource.initialize()

  for (const u of usuarios) {
    const passwordHash = await bcrypt.hash(u.password, 10)
    await AppDataSource.query(
      `INSERT INTO ${schema}.ciudadania_usuario
        (ci, password_hash, email, nombres, primer_apellido, segundo_apellido,
         fecha_nacimiento, celular, tipo_documento, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVO')
       ON CONFLICT (ci) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email = EXCLUDED.email,
         nombres = EXCLUDED.nombres,
         primer_apellido = EXCLUDED.primer_apellido,
         segundo_apellido = EXCLUDED.segundo_apellido,
         fecha_nacimiento = EXCLUDED.fecha_nacimiento,
         celular = EXCLUDED.celular`,
      [
        u.ci,
        passwordHash,
        u.email,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.fecha_nacimiento,
        u.celular,
        u.tipo_documento,
      ]
    )
    console.log(`Usuario CI=${u.ci} creado/actualizado`)
  }

  await AppDataSource.destroy()
  console.log('Seed completado.')
}

seed().catch((err) => {
  console.error('Error en seed:', err)
  process.exit(1)
})
