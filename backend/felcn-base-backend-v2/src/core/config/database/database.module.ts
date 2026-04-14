import { LoggerService, QueryExecutionTime, SQLLogger } from '@/core/logger'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

/**
 * Nombres de las conexiones a base de datos
 */
export const DB_SIII = 'siii' // felcn_siii

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
        ],
      }),
    }),
  ],
})
export class DataBaseModule {}
