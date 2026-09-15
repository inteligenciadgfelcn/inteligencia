export interface DatosPersonalesDetenido {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoEsposo: string
  nombreCompleto: string
  fechaNacimiento: string
  pais: string
  estadoCivil: string
  direccion: string
  estaVivo: boolean
  tieneTarjeta: boolean
  fechaIngreso: string
}

export interface AliasDetenido {
  id: number
  descripcion: string
}

export interface DocumentoDetenido {
  id: number
  numero: string
  tipo: string
  expedido: string
  contrastadoSegip: string
}

export interface FenotipoDetenido {
  estatura: string
  peso: string
  senasParticulares: string
  nariz: string
  constitucionCorporal: string
  colorPiel: string
  colorCabello: string
  tipoCabello: string
  colorOjos: string
  tipoOjos: string
}

export interface ProfesionDetenido {
  id: string
  descripcion: string
}

export interface FamiliarDetenido {
  id: number
  nombres: string
  paterno: string
  materno: string
  edad: string
  direccion: string
  telefono: string
  vivo: boolean
  implicado: boolean
  parentezco: string
}

export interface NombreSupuestoDetenido {
  id: number
  nombres: string
  paterno: string
  materno: string
  apellidoEsposo: string
  cpq: string | null
}

export interface HuellaDetenido {
  id: number
  dedo: string
  calidad: number
  imagen: string | null
}

export interface DetalleDetenido {
  idDetenido: number
  numeroCaso: string
  datosPersonales: DatosPersonalesDetenido
  aliases: AliasDetenido[]
  documentos: DocumentoDetenido[]
  fenotipo: FenotipoDetenido | null
  profesiones: ProfesionDetenido[]
  familiares: FamiliarDetenido[]
  nombresSupuestos: NombreSupuestoDetenido[]
  huellas: HuellaDetenido[]
}