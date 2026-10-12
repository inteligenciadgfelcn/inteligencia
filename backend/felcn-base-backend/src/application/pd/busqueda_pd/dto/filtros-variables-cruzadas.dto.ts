import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
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

function vacio(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() || undefined : value
}
function Texto(max = 250) {
  return applyDecorators(
    ApiPropertyOptional({ type: String }),
    Transform(({ value }) => vacio(value)),
    IsOptional(),
    IsString(),
    MaxLength(max)
  )
}
function Id() {
  return applyDecorators(
    ApiPropertyOptional({ type: Number, minimum: 1 }),
    Transform(({ value }) => {
      const v = vacio(value)
      return typeof v === 'string' ? Number(v) : v
    }),
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
    Transform(({ value }) => vacio(value)),
    IsOptional(),
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    IsDateString({ strict: true })
  )
}
function Booleano() {
  return applyDecorators(
    ApiPropertyOptional({ type: Boolean }),
    Transform(({ value }) => {
      const v = vacio(value)
      return v === 'true' ? true : v === 'false' ? false : v
    }),
    IsOptional(),
    IsBoolean()
  )
}
function Monto() {
  return applyDecorators(
    ApiPropertyOptional({ type: Number, minimum: 0 }),
    Transform(({ value }) => {
      const v = vacio(value)
      return typeof v === 'string' ? Number(v) : v
    }),
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
  @Texto() numeroActuacion?: string
  @Texto() lugarActuacion?: string
  @Texto() nombres?: string
  @Texto() apellidoPaterno?: string
  @Texto() apellidoMaterno?: string
  @Texto() apellidoEsposo?: string
  @Texto() numeroDocumento?: string
  @Texto() relacionPersona?: string
  @Texto() observacionesPersona?: string
  @Texto() caracteristicaBien?: string
  @Texto() lugarSecuestro?: string
  @Texto() resultadoPericiaBien?: string
  @Texto() nombreEmpresa?: string
  @Texto() nit?: string
  @Texto() matricula?: string
  @Texto() representante?: string
  @Texto() direccionEmpresa?: string
  @Texto() resultadoPericiaEmpresa?: string
  @Texto() observacionesEmpresa?: string
  @Id() unidadId?: number
  @Id() distritalId?: number
  @Id() grupoId?: number
  @Id() etapaInvestigacionId?: number
  @Id() estadoProcesalId?: number
  @Id() tipologiaId?: number
  @Id() tipoInformeId?: number
  @Id() tipoDocumentoId?: number
  @Id() paisId?: number
  @Id() estadoCivilId?: number
  @Id() profesionId?: number
  @Id() situacionPersonaId?: number
  @Id() categoriaBienId?: number
  @Id() claseBienId?: number
  @Id() tipoBienId?: number
  @Id() caracteristicaId?: number
  @Id() situacionJuridicaBienId?: number
  @Id() vinculoEmpresaId?: number
  @Id() situacionEmpresaId?: number
  @Fecha() inicioCasoDesde?: string
  @Fecha() inicioCasoHasta?: string
  @Fecha() informeDesde?: string
  @Fecha() informeHasta?: string
  @Fecha() personaRegistroDesde?: string
  @Fecha() personaRegistroHasta?: string
  @Fecha() bienRegistroDesde?: string
  @Fecha() bienRegistroHasta?: string
  @Fecha() empresaRegistroDesde?: string
  @Fecha() empresaRegistroHasta?: string
  @Booleano() personaSinSituacion?: boolean
  @Booleano() periciaBien?: boolean
  @Booleano() bienSinSituacionLegal?: boolean
  @Booleano() bienSinSituacionJuridica?: boolean
  @Booleano() periciaEmpresa?: boolean
  @Booleano() empresaSinSituacion?: boolean
  @Monto() valorBienDesde?: number
  @Monto() valorBienHasta?: number
  @Texto(2) departamentoCodigo?: string
  @ApiPropertyOptional({ enum: ['M', 'F'] })
  @Transform(({ value }) => vacio(value))
  @IsOptional()
  @IsIn(['M', 'F'])
  sexo?: string
  @ApiPropertyOptional({
    enum: ['SECUESTRADO', 'INCAUTADO', 'CONFISCADO', 'PERDIDA_DOMINIO'],
  })
  @Transform(({ value }) => vacio(value))
  @IsOptional()
  @IsIn(['SECUESTRADO', 'INCAUTADO', 'CONFISCADO', 'PERDIDA_DOMINIO'])
  situacionLegalBien?: string
}
