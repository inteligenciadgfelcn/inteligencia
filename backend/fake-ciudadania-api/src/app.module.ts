import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OidcModule } from './oidc/oidc.module'
import { InteraccionModule } from './interaccion/interaccion.module'
import { InternalModule } from './internal/internal.module'
import { CiudadaniaUsuario } from './database/entities/ciudadania-usuario.entity'
import { CiudadaniaOtp } from './database/entities/ciudadania-otp.entity'
import { CiudadaniaSession } from './database/entities/ciudadania-session.entity'

const schema = process.env.DB_SCHEMA_FAKE || 'fake_ciudadania'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'felcn_auth_v3',
      ssl: process.env.DB_USE_SSL === 'true',
      schema,
      entities: [CiudadaniaUsuario, CiudadaniaOtp, CiudadaniaSession],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    OidcModule,
    InteraccionModule,
    InternalModule,
  ],
})
export class AppModule {}
