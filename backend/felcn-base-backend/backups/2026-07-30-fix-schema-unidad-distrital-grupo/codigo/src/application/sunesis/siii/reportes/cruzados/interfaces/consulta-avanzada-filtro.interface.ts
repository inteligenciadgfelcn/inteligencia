import { ApiProperty } from '@nestjs/swagger'
import type { ResumenEstadistico, ResumenFabrica } from '../../cuadros/interfaces/cuadro-filtro.interface'

/**
 * DTO de query para el endpoint GET /reportes/cruzadas/avanzado.
 * Todos los campos son opcionales — el backend pasa NULL cuando están ausentes.
 * Los tipos son string porque los query params HTTP llegan siempre como texto;
 * la conversión a number/boolean/null ocurre en el repositorio.
 */
export class ConsultaAvanzadaQueryDto {
  // ── Caso / Asignación ──────────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'Código de servicio (parcial)', example: 'SERV-01' })
  codigoServicio?: string

  @ApiProperty({ required: false, description: 'Fecha inicio (YYYY-MM-DD)', example: '2025-01-01' })
  fechaInicio?: string

  @ApiProperty({ required: false, description: 'Fecha fin (YYYY-MM-DD)', example: '2025-12-31' })
  fechaFin?: string

  @ApiProperty({ required: false, description: 'Número de caso (parcial)', example: 'FELCN-2025' })
  numeroCaso?: string

  @ApiProperty({ required: false, description: 'Fiscal asignado al caso (parcial)', example: 'García' })
  fiscal?: string

  @ApiProperty({ required: false, description: 'Nombre del caso (parcial)', example: 'Operación Luz' })
  nombreCaso?: string

  @ApiProperty({ required: false, description: 'Número de operativo (parcial)', example: 'OP-2025' })
  numeroOperativo?: string

  @ApiProperty({ required: false, description: 'IANUS (parcial)', example: 'IAN-001' })
  ianus?: string

  @ApiProperty({ required: false, description: 'Fiscal solicitante (parcial)', example: 'López' })
  fiscalSolicitud?: string

  @ApiProperty({ required: false, description: 'Investigador asignado al caso (parcial)', example: 'Mamani' })
  asignadoCaso?: string

  // ── Operativo: catálogos FK ────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'ID tipo de droga (parametricas.tipo_droga)', example: '1' })
  idTipoDroga?: string

  @ApiProperty({ required: false, description: 'ID tipo de operación (parametricas.tipo_operacion)', example: '3' })
  idTipoOperacion?: string

  @ApiProperty({ required: false, description: 'ID tipo de relevancia (parametricas.tipo_relevancia)', example: '2' })
  idTipoRelevancia?: string

  @ApiProperty({ required: false, description: 'ID unidad (public.unidad)', example: '5' })
  idUnidad?: string

  @ApiProperty({ required: false, description: 'ID plan de operaciones (parametricas.plan_operaciones)', example: '10' })
  idPlanOperacion?: string

  @ApiProperty({ required: false, description: 'Organización (parcial)', example: 'Cartel' })
  organizacion?: string

  @ApiProperty({ required: false, description: 'ID tipo de denuncia (parametricas.tipo_denuncia)', example: '1' })
  idTipoDenuncia?: string

  @ApiProperty({ required: false, description: 'ID tipo penal (parametricas.tipo_penal)', example: '4' })
  idTipoPenal?: string

  @ApiProperty({ required: false, description: 'ID categoría de operativo (parametricas.categoria_operativo)', example: '2' })
  idCategoriaOperativo?: string

  // ── Operativo: geografía ───────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'ID departamento (parametricas.departamento)', example: '3' })
  idDepartamento?: string

  @ApiProperty({ required: false, description: 'ID provincia (parametricas.provincia)', example: '12' })
  idProvincia?: string

  @ApiProperty({ required: false, description: 'ID localidad (parametricas.localidad)', example: '45' })
  idLocalidad?: string

  @ApiProperty({ required: false, description: 'Lugar del operativo (parcial)', example: 'Av. Principal' })
  lugar?: string

