import { Usuario } from '@/core/usuario/entity/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '@/common/lib/text.service'
import { Genero, TipoDocumento, USUARIO_SISTEMA } from '@/common/constants'
import dayjs from 'dayjs'
import { Persona } from '@/core/usuario/entity/persona.entity'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // La contraseña de los usuarios sembrados (incluido el Admin) ya no se
    // hardcodea: viene de ADMIN_INITIAL_PASSWORD y se valida su fortaleza
    // (zxcvbn, mismo umbral que usa el resto de la app — Configurations.SCORE_PASSWORD)
    // para que este seed no pueda dejar una contraseña débil conocida en ningún
    // ambiente, incluida producción.
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD
    if (!initialPassword) {
      throw new Error(
        'ADMIN_INITIAL_PASSWORD no está seteada. Es obligatoria para sembrar ' +
        'los usuarios iniciales (incluido el Admin) — no hay valor por defecto.'
      )
    }
    if (!TextService.validateLevelPassword(initialPassword)) {
      throw new Error(
        'ADMIN_INITIAL_PASSWORD no cumple el nivel mínimo de fortaleza requerido.'
      )
    }
    const pass = await TextService.encrypt(initialPassword)
    const items = [
      {
        //id: 1,
        usuario: 'ADMINISTRADOR',
        correoElectonico: 'superadmin@mailinator.com',
        persona: {
          nombres: 'SUPER',
          primerApellido: 'ADMIN',
          segundoApellido: 'ADMIN',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '3333333',
          fechaNacimiento: '1998-12-30',
          genero: Genero.FEMENINO,
        },
      },
    ]

    for (const item of items) {
      const persona = new Persona({
        fechaNacimiento: dayjs(
          item.persona.fechaNacimiento,
          'YYYY-MM-DD'
        ).toDate(),
        genero: item.persona.genero,
        nombres: item.persona.nombres,
        nroDocumento: item.persona.nroDocumento,
        primerApellido: item.persona.primerApellido,
        segundoApellido: item.persona.segundoApellido,
        tipoDocumento: item.persona.tipoDocumento,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      const personaResult = await queryRunner.manager.save(persona)
      const usuario = new Usuario({
        ciudadaniaDigital: false,
        contrasena: pass,
        intentos: 0,
        usuario: item.usuario,
        correoElectronico: item.correoElectonico,
        idPersona: personaResult.id,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      await queryRunner.manager.save(usuario)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
