import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

function Texto() {
  return applyDecorators(
    ApiPropertyOptional({ type: String }),
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() || undefined : value
    ),
    IsOptional(),
    IsString(),
    MaxLength(250)
  )
}
function Id() {
  return applyDecorators(
    ApiPropertyOptional({ type: Number, minimum: 1 }),
    Transform(({ value }) => (value === '' ? undefined : value)),
    Type(() => Number),
    IsOptional(),
    IsInt(),
    Min(1),
    Max(Number.MAX_SAFE_INTEGER)
  )
}
function Fecha() {
  return applyDecorators(
    ApiPropertyOptional({
      type: String,
      format: 'date',
      example: '2026-10-01',
    }),
    Transform(({ value }) => (value === '' ? undefined : value)),
    IsOptional(),
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    IsDateString({ strict: true })
  )
}
function Booleano() {
  return applyDecorators(
    ApiPropertyOptional({ type: Boolean }),
    Transform(({ value }) =>
      value === ''
        ? undefined
        : value === 'true' || value === true
          ? true
          : value === 'false' || value === false
            ? false
            : value
    ),
    IsOptional(),
    IsBoolean()
  )
}
function Monto() {
  return applyDecorators(
    ApiPropertyOptional({ type: Number, minimum: 0 }),
    Transform(({ value }) => (value === '' ? undefined : value)),
    Type(() => Number),
    IsOptional(),
    IsNumber({ allowNaN: false, allowInfinity: false }),
    Min(0)
  )
}

export class FiltrosVariablesCruzadasPdDto {
  @Texto() filtro?: string
  @Texto() numeroCaso?: string
  @Texto() nombreCaso?: string
  @Texto() cud?: string
  @Texto() numeroCasoFiscalia?: string
  /** dptoav_id es varchar(2); se mantiene el código tal como está registrado. */
  @Texto() departamentoCodigo?: string
  @Id() unidadId?: number
  @Id() distritalId?: number
  @Id() grupoId?: number
  @Id() etapaInvestigacionId?: number
  @Id() estadoProcesalId?: number
  @Id() tipologiaId?: number
  @Fecha() inicioCasoDesde?: string
  @Fecha() inicioCasoHasta?: string
  @Texto() numeroActuacion?: string
  @Id() tipoInformeId?: number
  @Texto() lugarActuacion?: string
  @Fecha() informeDesde?: string
  @Fecha() informeHasta?: string

  @Texto() nombres?: string
  @Texto() apellidoPaterno?: string
  @Texto() apellidoMaterno?: string
  @Texto() apellidoEsposo?: string
  @Texto() numeroDocumento?: string
  @Id() tipoDocumentoId?: number
  @Id() paisId?: number
  @Id() estadoCivilId?: number
  @Id() profesionId?: number
  @ApiPropertyOptional({ enum: ['M', 'F'] })
  @IsOptional()
  @IsIn(['M', 'F'])
  sexo?: string
  @Texto() relacionPersona?: string
  @Texto() observacionesPersona?: string
  @Id() situacionPersonaId?: number
  @Booleano() personaSinSituacion?: boolean
  @Fecha() personaRegistroDesde?: string
  @Fecha() personaRegistroHasta?: string

  @Id() categoriaBienId?: number
  @Id() claseBienId?: number
  @Id() tipoBienId?: number
  @Id() caracteristicaId?: number
  @Texto() caracteristicaBien?: string
  @Texto() lugarSecuestro?: string
  @Booleano() periciaBien?: boolean
  @Texto() resultadoPericiaBien?: string
  @Monto() valorBienDesde?: number
  @Monto() valorBienHasta?: number
  @ApiPropertyOptional({
    enum: ['SECUESTRADO', 'INCAUTADO', 'CONFISCADO', 'PERDIDA_DOMINIO'],
  })
  @IsOptional()
  @IsIn(['SECUESTRADO', 'INCAUTADO', 'CONFISCADO', 'PERDIDA_DOMINIO'])
  situacionLegalBien?: string
  @Booleano() bienSinSituacionLegal?: boolean
  @Id() situacionJuridicaBienId?: number
  @Booleano() bienSinSituacionJuridica?: boolean
  @Fecha() bienRegistroDesde?: string
  @Fecha() bienRegistroHasta?: string

  @Texto() nombreEmpresa?: string
  @Texto() nit?: string
  @Texto() matricula?: string
  @Texto() representante?: string
  @Texto() direccionEmpresa?: string
  @Id() vinculoEmpresaId?: number
  @Booleano() periciaEmpresa?: boolean
  @Texto() resultadoPericiaEmpresa?: string
  @Texto() observacionesEmpresa?: string
  @Id() situacionEmpresaId?: number
  @Booleano() empresaSinSituacion?: boolean
  @Fecha() empresaRegistroDesde?: string
  @Fecha() empresaRegistroHasta?: string
}
