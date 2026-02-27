import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PdfModule } from './modules/reports/pdf/pdf.module';
import { ExcelModule } from './modules/reports/excel/excel.module';
import { UploadModule } from './modules/upload/upload.module';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiModule} from './modules/ApiModule';
import { UserModule } from './modules/usuario/user/user.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { UserContextInterceptor } from './common/interceptors/user-context.interceptor';
import { AuditoriaAccesoInterceptor } from './common/interceptors/auditoria-acceso.interceptor';
@Module({
  imports: [
    AuthModule,
    AuditoriaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ApiModule,
    DatabaseModule,
    HealthModule,
    PdfModule,
    ExcelModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
   providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditoriaAccesoInterceptor,
    },
  ],
})
export class AppModule {}
