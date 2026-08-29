import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Crea `usuario.recurso_excepcion`: excepciones NEGATIVAS de recursos (pantallas/menú)
 * por usuario+rol sobre las políticas frontend de Casbin. Ausencia de fila = el
 * usuario hereda el recurso de su rol con normalidad; una fila presente = el
 * recurso está excluido para ese usuario+rol puntual.
 *
 * No existe columna de estado con significado de negocio: reactivar un recurso
 * es un DELETE físico de la fila, nunca un UPDATE. `_estado` queda fijo en
 * 'ACTIVO' solo por consistencia estructural con `AuditoriaEntity`.
 *
 * FK a `casbin_rule.id` con ON DELETE CASCADE: solo es seguro porque
 * `authorization.service.ts::actualizarPolitica` se corrigió para usar
 * `updatePolicy` (UPDATE en el lugar, preserva el id) en vez de borrar+crear.
 * Un DELETE real de política sí debe arrastrar sus excepciones, por eso el
 * cascade.
 *
 * También agrega un índice único parcial sobre `casbin_rule(v0, v1)` para las
 * políticas frontend — hoy esa combinación ya es 1:1 en los datos, esto lo
 * blinda a futuro, ya que la FK de esta tabla depende de esa unicidad.
 */
export class recursoExcepcion1785386986644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE usuario.recurso_excepcion_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `)

    await queryRunner.query(`
      CREATE TABLE usuario.recurso_excepcion (
        id bigint NOT NULL DEFAULT nextval('usuario.recurso_excepcion_id_seq'::regclass),
        id_usuario_rol bigint NOT NULL,
        id_politica integer NOT NULL,
        _estado character varying(30) NOT NULL DEFAULT 'ACTIVO',
        _transaccion character varying(30) NOT NULL,
        _usuario_creacion bigint NOT NULL,
        _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
        _usuario_modificacion bigint,
        _fecha_modificacion timestamp without time zone,
        CONSTRAINT recurso_excepcion_pkey PRIMARY KEY (id),
        CONSTRAINT ck_recurso_excepcion_estado CHECK ((_estado)::text = 'ACTIVO'),
        CONSTRAINT uq_recurso_excepcion_usuario_rol_politica UNIQUE (id_usuario_rol, id_politica),
        CONSTRAINT fk_recurso_excepcion_usuario_rol
          FOREIGN KEY (id_usuario_rol) REFERENCES usuario.usuario_rol(id) ON DELETE CASCADE,
        CONSTRAINT fk_recurso_excepcion_politica
          FOREIGN KEY (id_politica) REFERENCES usuario.casbin_rule(id) ON DELETE CASCADE
      );
    `)

    await queryRunner.query(`
      ALTER SEQUENCE usuario.recurso_excepcion_id_seq
        OWNED BY usuario.recurso_excepcion.id;
    `)

    await queryRunner.query(`
      ALTER TABLE usuario.recurso_excepcion OWNER TO postgres;
    `)

    // Blinda la unicidad (v0, v1) de la que depende esta FK para políticas frontend
    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_casbin_rule_frontend_rol_ruta
        ON usuario.casbin_rule (v0, v1)
        WHERE ptype = 'p' AND v3 = 'frontend';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS usuario.uq_casbin_rule_frontend_rol_ruta;`
    )
    await queryRunner.query(`DROP TABLE IF EXISTS usuario.recurso_excepcion;`)
    await queryRunner.query(
      `DROP SEQUENCE IF EXISTS usuario.recurso_excepcion_id_seq;`
    )
  }
}
