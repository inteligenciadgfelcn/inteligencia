import { DataSource } from 'typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

class DataBaseConnection {
  private connection: DataSource | null = null

  async createConnection(): Promise<DataSource> {
    if (this.connection && this.connection.isInitialized) {
      throw new Error('La conexión a la base de datos ya existe.')
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile()
    const configService = moduleFixture.get<ConfigService>(ConfigService)

    this.connection = new DataSource({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      ssl:
        configService.get('DB_USE_SSL') === 'true'
          ? {
              rejectUnauthorized: configService.get('DB_VERIFY_SSL') === 'true',
            }
          : false,
    })

    try {
      await this.connection.initialize()
      return this.connection
    } catch (error) {
      throw new Error(`Error al conectar a la base de datos: ${error.message}`)
    }
  }

  async closeConnection(): Promise<void> {
    if (this.connection && this.connection.isInitialized) {
      await this.connection.destroy()
    }
  }
}

describe('Database Connection Test', () => {
  let dataBaseConnection: DataBaseConnection
  let connection: DataSource
  const TEST_SCHEMA = `test_schema_${Date.now()}`

  beforeAll(async () => {
    dataBaseConnection = new DataBaseConnection()
    connection = await dataBaseConnection.createConnection()
  })

  beforeEach(async () => {
    await connection.query('START TRANSACTION')
  })

  afterEach(async () => {
    await connection.query('ROLLBACK')
  })

  afterAll(async () => {
    await dataBaseConnection.closeConnection()
  })

  it('debería establecer conexión exitosa con la base de datos', () => {
    expect(connection.isInitialized).toBeTruthy()
  })

  it('debería crear un schema de prueba', async () => {
    await connection.query(`CREATE SCHEMA ${TEST_SCHEMA}`)

    const schemas = await connection.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${TEST_SCHEMA}'`
    )
    expect(schemas.length).toBe(1)
    expect(schemas[0].schema_name).toBe(TEST_SCHEMA)
  })

  it('debería crear una tabla en el schema de prueba', async () => {
    await connection.query(`CREATE SCHEMA IF NOT EXISTS ${TEST_SCHEMA}`)
    await connection.query(`
      CREATE TABLE ${TEST_SCHEMA}.test_table (
        id SERIAL PRIMARY KEY,
        name TEXT
      )
    `)

    const tables = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = '${TEST_SCHEMA}'
    `)
    expect(tables.length).toBe(1)
    expect(tables[0].table_name).toBe('test_table')
  })

  it('debería eliminar el schema de prueba', async () => {
    await connection.query(`CREATE SCHEMA IF NOT EXISTS ${TEST_SCHEMA}`)
    await connection.query(`DROP SCHEMA ${TEST_SCHEMA} CASCADE`)

    const afterDelete = await connection.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${TEST_SCHEMA}'`
    )
    expect(afterDelete.length).toBe(0)
  })
})
