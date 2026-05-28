
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import listEndpoints from 'express-list-endpoints';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(listEndpoints(app.getHttpAdapter().getInstance()._router));
  await app.close();
}
bootstrap();
