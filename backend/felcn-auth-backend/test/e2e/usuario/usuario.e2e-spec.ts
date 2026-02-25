import { AppModule } from '@/app.module'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { SegipService } from '@/core/external-services/iop/segip/segip.service'
import { MensajeriaService } from '@/core/external-services/mensajeria/mensajeria.service'
import { faker } from '@faker-js/faker/.'
import { HttpMessages } from '@/core/logger/messages'
import { Messages } from '@/common/constants/response-messages'
import { RolRepository } from '@/core/authorization/repository/rol.repository'
import { UsuarioEstado } from '@/core/usuario/constant'
import path from 'path'
import { TextService } from '@/common/lib/text.service'
import { JwtService } from '@nestjs/jwt'
import * as fs from 'fs'
import { TipoDocumento } from '@/common/constants'

describe('UsuarioController (e2e)', () => {
  const TIME_OUT = 30000 //tiempo de espera para cada test
  const FILE_PATH = path.join(__dirname, '..', '..', '..', 'public', 'mocks') //ruta base para almacenar archivos de prueba
  const FILE_UPLOADS_PATH = path.join(__dirname, '..') //ruta para almacenar archivos subidos de prueba
  const NAME_FILE_PROFILE_PHOTO = 'foto_perfil.jpg'
  const NAME_FILE_NON_PROFILE_PHOTO = 'archivo.txt'

  let mensajeriaServiceError
  let rolRepositorio
  let segipServiceError
  let jwtService
  let app: INestApplication

  let jwtToken: string
  let telefono: string
  let jwtTokenFake: string
  let correoElectronico: string
  let idCuentaTest: string

  const codigoTransaccionesTest = {
    activacion: faker.string.uuid(),
    recuperacion: faker.string.uuid(),
    transaccion: faker.string.uuid(),
    desbloqueo: faker.string.uuid(),
  }

  const contraseniaTest: string = 'AGEPIC.usuario135'
  const nroDocumentoTest = faker.string.numeric(7)
  const credenciales = {
    usuario: nroDocumentoTest,
    contrasena: contraseniaTest,
  }
  const correoElectronico2 = faker.internet.email({
    provider: 'gmail.com',
  }) //correo de comparación para pruebas
  const telefono2 = faker.helpers.fromRegExp('[67][0-9]{7}') //teléfono de comparación para pruebas
  const mensajeErrorSegip = 'Servicio Segip: No se encontró el registro'
  describe('Usuario: rol[USUARIO]', () => {
    beforeAll(async () => {
      process.env.STORAGE_NFS_PATH = FILE_UPLOADS_PATH //seteamos la ruta de almacenamiento de archivos para pruebas

      const profilePath = path.join(FILE_PATH, NAME_FILE_PROFILE_PHOTO)
      const nonProfilePath = path.join(FILE_PATH, NAME_FILE_NON_PROFILE_PHOTO)

      const profileExists = fs.existsSync(profilePath)
      const nonProfileExists = fs.existsSync(nonProfilePath)

      if (!profileExists || !nonProfileExists) {
        console.error('Archivos requeridos no encontrados:')
        if (!profileExists) console.error(`   - Falta: ${profilePath}`)
        if (!nonProfileExists) console.error(`   - Falta: ${nonProfilePath}`)
        process.exit(0)
      }

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

      jwtService = moduleFixture.get(JwtService)

      jwtTokenFake = jwtService.sign({
        id: '99999',
        rol: 'invitado',
        permisos: ['crear_usuario', 'editar_usuario'],
      })

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
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
    afterAll(async () => {
      await app.close()
    })

    describe('TI-10|POST|/api/usuarios/crear-cuenta', () => {
      const url = '/api/usuarios/crear-cuenta'
      telefono = faker.helpers.fromRegExp(`[67][0-9]{7}`)
      correoElectronico = faker.internet.email({
        provider: 'gmail.com',
      })

      const nuevaCuenta = {
        correoElectronico: correoElectronico,
        contrasenaNueva: contraseniaTest,
        persona: {
          nroDocumento: nroDocumentoTest,
          nombres: faker.person.firstName().toUpperCase(),
          primerApellido: faker.person.firstName().toUpperCase(),
          segundoApellido: faker.person.lastName().toUpperCase(),
          fechaNacimiento: new Date(
            faker.date
              .birthdate({ min: 18, max: 60, mode: 'age' })
              .toISOString()
              .split('T')[0]
          ),
          telefono: telefono,
        },
      }
      it(
        'U-001|Debería crear una nueva cuenta para una persona nacional si no se envía el tipoDocumento|201',
        async () => {
          jest
            .spyOn(TextService, 'generateUuid')
            .mockReturnValue(codigoTransaccionesTest.activacion)
          const response = await request(app.getHttpServer())
            .post(url)
            .send(nuevaCuenta)
            .expect(HttpStatus.CREATED)
          idCuentaTest = response.body.datos.id
          expect(response.body).toEqual({
            finalizado: true,
            mensaje: Messages.NEW_USER_ACCOUNT,
            datos: expect.objectContaining({
              id: idCuentaTest,
              usuario: nroDocumentoTest,
              correoElectronico: correoElectronico,
              estado: UsuarioEstado.PENDING,
            }),
          })
        },
        TIME_OUT
      )
      it('U-048|Debería crear un nuevo usuario nacional si se envía el campo tipoDocumento CI|201', async () => {
        const nuevaCuentaNacional = {
          correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          contrasenaNueva: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            tipoDocumento: TipoDocumento.CI,
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.firstName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp('[67][0-9]{7}'),
          },
        }
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuentaNacional)
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.NEW_USER_ACCOUNT,
          datos: expect.objectContaining({
            usuario: nuevaCuentaNacional.persona.nroDocumento,
            correoElectronico: nuevaCuentaNacional.correoElectronico,
            estado: UsuarioEstado.PENDING,
          }),
        })
      })
      it('U-049|Debería crear un nuevo usuario extranjero si se envía el campo tipoDocumento CIE|201', async () => {
        const nuevaCuentaExtranjero = {
          correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          contrasenaNueva: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            tipoDocumento: TipoDocumento.CIE,
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.firstName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp('[67][0-9]{7}'),
          },
        }
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuentaExtranjero)
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.NEW_USER_ACCOUNT,
          datos: expect.objectContaining({
            usuario: nuevaCuentaExtranjero.persona.nroDocumento,
            correoElectronico: nuevaCuentaExtranjero.correoElectronico,
            estado: UsuarioEstado.PENDING,
          }),
        })
      })
      it('U-002|Debería de mostrar error cuando exista un usuario previamente registrado|412', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.EXISTING_USER,
          })
        )
        expect(response.body).toHaveProperty('mensaje')
        expect(response.body.mensaje).toBeDefined()
      })
      it('U-003|Debería de mostrar error cuando exista un correo previamente registrado|412', async () => {
        nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.EXISTING_EMAIL,
          })
        )
      })
      it(
        'U-004|Debería de mostrar error cuando exista un telefono previamente registrado|412',
        async () => {
          nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
          nuevaCuenta.correoElectronico = faker.internet.email({
            provider: 'gmail.com',
          })
          const response = await request(app.getHttpServer())
            .post(url)
            .send(nuevaCuenta)
            .expect(HttpStatus.PRECONDITION_FAILED)
          expect(response.body).toEqual(
            expect.objectContaining({
              finalizado: false,
              codigo: HttpStatus.PRECONDITION_FAILED,
              timestamp: expect.any(Number),
              mensaje: Messages.EXISTING_PHONE,
            })
          )
        },
        TIME_OUT
      )
      it('U-005|Debería de mostrar error cuando no exista el ROL USUARIO EN LA BD|412', async () => {
        nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
        nuevaCuenta.correoElectronico = faker.internet.email({
          provider: 'gmail.com',
        })
        nuevaCuenta.persona.telefono = faker.helpers.fromRegExp(`[67][0-9]{7}`)
        jest
          .spyOn(rolRepositorio, 'buscarPorNombreRol')
          .mockResolvedValueOnce(null)
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.NO_PERMISSION_FOUND,
          })
        )
      })
      it('U-006|Debería de mostrar error cuando el nivel del password sea incorrecta|412', async () => {
        nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
        nuevaCuenta.correoElectronico = faker.internet.email({
          provider: 'gmail.com',
        })
        nuevaCuenta.persona.telefono = faker.helpers.fromRegExp(`[67][0-9]{7}`)
        nuevaCuenta.contrasenaNueva = 'QWERTY'
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.INVALID_PASSWORD_SCORE,
          })
        )
      })
      it('U-007|Debería de fallar cuando se envíe campos obligatorios incompletos|412', async () => {
        const cuentaIncompleta = JSON.parse(JSON.stringify(nuevaCuenta))
        delete cuentaIncompleta.persona.nroDocumento
        nuevaCuenta.contrasenaNueva = contraseniaTest
        const response = await request(app.getHttpServer())
          .post(url)
          .send(cuentaIncompleta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            mensaje: Messages.INVALID_PASSWORD_SCORE,
          })
        )
      })
      it('U-008|Debería de mostrar error cuando no exista contrastación con el SEGIP|412', async () => {
        nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
        nuevaCuenta.correoElectronico = faker.internet.email({
          provider: 'gmail.com',
        })
        nuevaCuenta.persona.telefono = faker.helpers.fromRegExp('[67][0-9]{7}')
        jest
          .spyOn(segipServiceError, 'contrastar')
          .mockResolvedValueOnce(new Error('Servicio con SEGIP caído'))
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: HttpMessages.EXCEPTION_PRECONDITION_FAILED,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('U-009|Debería crear un usuario, aun cuando no se pueda enviar correo de activación de cuenta|201', async () => {
        nuevaCuenta.persona.nroDocumento = faker.string.numeric(7)
        nuevaCuenta.correoElectronico = correoElectronico2
        nuevaCuenta.persona.telefono = telefono2
        jest
          .spyOn(mensajeriaServiceError, 'sendEmail')
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.NEW_USER_ACCOUNT,
          })
        )
      })
      it('U-050|Debería de generar un error si no se conecta con SegipService|412', async () => {
        segipServiceError.contrastar = jest.fn().mockResolvedValueOnce({
          finalizado: false,
          mensaje: mensajeErrorSegip,
        })
        const nuevaCuenta = {
          correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          contrasenaNueva: contraseniaTest,
          persona: {
            nroDocumento: faker.string.numeric(7),
            tipoDocumento: TipoDocumento.CIE,
            nombres: faker.person.firstName().toUpperCase(),
            primerApellido: faker.person.firstName().toUpperCase(),
            segundoApellido: faker.person.lastName().toUpperCase(),
            fechaNacimiento: new Date(
              faker.date
                .birthdate({ min: 18, max: 60, mode: 'age' })
                .toISOString()
                .split('T')[0]
            ),
            telefono: faker.helpers.fromRegExp('[67][0-9]{7}'),
          },
        }
        const response = await request(app.getHttpServer())
          .post(url)
          .send(nuevaCuenta)
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
    describe('TI-11|POST|/api/usuarios/cuenta/activacion', () => {
      const url = '/api/usuarios/cuenta/activacion'
      it('U-010|Debería de activar una cuenta de usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .send({
            codigo: codigoTransaccionesTest.activacion,
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.ACCOUNT_ACTIVED_SUCCESSFULLY,
            datos: {
              id: idCuentaTest,
              estado: UsuarioEstado.ACTIVE,
            },
          })
        )
      })
      it('U-011|Debería fallar si no existe un usuario asociado la código|412', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .send({
            codigo: faker.string.uuid(),
          })
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.INVALID_USER,
          })
        )
      })
    })
    describe('TI-12|POST|/api/usuarios/cuenta/perfil', () => {
      const url = '/api/usuarios/cuenta/perfil'
      it('U-012|Debería obtener la información del perfil del usuario|200', async () => {
        //AUTH
        const responseAuth = await request(app.getHttpServer())
          .post('/api/auth')
          .send(credenciales)
          .expect(HttpStatus.OK)
        jwtToken = responseAuth.body.datos.access_token
        expect(jwtToken).toBeDefined()

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
            mensaje: Messages.SUCCESS_DEFAULT,
            datos: expect.any(Object),
          })
        )
      }, 20000)
      it('U-013|Debería generar error cuando el usuario no este autenticado|403', async () => {
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
      it('U-014|Debería generar error cuando el usuario este autenticado pero no exista en BD|404', async () => {
        const response = await request(app.getHttpServer())
          .get(url)
          .set({
            authorization: `Bearer ${jwtTokenFake}`,
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
    })
    describe('TI-13|PATCH|/api/usuarios/cuenta/perfil', () => {
      const url = '/api/usuarios/cuenta/perfil'
      const perfilActualizado = {
        nombres: faker.person.firstName().toUpperCase(),
        primerApellido: faker.person.middleName().toUpperCase(),
        segundoApellido: faker.person.lastName().toUpperCase(),
      }
      it('U-015|Debería de actualizar el perfil del usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(perfilActualizado)
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: 'Registro actualizado con éxito.',
            datos: expect.any(Object),
          })
        )
      })
      it('U-016|Debería generar error cuando el usuario este autenticado pero no exista en BD|404', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtTokenFake}`,
            accept: 'application/json',
          })
          .send(perfilActualizado)
          .expect(HttpStatus.NOT_FOUND)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_USER,
            codigo: HttpStatus.NOT_FOUND,
          })
        )
      })
      it('U-017|Debería generar error si se intenta actualizar con un telefono ya existente|412', async () => {
        const mockPerfilActualizadoError = {
          ...perfilActualizado,
          telefono: telefono2,
        }
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(mockPerfilActualizadoError)
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_PHONE,
            codigo: HttpStatus.PRECONDITION_FAILED,
          })
        )
      })
      it('U-018|Debería generar error si se intenta actualizar con un correo ya existente|400', async () => {
        const mockPerfilActualizadoError = {
          ...perfilActualizado,
          correoElectronico: correoElectronico2,
        }
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .send(mockPerfilActualizadoError)
          .expect(HttpStatus.BAD_REQUEST)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.EXISTING_EMAIL,
            codigo: HttpStatus.BAD_REQUEST,
          })
        )
      })
      it('U-019|Debería generar error si se intenta actualizar sin estar autenticado|403', async () => {
        await request(app.getHttpServer())
          .patch(url)
          .expect(HttpStatus.FORBIDDEN)
      })
    })
    describe('TI-14|PATCH|/api/usuarios/cuenta/foto', () => {
      const url = '/api/usuarios/cuenta/foto'
      const filePath = path.join(FILE_PATH, NAME_FILE_PROFILE_PHOTO)
      it('U-020|Debería de actualizar el perfil del usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .attach('foto', filePath)
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            id: idCuentaTest,
            mensaje: 'Foto de perfil actualizada correctamente',
            urlFoto: expect.stringMatching(/uploads\/profile-photos/),
          })
        )
      })

      it('U-021|Debería devolver error si no se envía la foto|400', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.BAD_REQUEST)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: expect.any(String),
          })
        )
      })

      it('U-022|Debería devolver error si no el usuario no esta autenticado|403', async () => {
        await request(app.getHttpServer())
          .patch(url)
          .expect(HttpStatus.FORBIDDEN)
      })

      it('U-023|Debería devolver error si el archivo no es imagen|400', async () => {
        const filePath = path.join(FILE_PATH, NAME_FILE_NON_PROFILE_PHOTO)
        const response = await request(app.getHttpServer())
          .patch(url)
          .set('Authorization', `Bearer ${jwtToken}`)
          .attach('foto', filePath)
          .expect(HttpStatus.BAD_REQUEST)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: expect.any(String),
          })
        )
      })
    })
    //!COMENTAR ESTE TEST PARA VISUALIZAR COMO SE ALMACENAN LAS IMAGENES EN TEST
    describe('TI-15|DELETE|/api/usuarios/cuenta/foto', () => {
      const url = '/api/usuarios/cuenta/foto'
      const responseMessage = 'Foto de perfil eliminada correctamente'
      it('U-024|Debería de eliminarse la foto de perfil del usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .delete(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)

        expect(response.body).toEqual(
          expect.objectContaining({
            mensaje: responseMessage,
          })
        )
      })
      it('U-025|Debería generar error si el usuario no existe en la DB|404', async () => {
        const response = await request(app.getHttpServer())
          .delete(url)
          .set({
            authorization: `Bearer ${jwtTokenFake}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.NOT_FOUND)

        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.NOT_FOUND,
            timestamp: expect.any(Number),
            mensaje: 'Usuario no encontrado',
          })
        )
      })

      it('U-026|Debería de eliminarse la foto de perfil del usuario|200', async () => {
        process.env.STORAGE_NFS_PATH = path.join(__dirname, '..', 'test')

        const response = await request(app.getHttpServer())
          .delete(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)

        expect(response.body).toEqual(
          expect.objectContaining({
            mensaje: responseMessage,
          })
        )
      })
      it('U-027|Debería no fallar si el usuario no tiene foto|200', async () => {
        const response = await request(app.getHttpServer())
          .delete(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
          .expect(HttpStatus.OK)

        expect(response.body).toEqual(
          expect.objectContaining({
            mensaje: responseMessage,
          })
        )
      })
    })
    describe('TI-16|GET|/api/usuarios', () => {
      it('U-028|Debería de generar error por usuario no autorizado|403', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/usuarios?rol=USUARIOS')
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-17|POST|/api/usuarios', () => {
      const url = '/api/usuarios'
      it('U-029|Debería crear un nuevo usuario|403', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-18|GET|/api/usuarios/:id', () => {
      it('U-030|Debería obtener la información del usuario por su ID|403', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/usuarios/${idCuentaTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-19|PATCH|/api/usuarios/:id/inactivacion', () => {
      it('U-031|Debería generar un error cuando no exista un usuario en la BD|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest} /inactivacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-20|PATCH|/api/usuarios/:id/activacion', () => {
      it('U-032|Debería de activar a un usuario no propietario|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}/activacion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-21|PATCH|/api/usuarios/:id', () => {
      it('U-033|Debería de actualizar los datos de un usuario|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-22|POST|/api/usuarios/cuenta/ciudadania', () => {
      const url = '/api/usuarios/cuenta/ciudadania'
      it('U-034|Debería crear un nuevo usuario relacionado con Ciudadanía Digital|403', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-23|PATCH|/api/usuarios/:id/restauracion', () => {
      it('U-035|Debería de restaurar la contraseña de un usuario|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}/restauracion`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-24|PATCH|/api/usuarios/:id/reenviar', () => {
      it('U-036|reenviar [PATCH]: Debería generar error a un usuario no autorizado|403', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/api/usuarios/${idCuentaTest}/reenviar`)
          .set({
            authorization: `Bearer ${jwtToken}`,
            accept: 'application/json',
          })
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
    describe('TI-25|POST|/api/usuarios/recuperar', () => {
      const url = '/api/usuarios/recuperar'
      const responseMessage = 'Búsqueda terminada'
      it(
        'U-037|Debería de recuperar la cuenta del usuario|201',
        async () => {
          jest
            .spyOn(TextService, 'generateUuid')
            .mockReturnValue(codigoTransaccionesTest.recuperacion)
          const response = await request(app.getHttpServer())
            .post(url)
            .send({
              correoElectronico: correoElectronico,
            })
            .expect(HttpStatus.CREATED)
          expect(response.body).toEqual({
            finalizado: true,
            mensaje: Messages.SUBJECT_EMAIL_ACCOUNT_RECOVERY,
            datos: responseMessage,
          })
        },
        TIME_OUT
      )
      it('U-038|ebería devolver "Búsqueda terminada" si el usuario no existe en BD|201', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .send({
            correoElectronico: faker.internet.email({ provider: 'gmail.com' }),
          })
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.SUBJECT_EMAIL_ACCOUNT_RECOVERY,
          datos: responseMessage,
        })
      })
      it('U-039|Debería manejar el error cuando falle el envío de correo|201', async () => {
        jest
          .spyOn(mensajeriaServiceError, 'sendEmail')
          .mockRejectedValueOnce(new Error('Servicio externo caído'))
        const response = await request(app.getHttpServer())
          .post(url)
          .send({
            correoElectronico: correoElectronico,
          })
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual({
          finalizado: true,
          mensaje: Messages.SUBJECT_EMAIL_ACCOUNT_RECOVERY,
          datos: responseMessage,
        })
        expect(mensajeriaServiceError.sendEmail).toHaveBeenCalled()
      })
    })
    describe('TI-26|POST|/api/usuarios/validar-recuperar', () => {
      const url = '/api/usuarios/validar-recuperar'

      it('U-040|Debería de validar el código de recuperación|201', async () => {
        jest
          .spyOn(TextService, 'generateUuid')
          .mockReturnValue(codigoTransaccionesTest.transaccion)

        const response = await request(app.getHttpServer())
          .post(url)
          .send({ codigo: codigoTransaccionesTest.recuperacion })
          .expect(HttpStatus.CREATED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_DEFAULT,
            datos: expect.any(Object),
          })
        )
      })
      it('U-041|Debería de generar error si el código de recuperación no pertenece a ningún usuario|412', async () => {
        const response = await request(app.getHttpServer())
          .post(url)
          .send({
            codigo: faker.string.uuid(),
          })
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
            mensaje: Messages.INVALID_USER,
          })
        )
      })
    })
    describe('TI-27|PATCH|/api/usuarios/cuenta/contrasena', () => {
      const url = '/api/usuarios/cuenta/contrasena'
      it(
        'U-042|Debería de actualizar la contraseña de un usuario autenticado|200',
        async () => {
          const response = await request(app.getHttpServer())
            .patch(url)
            .set({
              authorization: `Bearer ${jwtToken}`,
              accept: 'application/json',
            })
            .send({
              contrasenaActual: credenciales.contrasena,
              contrasenaNueva: faker.internet.password(),
            })
            .expect(HttpStatus.OK)
          expect(response.body).toEqual(
            expect.objectContaining({
              finalizado: true,
              mensaje: Messages.SUCCESS_UPDATE,
            })
          )
        },
        TIME_OUT
      )
    })
    describe('TI-28|PATCH|/api/usuarios/cuenta/nueva-contrasena', () => {
      const url = '/api/usuarios/cuenta/nueva-contrasena'
      it('U-043|Debería generar error cuando no exista un código de transacción relacionado con el usuario|412', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .send({
            codigo: faker.string.uuid(),
            contrasenaNueva: credenciales.contrasena,
          })
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_USER,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
          })
        )
      })
      it('U-044|Debería generar error cuando el password no tenga un nivel valido|412', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .send({
            codigo: codigoTransaccionesTest.transaccion,
            contrasenaNueva: `QWERTY`,
          })
          .expect(HttpStatus.PRECONDITION_FAILED)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: false,
            mensaje: Messages.INVALID_PASSWORD_SCORE,
            codigo: HttpStatus.PRECONDITION_FAILED,
            timestamp: expect.any(Number),
          })
        )
      })
      it('U-045|Debería de actualizar la contraseña del usuario|200', async () => {
        const response = await request(app.getHttpServer())
          .patch(url)
          .send({
            codigo: codigoTransaccionesTest.transaccion,
            contrasenaNueva: `new${contraseniaTest}`,
          })
          .expect(HttpStatus.OK)
        expect(response.body).toEqual(
          expect.objectContaining({
            finalizado: true,
            mensaje: Messages.SUCCESS_DEFAULT,
            datos: { id: idCuentaTest },
          })
        )
      })
    })
    describe('TI-29|GET|/api/usuarios/cuenta/desbloqueo', () => {
      const url = '/api/usuarios/cuenta/desbloqueo'
      const credencialesFail = {
        usuario: nroDocumentoTest,
        contrasena: 'Contrasenia123*',
      }
      it(
        'U-046|Debería de desbloquear la cuenta del usuario|401',
        async () => {
          jest
            .spyOn(TextService, 'generateUuid')
            .mockReturnValue(codigoTransaccionesTest.desbloqueo)
          const codigoDesbloqueo = codigoTransaccionesTest.desbloqueo
          // Generar intentos fallidos de login
          await request(app.getHttpServer())
            .post('/api/auth')
            .send(credencialesFail)
            .expect(HttpStatus.UNAUTHORIZED)
          await request(app.getHttpServer())
            .post('/api/auth')
            .send(credencialesFail)
            .expect(HttpStatus.UNAUTHORIZED)
          await request(app.getHttpServer())
            .post('/api/auth')
            .send(credencialesFail)
            .expect(HttpStatus.UNAUTHORIZED)

          const response = await request(app.getHttpServer())
            .get(`${url}?id=${codigoDesbloqueo}`)
            .send({
              codigo: codigoDesbloqueo,
            })
            .expect(HttpStatus.OK)
          expect(response.body).toEqual(
            expect.objectContaining({
              finalizado: true,
              mensaje: Messages.SUCCESS_ACCOUNT_UNLOCK,
              datos: { codigo: codigoDesbloqueo },
            })
          )
        },
        TIME_OUT
      )
      it('U-047|Debería generar error cuando no exista un código de transacción relacionado con el usuario|200', async () => {
        const codigoDesbloqueoInvalido = faker.string.uuid()
        await request(app.getHttpServer())
          .get(`${url}?id=${codigoDesbloqueoInvalido}`)
          .expect(HttpStatus.OK)
      })
    })
  })
})
