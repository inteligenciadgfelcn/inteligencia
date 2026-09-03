/**
 * Sistema Nacional de Inteligencia de la FELCN — Fase 1
 * Autoría: Ing. Erika Carmiña Camargo Salvatierra · Ing. Eitner Montero
 * Proyecto BOLEU1 (UNODC) — DG-FELCN
 */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { CustomValidationPipe } from '@/common/pipes'
import dotenv from 'dotenv'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { LoggerModule, printInfo, printLogo, printRoutes } from '@/core/logger'
import packageJson from '../package.json'
import { createSwagger } from './swagger/swagger.config'
dotenv.config()

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  })

  app.useWebSocketAdapter(new IoAdapter(app))
  await LoggerModule.initialize(app)

  const configService = app.get(ConfigService)

  // swagger
  if (configService.get('NODE_ENV') !== 'production') {
    createSwagger(app)
  }

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
  app.use(cookieParser())
  app.use(express.static('public'))

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use(helmet.hidePoweredBy())
  app.use(helmet())
  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN') || 'api')
  app.useGlobalPipes(new CustomValidationPipe())

  const port = configService.get('PORT')
  await app.listen(port)

  printRoutes(app)
  printLogo()
  printInfo({
    env: String(process.env.NODE_ENV),
    name: packageJson.name,
    port: port,
    version: packageJson.version,
  })
}

void bootstrap()
