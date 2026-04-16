export type InraSearchType = 'TITULO' | 'IDENTIFICACION'

export interface InraMensaje {
  codigo: string
  mensaje: string
  tipo: 'INFORMACION' | 'ERROR'
}

export interface InraBeneficiario {
  nombres: string
  numeroIdentidad: string
  primerApellido: string
  segundoApellido: string
  expedicion: string
  fechaNacimiento: string
  genero: string
  tipoBeneficiario: string
  estadoCivil: string
}

export interface InraTitulo {
  numeroTitulo: string
  fechaTitulo: string
  nombrePredio: string
  superficie: number
  claseTitulo: string
  calificacion: string
  clasificacion: string
  departamento: string
  provincia: string
  municipio: string
  canton: string
  presidente: string
  director: string
  resolucionTitulacion: string
  fechaResolucionTitulacion: string
  beneficiariosList: InraBeneficiario[]
}

export interface InraResponse {
  mensajes: InraMensaje[]
  cantidadTitulo: number
  respuestaTitulos: InraTitulo[] | null
}

const TITULOS_BASE: InraTitulo[] = [
  {
    numeroTitulo: 'PPDNAL334976',
    fechaTitulo: '2014-07-07',
    nombrePredio: 'AYLLU ORIGINARIO KALLA BAJA LLALLAGUA PARCELA 37',
    superficie: 37.0493,
    claseTitulo: 'Copropiedad',
    calificacion: 'Ganadera',
    clasificacion: 'Pequena',
    departamento: 'La Paz',
    provincia: 'Pacajes',
    municipio: 'Caquiaviri',
    canton: 'Caquiaviri',
    presidente: 'Evo Morales Ayma',
    director: 'Jorge Gomez Chumacero',
    resolucionTitulacion: '11454',
    fechaResolucionTitulacion: '2013-12-31',
    beneficiariosList: [
      {
        nombres: 'GENOVEVA',
        numeroIdentidad: '2346376',
        primerApellido: 'TININI',
        segundoApellido: 'CASAS',
        expedicion: 'LP',
        fechaNacimiento: '1949-01-03',
        genero: 'Mujer',
        tipoBeneficiario: 'Poseedor',
        estadoCivil: 'Soltero(a)',
      },
    ],
  },
]

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const buildSuccess = (titulos: InraTitulo[] | null): InraResponse => ({
  mensajes: [
    {
      codigo: 'SET-BT-0001',
      mensaje: 'Busqueda de titulos realizado exitosamente',
      tipo: 'INFORMACION',
    },
  ],
  cantidadTitulo: titulos?.length ?? 0,
  respuestaTitulos: titulos,
})

export const buscarInraPorNumeroTituloFake = async (
  nroTitulo: string
): Promise<InraResponse> => {
  await wait(600)

  const cleaned = nroTitulo.trim().toUpperCase()
  if (!cleaned || cleaned === 'SIN-DATOS') {
    return buildSuccess(null)
  }

  const titulos = TITULOS_BASE.filter((item) =>
    item.numeroTitulo.toUpperCase().includes(cleaned)
  )

  return buildSuccess(titulos.length > 0 ? titulos : null)
}

export const buscarInraPorNumeroIdentificacionFake = async (
  numeroIdentidad: string
): Promise<InraResponse> => {
  await wait(600)

  const cleaned = numeroIdentidad.trim()
  if (!cleaned || cleaned === '0') {
    return buildSuccess(null)
  }

  const titulos = TITULOS_BASE.filter((titulo) =>
    titulo.beneficiariosList.some(
      (beneficiario) => beneficiario.numeroIdentidad === cleaned
    )
  )

  return buildSuccess(titulos.length > 0 ? titulos : null)
}
