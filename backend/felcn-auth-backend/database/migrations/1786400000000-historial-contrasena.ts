import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Crea `usuario.historial_contrasena`: registro de contraseñas (hash bcrypt)
 * que un usuario tuvo en el pasado, para impedir que las reutilice en un
 * cambio o recuperación de contraseña posterior. Tabla de solo inserción
 * (nunca se actualiza ni se borra una fila existente); por eso no extiende
 * el patrón completo de auditoría (`AuditoriaEntity`) del resto del esquema
 * — solo lleva la fecha en que la contraseña dejó de estar vigente.
 */
export class historialContrasena1786400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE usuario.historial_contrasena_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `)

    await queryRunner.query(`
      CREATE TABLE usuario.historial_contrasena (
        id bigint NOT NULL DEFAULT nextval('usuario.historial_contrasena_id_seq'::regclass),
        id_usuario bigint NOT NULL,
        contrasena character varying(255) NOT NULL,
        _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
        CONSTRAINT historial_contrasena_pkey PRIMARY KEY (id),
        CONSTRAINT fk_historial_contrasena_usuario
          FOREIGN KEY (id_usuario) REFERENCES usuario.usuario(id) ON DELETE CASCADE
      );
    `)

    await queryRunner.query(`
      ALTER SEQUENCE usuario.historial_contrasena_id_seq
        OWNED BY usuario.historial_contrasena.id;
    `)

    await queryRunner.query(`
      ALTER TABLE usuario.historial_contrasena OWNER TO postgres;
    `)

    await queryRunner.query(`
      CREATE INDEX idx_historial_contrasena_usuario
        ON usuario.historial_contrasena (id_usuario, _fecha_creacion DESC);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS usuario.idx_historial_contrasena_usuario;`
    )
    await queryRunner.query(
      `DROP TABLE IF EXISTS usuario.historial_contrasena;`
    )
    await queryRunner.query(
      `DROP SEQUENCE IF EXISTS usuario.historial_contrasena_id_seq;`
    )
  }
}
