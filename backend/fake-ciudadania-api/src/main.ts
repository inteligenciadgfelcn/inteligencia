import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import * as path from 'path'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Templates Handlebars
  app.setBaseViewsDir(path.join(process.cwd(), 'views'))
  app.setViewEngine('hbs')

  // Archivos estáticos (SVG, PNG del fake)
  app.use('/public', express.static(path.join(process.cwd(), 'views', 'public')))

  // Parse body de formularios HTML (application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  // CORS — solo para el auth-backend
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })

  const port = parseInt(process.env.PORT || '3001')
  await app.listen(port)

  console.log(`\n🔐 Fake Ciudadanía Digital corriendo en: http://localhost:${port}`)
  console.log(`📋 Discovery:  http://localhost:${port}/.well-known/openid-configuration`)
  console.log(`🔑 JWKS:       http://localhost:${port}/jwks`)
  console.log(`\n⚠️  FAKE - Solo para desarrollo. Reemplazar OIDC_ISSUER para producción.\n`)
}

bootstrap().catch(console.error)
