import { AppModule } from '@/app.module'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { SegipService } from '@/core/external-services/iop/segip/segip.service'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'
import { faker } from '@faker-js/faker/.'
import { HttpMessages } from '@/core/logger/messages'
import { Messages } from '@/common/constants/response-messages'
import { CrearUsuarioDto } from '@/core/usuario/dto/crear-usuario.dto'
import { RolRepository } from '@/core/authorization/repository/rol.repository'
import { UsuarioEstado } from '@/core/usuario/constant'
import { ActualizarUsuarioRolDto } from '@/core/usuario/dto/actualizar-usuario-rol.dto'
import { TipoDocumento } from '@/common/constants'

describe('UsuarioController (e2e)', () => {
  let app: INestApplication
  let mensajeriaServiceError
  let segipServiceError
  let rolRepositorio
  let jwtToken: string
  let nroDocumentoTest: string
  let telefono1: string
  let telefono2: string
  let correoElectronico1: string
  let correoElectronico2: string
  let idUsuarioTest: string
  let idCuentaTest: string

  const contraseniaTest: string = 'AGEPIC.usuario135'
  const mensajeErrorSegip = 'Servicio Segip: No se encontró el registro'

  describe('rol: [ADMINISTRADOR]', () => {
    const credenciales = {
      usuario: 'ADMINISTRADOR',
      contrasena: 'MTIz',
    }

    beforeAll(async () => {
      jest.clearAllMocks()
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(SegipService)
        .useValue({
          contrastar: jest.fn().mockResolvedValue({ finalizado: true }),
        })
        .overrideProvider(MensajeriaService)
        .useValue({
          sendEmail: jest.fn().mockResolvedValue(true),
        })
        .compile()
      app = moduleFixture.createNestApplication()
      app.setGlobalPrefix('api')
      await app.init()

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        })
      )
      rolRepositorio = moduleFixture.get<RolRepository>(RolRepository)
      mensajeriaServiceError =
        moduleFixture.get<MensajeriaService>(MensajeriaService)
      segipServiceError = moduleFixture.get<SegipService>(SegipService)
      //AUTH
      const responseAuth = await request(app.getHttpServer())
        .post('/api/auth')
        .send(credenciales)
        .expect(HttpStatus.OK)
      jwtToken = responseAuth.body.datos.access_token
      jest.setTimeout(30000)

      //Crea nueva cuenta de usuario
      telefono2 = faker.helpers.fromRegExp(`[67][0-9]{7}`)
      correoElectronico2 = faker.internet.email({
        provider: 'gmail.com',
      })
      const url = '/api/usuarios/crear-cuenta'
      const nuevaCuenta = {
        correoElectronico: correoElectronico2,
        contrasenaNueva: contraseniaTest,
        persona: {
          nroDocumento: faker.string.numeric(7),
          nombres: faker.person.firstName().toUpperCase(),
          primerApellido: faker.person.firstName().toUpperCase(),
          segundoApellido: faker.person.lastName().toUpperCase(),
          fechaNacimiento: new Date(
            faker.date
              .birthdate({ min: 18, max: 60, mode: 'age' })
              .toISOString()
              .split('T')[0]
          ),
          telefono: telefono2,
        },
      }
      const response = await request(app.getHttpServer())
        .post(url)
        .send(nuevaCuenta)
        .expect(HttpStatus.CREATED)
      expect(response.body).toEqual({
        finalizado: true,
        mensaje: Messages.NEW_USER_ACCOUNT,
        datos: expect.any(Object),
      })

      idCuentaTest = response.body.datos.id
    }, 20000)

    afterEach(() => {
      jest.clearAllMocks()
      segipServiceError.contrastar.mockResolvedValue({
        finalizado: true,
      })
      mensajeriaServiceError.sendEmail.mockResolvedValue(true)
    })

    afterAll(async () => {
      await app.close()
    })

    describe('TI-01|GET|/api/usuarios', () => {
      const url = '/api/usuarios'
      it('A-001|Debería de obtener el listado de usuarios|200', async () => {
        const response = await request(app.getHttpServer())
          .get(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })

          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_LIST,
            datos: expect.objectContaining({
              filas: expect.any(Object),
              total: expect.any(Number),
            }),
          })
        )
      })
      it('A-002|Debería generar error cuando el usuario no este autenticado|403', async () => {
        const response = await request(app.getHttpServer())
          .get(url)
          .expect(HttpStatus.FORBIDDEN)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: HttpMessages.EXCEPTION_FORBIDDEN,
            codigo: HttpStatus.FORBIDDEN,
          })
        )
      })
    })
    describe('TI-02|POST|/api/usuarios', () => {
      telefono1 = faker.helpers.fromRegExp(`[67][0-9]{7}`)
      correoElectronico1 = faker.internet.email({ provider: 'gmail.com' })
      nroDocumentoTest = faker.string.numeric(7)
      const url = '/api/usuarios'
      const nuevoUsuario: CrearUsuarioDto = {
        correoElectronico: correoElectronico1,
        contrasena: contraseniaTest,
        persona: {
          nroDocumento: nroDocumentoTest,
          nombres: faker.person.firstName().toUpperCase(),
          primerApellido: faker.person.lastName().toUpperCase(),
          segundoApellido: faker.person.lastName().toUpperCase(),
          fechaNacimiento: new Date(
            faker.date
              .birthdate({ min: 18, max: 60, mode: 'age' })
              .toISOString()
              .split('T')[0]
          ),
          telefono: telefono1,
        },
        roles: ['2'],
      }
      it('A-003|Debería crear un nuevo usuario nacional si no se envía el campo tipoDocumento|201', async () => {
        const usuarioNacional = { ...nuevoUsuario }
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(usuarioNacional)
          .expect(HttpStatus.CREATED)
        idUsuarioTest = response.body.datos.id
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_CREATE,
            datos: expect.objectContaining({
              id: idUsuarioTest,
              usuario: usuarioNacional.persona.nroDocumento,
              estado: UsuarioEstado.ACTIVE,
              intentos: 0,
              correoElectronico: usuarioNacional.correoElectronico,
            }),
          })
        )
      })
      it('A-033|Debería crear un nuevo usuario nacional si se envía el campo tipoDocumento CI|201', async () => {
        const usuarioNacional: CrearUsuarioDto = {
          correoElectronico: faker.internet.email({
            provider: 'gmail.com',
          }),
          contrasena: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            tipoDocumento: TipoDocumento.CI,
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.lastName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp(`[67][0-9]{7}`),
          },
          roles: ['2'],
        }
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(usuarioNacional)
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_CREATE,
            datos: expect.objectContaining({
              idPersona: expect.any(String),
              usuario: usuarioNacional.persona.nroDocumento,
              estado: UsuarioEstado.ACTIVE,
              intentos: 0,
              correoElectronico: usuarioNacional.correoElectronico,
            }),
          })
        )
      })
      it('A-034|Debería crear un nuevo usuario extranjero si se envía el campo tipoDocumento CIE|201', async () => {
        const usuarioExtranjero: CrearUsuarioDto = {
          correoElectronico: faker.internet.email({
            provider: 'gmail.com',
          }),
          contrasena: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            tipoDocumento: TipoDocumento.CIE,
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.lastName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp(`[67][0-9]{7}`),
          },
          roles: ['2'],
        }
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(usuarioExtranjero)
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_CREATE,
            datos: expect.objectContaining({
              idPersona: expect.any(String),
              usuario: usuarioExtranjero.persona.nroDocumento,
              estado: UsuarioEstado.ACTIVE,
              intentos: 0,
              correoElectronico: usuarioExtranjero.correoElectronico,
            }),
          })
        )
      })
      it('A-035|Debería de generar un error si no se conecta con SegipService|412', async () => {
        segipServiceError.contrastar = jest
          .fn()
          .mockRejectedValueOnce(new Error(mensajeErrorSegip))
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('A-004|Debería generar un error cuando el usuario ya existe|412', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_USER,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('A-005|Debería generar un error cuando el usuario ingrese un EMAIL registrado previamente|412', async () => {
        nuevoUsuario.persona.nroDocumento = faker.string.numeric(7)
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_EMAIL,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('A-006|Debería generar un error cuando el usuario ingrese un TELEFONO registrado previamente|412', async () => {
        nuevoUsuario.persona.nroDocumento = faker.string.numeric(7)
        nuevoUsuario.correoElectronico = faker.internet.email({
          provider: 'gmail.com',
        })
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_PHONE,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('A-007|Debería de fallar cuando un usuario no este autenticado intente crear al usuario|403', async () => {
        await request(app.getHttpServer())
          .post(url)
          .set({
            accept: 'application/json',
          })
          .expect(HttpStatus.FORBIDDEN)
      })
      it('A-008|Debería generar un error cuando falla la contrastación con SEGIP|412', async () => {
        segipServiceError.contrastar = jest.fn().mockResolvedValueOnce({
          finalizado: false,
          mensaje: mensajeErrorSegip,
        })
        nuevoUsuario.persona.nroDocumento = faker.string.numeric(7)
        nuevoUsuario.correoElectronico = faker.internet.email({
          provider: 'gmail.com',
        })
        nuevoUsuario.persona.telefono = faker.helpers.fromRegExp('[67][0-9]{7}')

        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)

          .expect(HttpStatus.PRECONDITION_FAILED)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: mensajeErrorSegip,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
        expect(segipServiceError.contrastar).toHaveBeenCalledTimes(1)
      })

      it('A-009|Debería crear un usuario aun cuando falle el envío del correo con la contraseña|201', async () => {
        const nuevoUsuario: CrearUsuarioDto = {
          correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          contrasena: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.lastName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp('[67][0-9]{7}'),
          },
          roles: ['2'],
        }

        mensajeriaServiceError.sendEmail = jest
          .fn()
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(nuevoUsuario)
          .expect(HttpStatus.CREATED)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_CREATE,
          })
        )

        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalledTimes(1)
      })
    })
    describe('TI-03|PATCH|/api/usuarios/:id', () => {
      const datosActualizadoUsuario: ActualizarUsuarioRolDto = {
        correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
        roles: ['3'],
        persona: {
          nombres: faker.person.firstName().toUpperCase(),
          nroDocumento: nroDocumentoTest,
          tipoDocumento: TipoDocumento.CI,
        },
      }
      it('A-010|Debería de actualizar los datos de un usuario nacional|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(datosActualizadoUsuario)
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_UPDATE,
            datos: {
              id: idUsuarioTest,
            },
          })
        )
      })
      it('TI-036|Debería de fallar si un usuario intenta cambiar el tipo de documento de CI a CIE|200', async () => {
        segipServiceError.contrastar = jest.fn().mockResolvedValueOnce({
          finalizado: false,
          mensaje: mensajeErrorSegip,
        })
        const datosUsuarioExtranjero: ActualizarUsuarioRolDto = {
          correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          roles: ['3'],
          persona: {
            nombres: faker.person.firstName().toUpperCase(),
            nroDocumento: nroDocumentoTest,
            tipoDocumento: TipoDocumento.CIE,
          },
        }
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(datosUsuarioExtranjero)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: mensajeErrorSegip,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
        expect(segipServiceError.contrastar).toHaveBeenCalledTimes(1)
      })
      it('A-011|Debería de fallar cuando un usuario no este autenticado intente crear al usuario|403', async () => {
        await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}`)
          .set({
            accept: 'application/json',
          })
          .expect(HttpStatus.FORBIDDEN)
      })
      it('A-012|Debería generar un error cuando el usuario no exista en la BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/99999`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(datosActualizadoUsuario)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_USER,
            codigo: HttpStatus.NOT_FOUND,
          })
        )
      })
      it('A-013|Debería generar un error cuando no se pueda hacer la contrastación con el SEGIP|412', async () => {
        segipServiceError.contrastar = jest.fn().mockResolvedValueOnce({
          finalizado: false,
          mensaje: mensajeErrorSegip,
        })
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(datosActualizadoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: mensajeErrorSegip,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
        expect(segipServiceError.contrastar).toHaveBeenCalledTimes(1)
      })
      it('A-037|Debería de generar un error si no se conecta con SegipService|412', async () => {
        segipServiceError.contrastar = jest.fn().mockResolvedValueOnce({
          finalizado: false,
          mensaje: mensajeErrorSegip,
        })
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(datosActualizadoUsuario)
          .expect(HttpStatus.PRECONDITION_FAILED)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: mensajeErrorSegip,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
        expect(segipServiceError.contrastar).toHaveBeenCalledTimes(1)
      })
    })
    describe('TI-04|GET|/api/usuarios/:id', () => {
      it('A-014|Debería obtener la información del usuario por su ID|200', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/usuarios/${idUsuarioTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_DEFAULT,
            datos: expect.any(Object),
          })
        )
      })
      it('A-015|Debería generar error cuando el usuario no este autenticado|403', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/usuarios/${idUsuarioTest}`)
          .expect(HttpStatus.FORBIDDEN)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: HttpMessages.EXCEPTION_FORBIDDEN,
            codigo: HttpStatus.FORBIDDEN,
          })
        )
      })
    })
    describe('TI-05|POST|/api/usuarios/cuenta/ciudadania', () => {
      const nroCiudadano = faker.string.numeric(7)
      it('A-016|Debería crear un nuevo usuario relacionado con Ciudadanía Digital|201', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/usuarios/cuenta/ciudadania')
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send({
            usuario: nroCiudadano,
            roles: ['2'],
            ciudadaniaDigital: true,
          })
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_CREATE,
          })
        )
      })
      it('A-017|Debería generar un error si el usuario ya existe en la BD|412', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/usuarios/cuenta/ciudadania')
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send({
            usuario: nroCiudadano,
            roles: ['2'],
            ciudadaniaDigital: true,
          })
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_USER,
          })
        )
      })
      it('A-018|Debería generar un error si el ROL USUARIO NO EXISTIRIA|404', async () => {
        jest
          .spyOn(rolRepositorio, 'buscarPorNombreRol')
          .mockResolvedValueOnce(null)
        const response = await request(app.getHttpServer())
          .post('/api/usuarios/cuenta/ciudadania')
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send({
            usuario: faker.string.numeric(7),
            roles: ['2'],
            ciudadaniaDigital: true,
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.NO_PERMISSION_FOUND,
          })
        )
      })
    })
    describe('TI-06|PATCH|/api/usuarios/:id/inactivacion', () => {
      it('A-019|Debería generar un error cuando no exista un usuario en la BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/99999/inactivacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.NOT_FOUND,
            timestamp: expect.any(Number),
            mensaje: Messages.INVALID_USER,
          })
        )
      })
      it('A-020|Debería generar un error cuando se intente inactivar el propietario|403', async () => {
        const response = await request(app.getHttpServer())
          .patch('/api/usuarios/1/inactivacion') //id: Administrador
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.FORBIDDEN)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.FORBIDDEN,
            timestamp: expect.any(Number),
            mensaje: Messages.EXCEPTION_OWN_ACCOUNT_ACTION,
          })
        )
      })
      it('A-021|Debería de inactivar a un usuario no propietario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/inactivacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
        expect(HttpStatus.OK)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.SUCCESS_UPDATE,
          datos: {
            id: idUsuarioTest,
            estado: UsuarioEstado.INACTIVE,
          },
        })
      })
    })
    describe('TI-07|PATCH|/api/usuarios/:id/activacion', () => {
      it('A-022|Debería de activar a un usuario no propietario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
        expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_UPDATE,
            datos: expect.objectContaining({
              id: idUsuarioTest,
            }),
          })
        )
      })
      it('A-023|Debería generar un error si un usuario propietario intenta activarse|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/1/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.FORBIDDEN)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            timestamp: expect.any(Number),
            mensaje: Messages.EXCEPTION_OWN_ACCOUNT_ACTION,
            codigo: HttpStatus.FORBIDDEN,
          })
        )
      })
      it('A-024|Debería generar un error si el usuario a activar cuenta no existe en la BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/99999/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_USER,
            codigo: HttpStatus.NOT_FOUND,
          })
        )
      })
      it('A-025|Debería generar un error si un usuario a activar tiene el estado ACTIVO|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_USER,
            codigo: HttpStatus.NOT_FOUND,
          })
        )
      })
      it('A-026|Debería actualizar los datos aunque se genere un error si no se puede enviar correo con la contraseña al usuario|200', async () => {
        //Primero inactivamos la cuenta
        await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/inactivacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        jest
          .spyOn(mensajeriaServiceError, 'sendEmail')
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        //Activamos la cuenta
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.SUCCESS_UPDATE,
          datos: {
            estado: 'ACTIVO',
            id: idUsuarioTest,
          },
        })
        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalled()
        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalledTimes(1)
      })
    })
    describe('TI-08|PATCH|/api/usuarios/:id/restauracion', () => {
      it('A-027|Debería de restaurar la contraseña de un usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/restauracion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_RESTART_PASSWORD,
            datos: expect.objectContaining({
              id: idUsuarioTest,
            }),
          })
        )
      })
      it('A-028|Debería de generar un error si el usario no existe en la BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/99999/restauracion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.NOT_FOUND,
            mensaje: Messages.INVALID_USER,
          })
        )
      })
      it('A-029|Debería de restaurar la contraseña aun si falla el servicio de mensajería|200', async () => {
        jest
          .spyOn(mensajeriaServiceError, 'sendEmail')
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idUsuarioTest}/restauracion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_RESTART_PASSWORD,
            datos: expect.objectContaining({
              id: idUsuarioTest,
            }),
          })
        )
        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalled()
        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalledTimes(1)
      })
    })
    describe('TI-09|PATCH|/api/usuarios/:id/reenviar', () => {
      it('A-030|Debería de reeenviar el córreo de activación|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}/reenviar`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_RESEND_MAIL_ACTIVATION,
            datos: {
              id: idCuentaTest,
              estado: UsuarioEstado.PENDING,
            },
          })
        )
      })
      it('A-031|Debería fallar si no existe el usuario en la BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/99999/reenviar`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.NOT_FOUND,
            timestamp: expect.any(Number),
            mensaje: Messages.INVALID_USER,
          })
        )
      })
      it('A-032|Debería de fallar si existe un error con el servicio de mensajería|200', async () => {
        jest
          .spyOn(mensajeriaServiceError, 'sendEmail')
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}/reenviar`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_RESEND_MAIL_ACTIVATION,
            datos: {
              id: idCuentaTest,
              estado: UsuarioEstado.PENDING,
            },
          })
        )
      })
    })
  })
})
