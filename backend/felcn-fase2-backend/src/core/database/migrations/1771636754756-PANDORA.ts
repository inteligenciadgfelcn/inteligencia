import { MigrationInterface, QueryRunner } from 'typeorm';

export class PANDORA1771636754756 implements MigrationInterface {
  name = 'PANDORA1771636754756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS parametricas`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auditoria`);

    await queryRunner.query(
      `CREATE TABLE "parameters" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "usuario_registro" character varying(150) NOT NULL, "fecha_registro" TIMESTAMP NOT NULL DEFAULT now(), "usuario_modificacion" character varying(150), "fecha_modificacion" TIMESTAMP DEFAULT now(), "estado_registro" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_6b03a26baa3161f87fa87588859" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "parametricas"."estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."unidad" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "codigo" character varying(20) NOT NULL, "codigo_icia" character varying(20), "abreviatura_rep" character varying(50), "descripcion" character varying(255), "op_adm" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3f087c90fe8ce6bafe8f8af6779" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."unidad"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."unidad"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."unidad"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."unidad"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."unidad"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."unidad"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."unidad"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."unidad"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."unidad"."codigo" IS 'Código único de la unidad'; COMMENT ON COLUMN "parametricas"."unidad"."codigo_icia" IS 'Código ICIA de la unidad'; COMMENT ON COLUMN "parametricas"."unidad"."abreviatura_rep" IS 'Abreviatura para reportes'; COMMENT ON COLUMN "parametricas"."unidad"."descripcion" IS 'Descripción de la unidad'; COMMENT ON COLUMN "parametricas"."unidad"."op_adm" IS 'Indicador de operación administrativa'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_861ec82ab1c13cb0a2ee94d10a" ON "parametricas"."unidad" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."distrital" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descripcion" character varying(100) NOT NULL, "id_unidad" integer NOT NULL, CONSTRAINT "PK_372022e6de6175faa9305d633f8" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."distrital"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."distrital"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."distrital"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."distrital"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."distrital"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."distrital"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."distrital"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."distrital"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."distrital"."descripcion" IS 'Descripción única del distrital'; COMMENT ON COLUMN "parametricas"."distrital"."id_unidad" IS 'Clave primaria del registro'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b19ded381c1175a9ce4434673d" ON "parametricas"."distrital" ("id_unidad") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_73edf13393186de1dfe5015ce6" ON "parametricas"."distrital" ("descripcion") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."continente" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "codigo" character varying(10) NOT NULL, "nombre" character varying(150) NOT NULL, CONSTRAINT "PK_9864f9dc7b93aad53c1a1d2ffac" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."continente"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."continente"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."continente"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."continente"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."continente"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."continente"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."continente"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."continente"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."continente"."codigo" IS 'Código único del continente'; COMMENT ON COLUMN "parametricas"."continente"."nombre" IS 'Nombre oficial del continente'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f26c1468e2c135f4d7868e47b4" ON "parametricas"."continente" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."pais" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "codigo" character varying(10) NOT NULL, "nombre" character varying(150) NOT NULL, "id_continente" integer NOT NULL, CONSTRAINT "PK_a362c5bbbefe39c9187406b1917" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."pais"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."pais"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."pais"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."pais"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."pais"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."pais"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."pais"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."pais"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."pais"."codigo" IS 'Código único del país'; COMMENT ON COLUMN "parametricas"."pais"."nombre" IS 'Nombre oficial del país'; COMMENT ON COLUMN "parametricas"."pais"."id_continente" IS 'Clave primaria del registro'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f120b3403d233fc300eb54c8ac" ON "parametricas"."pais" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."provincia" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_departamento" integer NOT NULL, "codigo" character varying(10) NOT NULL, "nombre" character varying(150) NOT NULL, CONSTRAINT "PK_d30aa9eff4e019f83505484187f" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."provincia"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."provincia"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."provincia"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."provincia"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."provincia"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."provincia"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."provincia"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."provincia"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."provincia"."id_departamento" IS 'Clave foránea que referencia al departamento'; COMMENT ON COLUMN "parametricas"."provincia"."codigo" IS 'Código de la provincia'; COMMENT ON COLUMN "parametricas"."provincia"."nombre" IS 'Nombre de la provincia'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_383be3cf3503a918dcdec75efa" ON "parametricas"."provincia" ("id_departamento") `,
    );
    await queryRunner.query(
      `CREATE TABLE "parametricas"."departamento" ("id" SERIAL NOT NULL, "estado" "parametricas"."estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_usuario_creacion" integer NOT NULL, "usuario_creacion" character varying(100), "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id_usuario_modificacion" integer, "usuario_modificacion" character varying(100), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "codigo" character varying(10) NOT NULL, "nombre" character varying(150) NOT NULL, "id_pais" integer NOT NULL, CONSTRAINT "PK_7fd6f336280fd0c7a9318464723" PRIMARY KEY ("id")); COMMENT ON COLUMN "parametricas"."departamento"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "parametricas"."departamento"."estado" IS 'Estado del registro'; COMMENT ON COLUMN "parametricas"."departamento"."id_usuario_creacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."departamento"."usuario_creacion" IS 'codigo de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."departamento"."fecha_creacion" IS 'Fecha de creación del registro'; COMMENT ON COLUMN "parametricas"."departamento"."id_usuario_modificacion" IS 'id de usuario que creó el registro'; COMMENT ON COLUMN "parametricas"."departamento"."usuario_modificacion" IS 'codigo de usuario que modificó el registro'; COMMENT ON COLUMN "parametricas"."departamento"."fecha_modificacion" IS 'Fecha de última modificación'; COMMENT ON COLUMN "parametricas"."departamento"."codigo" IS 'Código del departamento'; COMMENT ON COLUMN "parametricas"."departamento"."nombre" IS 'Nombre del departamento'; COMMENT ON COLUMN "parametricas"."departamento"."id_pais" IS 'Clave primaria del registro'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9c46ef1a957d2c4c85f18b06db" ON "parametricas"."departamento" ("codigo") `,
    );
    await queryRunner.query(
      `CREATE TABLE "auditoria"."bitacora" ("id" BIGSERIAL NOT NULL, "usuario" character varying(100) NOT NULL, "accion" character varying(50) NOT NULL, "tabla" character varying(150) NOT NULL, "entidadId" integer, "datosAnteriores" jsonb, "datosNuevos" jsonb, "ip" character varying(50), "fecha" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e08eb7c81388757d9e53d62246e" PRIMARY KEY ("id")); COMMENT ON COLUMN "auditoria"."bitacora"."id" IS 'Clave primaria del registro'; COMMENT ON COLUMN "auditoria"."bitacora"."usuario" IS 'Usuario que realizó la acción'; COMMENT ON COLUMN "auditoria"."bitacora"."accion" IS 'Acción ejecutada (POST, PATCH, DELETE)'; COMMENT ON COLUMN "auditoria"."bitacora"."tabla" IS 'Nombre de la tabla o endpoint afectado'; COMMENT ON COLUMN "auditoria"."bitacora"."entidadId" IS 'ID del registro afectado'; COMMENT ON COLUMN "auditoria"."bitacora"."datosAnteriores" IS 'Datos antes del cambio'; COMMENT ON COLUMN "auditoria"."bitacora"."datosNuevos" IS 'Datos después del cambio'; COMMENT ON COLUMN "auditoria"."bitacora"."ip" IS 'IP del usuario'; COMMENT ON COLUMN "auditoria"."bitacora"."fecha" IS 'Fecha del evento'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e08eb7c81388757d9e53d62246" ON "auditoria"."bitacora" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."distrital" ADD CONSTRAINT "FK_b19ded381c1175a9ce4434673d9" FOREIGN KEY ("id_unidad") REFERENCES "parametricas"."unidad"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."pais" ADD CONSTRAINT "FK_9315e7b044654ae8fa3514c085d" FOREIGN KEY ("id_continente") REFERENCES "parametricas"."continente"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."provincia" ADD CONSTRAINT "FK_383be3cf3503a918dcdec75efa4" FOREIGN KEY ("id_departamento") REFERENCES "parametricas"."departamento"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."departamento" ADD CONSTRAINT "FK_e3c64701f49d32b3481175df275" FOREIGN KEY ("id_pais") REFERENCES "parametricas"."pais"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parametricas"."departamento" DROP CONSTRAINT "FK_e3c64701f49d32b3481175df275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."provincia" DROP CONSTRAINT "FK_383be3cf3503a918dcdec75efa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."pais" DROP CONSTRAINT "FK_9315e7b044654ae8fa3514c085d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parametricas"."distrital" DROP CONSTRAINT "FK_b19ded381c1175a9ce4434673d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "auditoria"."IDX_e08eb7c81388757d9e53d62246"`,
    );
    await queryRunner.query(`DROP TABLE "auditoria"."bitacora"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_9c46ef1a957d2c4c85f18b06db"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."departamento"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_383be3cf3503a918dcdec75efa"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."provincia"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_f120b3403d233fc300eb54c8ac"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."pais"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_f26c1468e2c135f4d7868e47b4"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."continente"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_73edf13393186de1dfe5015ce6"`,
    );
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_b19ded381c1175a9ce4434673d"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."distrital"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(
      `DROP INDEX "parametricas"."IDX_861ec82ab1c13cb0a2ee94d10a"`,
    );
    await queryRunner.query(`DROP TABLE "parametricas"."unidad"`);
    await queryRunner.query(`DROP TYPE "parametricas"."estado_enum"`);
    await queryRunner.query(`DROP TABLE "parameters"`);
  }
}
