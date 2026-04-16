export type ITVSearchType = 'PL' | 'CI' | 'CH'

export interface ITVPersona {
  Nombre: string
  apellido_paterno: string
  apellido_materno: string
  nro_documento: string
  expedido: string
  domicilio: string
  fecha_nacimiento: string
  sexo: string
  celular: string
  email: string
  documento_complemento: string | null
  licencia: string
  paisProcedencia: string
}

export interface ITVVehiculo {
  placa: string
  color: string
  marca: string
  clase: string
  chasis: string
  motor: string
  modelo: number | string
}

export interface ITVGestionVehiculos {
  gestion: string
  vehiculos: ITVVehiculo[]
}

export interface ITVResponse {
  status: string
  existe_data: boolean
  persona: ITVPersona
  datos: ITVGestionVehiculos[]
}

export interface ITVSearchRequest {
  tipoBusqueda: ITVSearchType
  datoBusqueda: string
}

const ITV_FAKE_RESPONSE: ITVResponse = {
  status: '200',
  existe_data: true,
  persona: {
    Nombre: 'name',
    apellido_paterno: 'pat',
    apellido_materno: 'mat',
    nro_documento: '1234',
    expedido: 'LA PAZ',
    domicilio: 'C. OCUREÑA N° 2413 Z. VILLA TUNARI',
    fecha_nacimiento: '1973-01-20 00:00:00',
    sexo: 'M',
    celular: '12345678',
    email: 'fredy@gmail.com',
    documento_complemento: null,
    licencia: 'PROFESIONAL "C"',
    paisProcedencia: 'BOLIVIA',
  },
  datos: [
    {
      gestion: '2024',
      vehiculos: [
        {
          placa: '1434LKL',
          color: 'VERDE',
          marca: 'NISSAN',
          clase: 'OMNIBUS',
          chasis: 'MK250KN03850',
          motor: 'FE6207113C',
          modelo: 1995,
        },
        {
          placa: '1257ICB',
          color: 'BLANCO',
          marca: 'TOYOTA',
          clase: 'VAGONETA',
          chasis: 'ET1960011293',
          motor: '5E0346359',
          modelo: 1993,
        },
      ],
    },
    {
      gestion: '2023',
      vehiculos: [
        {
          placa: '1257ICB',
          color: 'BLANCO',
          marca: 'TOYOTA',
          clase: 'VAGONETA',
          chasis: 'ET1960012293',
          motor: '5E0346359',
          modelo: '1993',
        },
        {
          placa: '1434LKL',
          color: 'VERDE',
          marca: 'NISSAN',
          clase: 'OMNIBUS',
          chasis: 'MK250KN12850',
          motor: 'FE6207113C',
          modelo: '1995',
        },
      ],
    },
  ],
}

export const getITVInteroperabilidadFake = async (
  _payload: ITVSearchRequest
): Promise<ITVResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ITV_FAKE_RESPONSE)
    }, 500)
  })
}
