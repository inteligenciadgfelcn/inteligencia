import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from '@/common/constants'

import { CatalogoFiscaliaModule } from '@/application/catalogo-fiscalia/catalogo-fiscalia.module'
import { LgiModule } from '@/application/lgi/lgi.module'

export function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addServer(`http://localhost:${process.env.PORT}/api/`)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document)

  const fiscaliaOptions = new DocumentBuilder()
    .setTitle('API Fiscalía')
    .setDescription('Servicios expuestos para interoperabilidad con Fiscalía')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT}/api/`)
    .addBearerAuth()
    .build()

  const fiscaliaDocument = SwaggerModule.createDocument(app, fiscaliaOptions, {
    include: [CatalogoFiscaliaModule],
    deepScanRoutes: false,
  })

  SwaggerModule.setup('fiscalia/docs', app, fiscaliaDocument)

  const lgiOptions = new DocumentBuilder()
    .setTitle('API PRODUCTO 2')
    .setDescription('Servicios de interoperabilidad LGI para el producto 2')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT}/api/`)
    .addBearerAuth()
    .build()

  const lgiDocument = SwaggerModule.createDocument(app, lgiOptions, {
    include: [LgiModule],
    deepScanRoutes: true,
  })

  SwaggerModule.setup('lgi/docs', app, lgiDocument)
}