  // ── Bienes ─────────────────────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'ID tipo de bien secuestrado (public.catalogo_tipo)', example: '7' })
  idCatalogoTipo?: string

  // ── Operativo: flags booleanos ─────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'Es positivo (true/false)', example: 'true' })
  esPositivo?: string

  @ApiProperty({ required: false, description: 'Tiene aprehendidos (true/false)', example: 'true' })
  esAprehendido?: string

  @ApiProperty({ required: false, description: 'Tiene arrestados (true/false)', example: 'false' })
  esArrestado?: string

  @ApiProperty({ required: false, description: 'Es ICIA (true/false)', example: 'true' })
  esIcia?: string

  @ApiProperty({ required: false, description: 'Es parte diario (true/false)', example: 'false' })
  esParteDiario?: string

  @ApiProperty({ required: false, description: 'Es revisado (true/false)', example: 'true' })
  esRevisado?: string

  // ── Droga ──────────────────────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'ID estado de droga (public.estado_droga)', example: '5' })
  idEstadoDroga?: string

  @ApiProperty({ required: false, description: 'ID país de procedencia de la droga (parametricas.pais)', example: '33' })
  idPaisProcedencia?: string

  @ApiProperty({ required: false, description: 'ID país de destino de la droga (parametricas.pais)', example: '1' })
  idPaisDestino?: string

  @ApiProperty({ required: false, description: 'Costo mínimo de drogas del operativo (Bs)', example: '1000' })
  costoDrogaMin?: string

  @ApiProperty({ required: false, description: 'Costo máximo de drogas del operativo (Bs)', example: '50000' })
  costoDrogaMax?: string

  // ── Persona implicada ──────────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'Nombres de la persona implicada (parcial)', example: 'Juan' })
  nombresPersona?: string

  @ApiProperty({ required: false, description: 'Apellido paterno de la persona (parcial)', example: 'Pérez' })
  apellidoPaterno?: string

  @ApiProperty({ required: false, description: 'Apellido materno de la persona (parcial)', example: 'López' })
  apellidoMaterno?: string

  @ApiProperty({ required: false, description: 'Número de documento de la persona (parcial)', example: '12345678' })
  nroDocumento?: string

  @ApiProperty({ required: false, description: 'ID país/nacionalidad de la persona (parametricas.pais)', example: '1' })
  idPaisPersona?: string

  // ── Costo total ────────────────────────────────────────────────────────────
  @ApiProperty({ required: false, description: 'Costo total mínimo consolidado (Bs)', example: '5000' })
  costoTotalMin?: string

  @ApiProperty({ required: false, description: 'Costo total máximo consolidado (Bs)', example: '200000' })
  costoTotalMax?: string
}

export interface RespuestaAvanzadaCompleta {
  filas: ResultadoConsultaAvanzada[]
  resumen: ResumenEstadistico
  fabricas: ResumenFabrica[]
}

/**
 * Fila de resultado del endpoint avanzado.
 * Refleja todos los alias del SELECT de consulta.sql.
 */
export interface ResultadoConsultaAvanzada {
  idOperativo: string
  fechaOperativo: string
  numeroCaso: string
  numeroOperativo: string
  numeroInforme: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  nombreCaso: string
  ianus: string
  fiscalSolicitud: string
  asignado: string
  asignadoFiscal: string
  tipoOperativo: string
  tipoRelevancia: string
  colorRelevancia: string
  categoriaOperativo: string
  planOperacion: string
  tipoDenuncia: string | null
  tipoPenal: string | null
  organizacion: string
  alMandoDe: string
  clanFamiliar: string | null
  esPositivo: boolean
  esAprehendido: boolean
  esArrestado: boolean
  esIcia: boolean
  esParteDiario: boolean
  esRevisado: boolean
  coordX: number
  coordY: number
  personasImplicadas: string
  drogas: string
  sustanciasSolidas: string
  sustanciasLiquidas: string
  laboratoriosFabricas: string
  bienesIncautados: string
  totalCosto: string
}
