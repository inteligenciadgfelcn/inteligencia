export interface Mensaje {
  codigo: number;
  descripcion: string;
}

export interface DatosContribuyente {
  nit: number;
  nombreRazonSocial: string;
  direccionFiscal: string;
  tipoContribuyente: number;
  descripcionTipoContribuyente: string;
  actividadPrincipal: number;
  descActividadPrincipal: string;
  granActividad: number;
  descGranActividad: string;
}

export interface ContribuyenteResponse {
  datosContribuyente: DatosContribuyente;
  uuid: string;
  estado: boolean;
  mensajes: Mensaje[];
}

export const contribuyentes: ContribuyenteResponse[] = [
  {
    datosContribuyente: {
      nit: 1020269020,
      nombreRazonSocial: "YACIMIENTOS PETROLIFEROS FISCALES BOLIVIANOS",
      direccionFiscal:
        "AVENIDA 16 DE JULIO Nro. 40 Edif.: YPFB CORPORATIVO Piso: PLANTA BAJA Zona CENTRAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 60000,
      descActividadPrincipal:
        "EXPLORACIÓN, EXPLOTACIÓN, PRODUCCIÓN, REFINACIÓN Y COMERCIALIZACIÓN DE HIDROCARBUROS",
      granActividad: 5,
      descGranActividad: "COMERCIO MAYORISTA"
    },
    uuid: "27030161-28ba-4917-8301-6128bac9178e",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Solicitud procesada correctamente."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1023456789,
      nombreRazonSocial: "IMPORTADORA ANDINA SRL",
      direccionFiscal:
        "CALLE COMERCIO Nro. 120 Zona CENTRAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 45101,
      descActividadPrincipal:
        "VENTA AL POR MAYOR DE PRODUCTOS IMPORTADOS",
      granActividad: 5,
      descGranActividad: "COMERCIO MAYORISTA"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90001",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Contribuyente encontrado."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1034567890,
      nombreRazonSocial: "CONSTRUCTORA DEL SUR SA",
      direccionFiscal:
        "AVENIDA HEROES DEL CHACO Nro. 890 Zona SUR",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 41000,
      descActividadPrincipal:
        "CONSTRUCCION DE EDIFICIOS Y OBRAS CIVILES",
      granActividad: 2,
      descGranActividad: "CONSTRUCCION"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90002",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Solicitud procesada correctamente."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1045678901,
      nombreRazonSocial: "FARMACIA BOLIVIA LTDA",
      direccionFiscal:
        "CALLE BALLIVIAN Nro. 550 Zona CENTRAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 47721,
      descActividadPrincipal:
        "VENTA AL POR MENOR DE PRODUCTOS FARMACEUTICOS",
      granActividad: 4,
      descGranActividad: "COMERCIO MINORISTA"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90003",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Contribuyente habilitado."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1056789012,
      nombreRazonSocial: "TRANSPORTES ORIENTE SRL",
      direccionFiscal:
        "AVENIDA BANZER Nro. 1400 Zona NORTE",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 49230,
      descActividadPrincipal:
        "SERVICIO DE TRANSPORTE DE CARGA",
      granActividad: 7,
      descGranActividad: "TRANSPORTE Y ALMACENAMIENTO"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90004",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Consulta realizada correctamente."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1067890123,
      nombreRazonSocial: "TECNOLOGIA DIGITAL BOLIVIA",
      direccionFiscal:
        "CALLE AYACUCHO Nro. 321 Piso 2 Zona CENTRAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 62010,
      descActividadPrincipal:
        "DESARROLLO Y CONSULTORIA DE SOFTWARE",
      granActividad: 9,
      descGranActividad: "SERVICIOS INFORMATICOS"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90005",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Registro activo."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1078901234,
      nombreRazonSocial: "HOTEL PLAZA REAL",
      direccionFiscal:
        "AVENIDA CAMACHO Nro. 780 Zona CENTRAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 55100,
      descActividadPrincipal:
        "SERVICIOS DE HOSPEDAJE EN HOTELES",
      granActividad: 8,
      descGranActividad: "TURISMO Y HOTELERIA"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90006",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Empresa registrada correctamente."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1089012345,
      nombreRazonSocial: "INDUSTRIAS ALIMENTICIAS DEL VALLE",
      direccionFiscal:
        "PARQUE INDUSTRIAL MANZANO 12",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 10710,
      descActividadPrincipal:
        "ELABORACION DE PRODUCTOS ALIMENTICIOS",
      granActividad: 3,
      descGranActividad: "INDUSTRIA MANUFACTURERA"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90007",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Datos obtenidos correctamente."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1090123456,
      nombreRazonSocial: "SERVICIOS EDUCATIVOS DEL PACIFICO",
      direccionFiscal:
        "CALLE SUCRE Nro. 950 Zona UNIVERSITARIA",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 85210,
      descActividadPrincipal:
        "SERVICIOS DE EDUCACION SUPERIOR",
      granActividad: 10,
      descGranActividad: "EDUCACION"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90008",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Consulta satisfactoria."
      }
    ]
  },

  {
    datosContribuyente: {
      nit: 1101234567,
      nombreRazonSocial: "AGROPECUARIA DEL NORTE SA",
      direccionFiscal:
        "RUTA NACIONAL KM 25 Zona RURAL",
      tipoContribuyente: 1,
      descripcionTipoContribuyente: "PERSONA JURIDICA",
      actividadPrincipal: 15000,
      descActividadPrincipal:
        "PRODUCCION AGRICOLA Y GANADERA",
      granActividad: 1,
      descGranActividad: "AGROPECUARIA"
    },
    uuid: "ab230161-28ba-4917-8301-6128bac90009",
    estado: true,
    mensajes: [
      {
        codigo: 200,
        descripcion: "Empresa habilitada."
      }
    ]
  }
];