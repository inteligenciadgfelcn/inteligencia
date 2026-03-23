import { LoggerService, QueryExecutionTime, SQLLogger } from '@/core/logger'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

/**
 * Nombres de las conexiones a base de datos
 */
export const DB_AUTH = 'default' // felcn_auth (autenticación y autorización)
export const DB_ASIG_CASOS = 'asig-casos' // felcn_asignacion_casos
export const DB_S2I = 's2i' // felcn_s2i
export const DB_SIII = 'siii' // felcn_siii
export const DB_SII = 'sii' // felcn_siii

@Module({
  imports: [
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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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
          __dirname + '/../../../core/usuario/**/*.entity{.ts,.js}',
          __dirname + '/../../../core/authentication/**/*.entity{.ts,.js}',
          __dirname + '/../../../core/authorization/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN 2: ASIG-CASOS
    // Base de datos: felcn_asignacion_casos
    // Tablas: asignacion, servicio, departamento, unidad, letra, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_ASIG_CASOS,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host:
          configService.get<string>('DB_ASIG_HOST') ||
          configService.get<string>('DB_HOST'),
        port:
          configService.get<number>('DB_ASIG_PORT') ||
          configService.get<number>('DB_PORT'),
        username:
          configService.get<string>('DB_ASIG_USERNAME') ||
          configService.get<string>('DB_USERNAME'),
        password:
          configService.get<string>('DB_ASIG_PASSWORD') ||
          configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_ASIG_DATABASE'),
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
          __dirname +
            '/../../../application/sunesis/asig-casos/**/*.entity{.ts,.js}',
          __dirname +
            '/../../../application/inteligencia/felcn_asignacion_caso/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN 3: S2I
    // Base de datos: felcn_s2i
    // Tablas: usuario, rol, grado, unidad, distrital, grupo, menu, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_S2I,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host:
          configService.get<string>('DB_S2I_HOST') ||
          configService.get<string>('DB_HOST'),
        port:
          configService.get<number>('DB_S2I_PORT') ||
          configService.get<number>('DB_PORT'),
        username:
          configService.get<string>('DB_S2I_USERNAME') ||
          configService.get<string>('DB_USERNAME'),
        password:
          configService.get<string>('DB_S2I_PASSWORD') ||
          configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_S2I_DATABASE'),
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
          __dirname + '/../../../application/sunesis/s2i/**/*.entity{.ts,.js}',
        ],
      }),
    }),

    // =============================================
    // CONEXIÓN 4: SIII
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
          __dirname + '/../../../application/inteligencia/felcn_siii/**/*.entity{.ts,.js}',
        ],
      }),
    }),

     // =============================================
    // CONEXIÓN 5: SII
    // Base de datos: felcn_sii
    // Tablas: usuario, rol, grado, unidad, distrital, grupo, menu, etc.
    // =============================================
    TypeOrmModule.forRootAsync({
      name: DB_SII,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host:
          configService.get<string>('DB_SII_HOST') ||
          configService.get<string>('DB_HOST'),
        port:
          configService.get<number>('DB_SII_PORT') ||
          configService.get<number>('DB_PORT'),
        username:
          configService.get<string>('DB_SII_USERNAME') ||
          configService.get<string>('DB_USERNAME'),
        password:
          configService.get<string>('DB_SII_PASSWORD') ||
          configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_SII_DATABASE'),
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
          __dirname + '/../../../application/inteligencia/felcn_sii/**/*.entity{.ts,.js}',
        ],
      }),
    }),
  ],
})
export class DataBaseModule {}
