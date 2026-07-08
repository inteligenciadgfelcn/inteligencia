import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from '@/common/constants'

import { FiscaliaModule } from '@/application/fiscalia/fiscalia.module'
import { LgiModule } from '@/application/lgi/lgi.module'

const addServers = (builder: DocumentBuilder) => {
  if (process.env.SWAGGER_SERVER_URL) {
    builder.addServer(process.env.SWAGGER_SERVER_URL)
  } else {
    builder.addServer(`http://localhost:${process.env.PORT}/api/`)
  }
  return builder
}

export function createSwagger(app: INestApplication) {
  const options = addServers(
    new DocumentBuilder()
      .setTitle(SWAGGER_API_NAME)
      .setDescription(SWAGGER_API_DESCRIPTION)
      .setVersion(SWAGGER_API_CURRENT_VERSION)
  )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document)

  // Endpoints abiertos: la seguridad la aplica el hub de interoperabilidad.
  const fiscaliaOptions = addServers(
    new DocumentBuilder()
      .setTitle('API Fiscalía (MP → POL)')
      .setDescription(
        'Servicios que consume el Ministerio Público para enviar información ' +
          'de casos y consultar catálogos. Contrato: snake_case, REST anidado, ' +
          '201/204, errores RFC 9457 (docs/fiscalia/PROPUESTA-APIS-FISCALIA.md)'
      )
      .setVersion('1.0')
  ).build()

  // deepScanRoutes: false — el módulo importa los módulos LGI solo para
  // reutilizar sus services de catálogo; sus CRUD internos (JWT) no deben
  // aparecer en el swagger de fiscalía.
  const fiscaliaDocument = SwaggerModule.createDocument(app, fiscaliaOptions, {
    include: [FiscaliaModule],
    deepScanRoutes: false,
  })

  SwaggerModule.setup('fiscalia/docs', app, fiscaliaDocument)

  const lgiOptions = addServers(
    new DocumentBuilder()
      .setTitle('API PRODUCTO 2')
      .setDescription('Servicios de interoperabilidad LGI para el producto 2')
      .setVersion('1.0')
  )
    .addBearerAuth()
    .build()

  const lgiDocument = SwaggerModule.createDocument(app, lgiOptions, {
    include: [LgiModule],
    deepScanRoutes: true,
  })

  SwaggerModule.setup('lgi/docs', app, lgiDocument)
}
