import { UsuarioType } from '@/app/login/types/loginTypes'
import { FiliacionPersonaTable } from './type/filiacion.persona.table'
import {
  PayloadSinarap,
  PersonaSinarap,
  DetallePersonaSinarap,
} from './services/sinarap.service'

export interface DatosFormularioSinarap {
  numeroDocumento?: string
  numeroCaso: string
  nombre: string
  paterno: string
  materno?: string
  apEsposo?: string
  nacionalidad: { value: number; label: string }
  genero: { value: number; label: string }
  profesionOcupacion: { value: number; label: string }
  alias: string
  tipoDocumento: { value: number; label: string }
  fechaNacimiento: string
  direccion: string
  estadoCivil: { value: number; label: string }
  lugarNacimiento: string
  lugarOperativo: string
  contratadoSegip: { value: number; label: string }
  observacion?: string
  estatura: number | string
  pesoCorporal: number | string
  estadoPersona: { value: number; label: string }
}

export interface PayloadMapeado {
  payload: PayloadSinarap
  camposFaltantes: string[]
}

const convertirFecha = (fecha: string) => {
  const [dia, mes, anio] = fecha.split('/')

  if (!dia || !mes || !anio) {
    return fecha
  }

  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

const formatearFechaHoraISO = (fecha: Date) => fecha.toISOString()

export const generarCodigoUnico = (): string => {
  const anio = new Date().getFullYear()
  const numero = Math.floor(100000 + Math.random() * 900000)
  return `SINARAP-${anio}-${numero}`
}

export const mapearPayloadSinarap = (
  valores: DatosFormularioSinarap,
  persona: FiliacionPersonaTable,
  usuario: UsuarioType | null
): PayloadMapeado => {
  const camposFaltantes: string[] = []

  const personaPayload: PersonaSinarap = {
    numeroDocumento: valores.numeroDocumento ?? '',
    nombres: valores.nombre,
    primerApellido: valores.paterno,
    segundoApellido: valores.materno ?? '',
    sexoId: valores.genero.value,
    tipoDocumentoId: valores.tipoDocumento.value,
    lugarNacimiento: valores.lugarNacimiento,
    fechaNacimiento: convertirFecha(valores.fechaNacimiento),
    verificado: valores.contratadoSegip.label === 'Si' ? 't' : 'f',
    personaRegistro:
      valores.contratadoSegip.label === 'Si' ? 'SEGIP' : 'MANUAL',
  }

  const detallePersonaPayload: DetallePersonaSinarap = {
    profesionId: valores.profesionOcupacion.value,
    estadoCivilId: valores.estadoCivil.value,
    nacionalidadId: valores.nacionalidad.value,
    domicilio: valores.direccion,
    peso: String(valores.pesoCorporal),
    altura: String(valores.estatura),
    aliasDenunciado: valores.alias,
  }

  const fechaActual = new Date()

  const payload: PayloadSinarap = {
    antecedente: {
      codigoUnico: generarCodigoUnico(),
      fechaHoraIngreso: formatearFechaHoraISO(fechaActual),
      lugarHecho: valores.lugarOperativo,
      calidadIngresoId: valores.estadoPersona.value,
      numeroCasoInterno: valores.numeroCaso,
      fechaHecho: fechaActual.toISOString().split('T')[0],
      observaciones: valores.observacion ?? '',
    },
    personas: [
      {
        persona: personaPayload,
        detallePersona: detallePersonaPayload,
        vehiculos: [],
      },
    ],
    detalleFuncionario: null,
    documentos: [],
  }

  if (usuario?.persona?.nroDocumento) {
    payload.detalleFuncionario = {
      numeroDocumento: usuario.persona.nroDocumento,
      detalleTelefono: usuario.persona.telefono ?? '',
      gradoId: usuario.grado?.id,
    }
  } else {
    camposFaltantes.push(
      'detalleFuncionario.numeroDocumento (Datos del funcionario logueado)'
    )
  }

  if (!valores.numeroDocumento) {
    camposFaltantes.push('persona.numeroDocumento')
  }
  if (!persona.numero_caso) {
    camposFaltantes.push('antecedente.numeroCasoInterno')
  }

  camposFaltantes.push(
    'antecedente.municipioId',
    'antecedente.detalleIngreso',
    'antecedente.detalleHecho',
    'antecedente.georeferenciacion',
    'persona.complemento',
    'persona.fotoPersona',
    'detallePersona.extencionPaisId',
    'detallePersona.extencionDepartamentoId',
    'detallePersona.nivelEducacionId',
    'detallePersona.municipioId',
    'detallePersona.telefono',
    'detallePersona.celular',
    'detallePersona.correoElectronico',
    'detallePersona.lugarTrabajo',
    'detallePersona.georeferenciacion',
    'detallePersona.autoidentificacionId',
    'detallePersona.poblacionVulnerableId',
    'detallePersona.fechaValidezLicencia',
    'detallePersona.parentescoVictimaId',
    'detallePersona.gradoAlcoholico',
    'detallePersona.fotoFrente',
    'detallePersona.fotoDerecho',
    'detallePersona.fotoIzquierdo',
    'detallePersona.fotoCuerpo',
    'detalleFuncionario.extencionPaisId',
    'detalleFuncionario.extencionDepartamentoId',
    'detalleFuncionario.trabajoDepartamentoId',
    'detalleFuncionario.detalleDomicilio',
    'vehiculos',
    'documentos'
  )

  return { payload, camposFaltantes }
}