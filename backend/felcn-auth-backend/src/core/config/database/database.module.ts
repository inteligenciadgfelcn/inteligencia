import { LoggerService, QueryExecutionTime, SQLLogger } from '@/core/logger'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '../../../../**/*.entity{.ts,.js}'],
        keepConnectionAlive: configService.get('NODE_ENV') !== 'production',
        synchronize: false,
        extra: {
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
          options:
            '-c idle_in_transaction_session_timeout=30000 -c lock_timeout=10000 -c statement_timeout=60000',
        },
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
      }),
    }),
  ],
})
export class DataBaseModule {}
