import { LoggerService, QueryExecutionTime, SQLLogger } from '@/core/logger'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

/**
 * Nombres de las conexiones a base de datos
 */
export const DB_AUTH = 'auth' // felcn_auth
export const DB_ASIG_CASOS = 'asig-casos' // felcn_asignacion_casos
export const DB_SII = 'sii' // felcn_sii
export const DB_SIII = 'siii' // felcn_siii
export const DB_SOSPECHOSO = 'sospechoso' // felcn_sospechoso
export const DB_LGI = 'lgi' // felcn_lgi

@Module({
  imports: [
    // =============================================
    // CONEXIÓN: SIII
    // Base de datos: felcn_siii
    // Esquemas: parametricas (lookups), public (operativos)
    // Tablas: operativo, tipo_droga, pais, detenido, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_SIII,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host:
          configService.get<string>('DB_SIII_HOST') ||
          configService.get<string>('DB_HOST'),
        port:
          configService.get<number>('DB_SIII_PORT') ||
          configService.get<number>('DB_PORT'),
        username:
          configService.get<string>('DB_SIII_USERNAME') ||
          configService.get<string>('DB_USERNAME'),
        password:
          configService.get<string>('DB_SIII_PASSWORD') ||
          configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_SIII_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          configService.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                configService.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          configService.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: configService.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
          __dirname + '/../../../application/sunesis/siii/**/*.entity{.ts,.js}',
          __dirname + '/../../../application/inteligencia/**/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN DEFAULT: AUTH
    // Base de datos: felcn_auth
    // Esquemas: usuarios (usuarios, roles, permisos), proyecto (otros)
    // Tablas: usuarios, personas, roles, usuarios_roles, modulos, casbin_rule, refresh_tokens
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_AUTH,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host:
          config.get<string>('DB_AUTH_HOST') ||
          config.get<string>('DB_HOST'),
        port: Number(
          config.get('DB_AUTH_PORT') || config.get('DB_PORT'),
        ),
        username:
          config.get<string>('DB_AUTH_USERNAME') ||
          config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('DB_AUTH_PASSWORD') ||
          config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_AUTH_DATABASE') || config.get<string>('DB_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          config.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                config.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          config.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: config.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
        ],
      }),
    }),


    // =============================================
    // CONEXIÓN: ASIG-CASOS
    // Base de datos: felcn_asignacion_casos
    // Tablas: asignacion, servicio, departamento, unidad, letra, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_ASIG_CASOS,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host:
          config.get<string>('DB_ASIG_CASOS_HOST') ||
          config.get<string>('DB_HOST'),
        port: Number(
          config.get('DB_ASIG_CASOS_PORT') ||
          config.get('DB_PORT'),
        ),
        username:
          config.get<string>('DB_ASIG_CASOS_USERNAME') ||
          config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('DB_ASIG_CASOS_PASSWORD') ||
          config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_ASIG_CASOS_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          config.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                config.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          config.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: config.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
          __dirname +
          '/../../../application/inteligencia/felcn_asignacion_caso/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN: SII
    // Base de datos: felcn_sii
    // Tablas: usuario, rol, grado, unidad, distrital, grupo, menu, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_SII,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host:
          config.get<string>('DB_SII_HOST') ||
          config.get<string>('DB_HOST'),
        port: Number(
          config.get('DB_SII_PORT') || config.get('DB_PORT'),
        ),
        username:
          config.get<string>('DB_SII_USERNAME') ||
          config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('DB_SII_PASSWORD') ||
          config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_SII_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          config.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                config.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          config.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: config.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
          __dirname +
          '/../../../application/inteligencia/felcn_sii/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN: SOSPECHOSOS
    // Base de datos: felcn_sospechosos
    // Tablas: plan_operacion, categoria_operativo, continente, departamento, detenido, distrital, estado, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_SOSPECHOSO,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host:
          config.get<string>('DB_SOSPECHOSO_HOST') ||
          config.get<string>('DB_HOST'),
        port: Number(
          config.get('DB_SOSPECHOSO_PORT') ||
          config.get('DB_PORT'),
        ),
        username:
          config.get<string>('DB_SOSPECHOSO_USERNAME') ||
          config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('DB_SOSPECHOSO_PASSWORD') ||
          config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_SOSPECHOSO_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          config.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                config.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          config.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: config.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
          __dirname +
          '/../../../application/inteligencia/felcn_sospechoso/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN: LGI
    // Base de datos: felcn_lgi
    // Schema: public
    // Tablas: asignacion, operativo, investigador, departamentosc, distritales, localidad, provincias
    // Origen: sistema legacy GIAEF migrado a PostgreSQL
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_LGI,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host:
          config.get<string>('DB_LGI_HOST') ||
          config.get<string>('DB_HOST'),
        port: Number(
          config.get('DB_LGI_PORT') || config.get('DB_PORT'),
        ),
        username:
          config.get<string>('DB_LGI_USERNAME') ||
          config.get<string>('DB_USERNAME'),
        password:
          config.get<string>('DB_LGI_PASSWORD') ||
          config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_LGI_DATABASE'),
        keepConnectionAlive: true,
        synchronize: false,
        ssl:
          config.get('DB_USE_SSL') === 'true'
            ? {
              rejectUnauthorized:
                config.get('DB_VERIFY_SSL') === 'true',
            }
            : false,
        subscribers:
          config.get('LOG_SQL') === 'true' ? [QueryExecutionTime] : [],
        logger: new SQLLogger({
          logger: LoggerService.getInstance(),
          level: {
            query: config.get('LOG_SQL') === 'true',
            error: true,
          },
        }),
        entities: [
          __dirname +
          '/../../../application/sunesis/siii/investigacion/lgi/**/*.entity{.ts,.js}',
        ],
      }),
    }),
  ],
})
export class DataBaseModule { }
