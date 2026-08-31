export interface CaracteristicaBien {
  id: string
  nombreCaracteristica: string
  descripcion: string
}

export interface BienIdentificado {
  id: number
  casosId: number
  bienId: number
  claseId: number
  tipoId: number
  caracteristicas: CaracteristicaBien[]
  direccion: string
  latitud: number | null
  longitud: number | null
  tipoVinculo: string
  nombre: string
  ci: string
  nombreDepositario: string
  ciDepositario: string
  situacionLegal: string
  fechaSituacionLegal: string
  cuantiaPresunta: number
  valorComercial: number
  pericia: boolean
  resultadoPericia: string
  autoridadDispuso: string
  fechaHoraIng: string
  usuario: string
}

export interface TipoBien {
  id: number
  descripcion: string
}

export interface ClaseBien {
  id: number
  descripcion: string
  tipos: TipoBien[]
}

export interface CatalogoBien {
  id: number
  descripcion: string
  clases: ClaseBien[]
}

export const CATALOGO_BIENES: CatalogoBien[] = [
  {
    id: 1,
    descripcion: 'Inmuebles',
    clases: [
      {
        id: 11,
        descripcion: 'Casa',
        tipos: [
          { id: 111, descripcion: 'Casa Independiente' },
          { id: 112, descripcion: 'Casa Adosada' },
          { id: 113, descripcion: 'Casa en Conjunto' },
        ],
      },
      {
        id: 12,
        descripcion: 'Terreno',
        tipos: [
          { id: 121, descripcion: 'Terreno Urbano' },
          { id: 122, descripcion: 'Terreno Rural' },
        ],
      },
      {
        id: 13,
        descripcion: 'Apartamento',
        tipos: [
          { id: 131, descripcion: 'Apartamento Privado' },
          { id: 132, descripcion: 'Apartamento en Edificio' },
        ],
      },
    ],
  },
  {
    id: 2,
    descripcion: 'Medio de transporte',
    clases: [
      {
        id: 21,
        descripcion: 'Vehículo motorizado',
        tipos: [
          { id: 211, descripcion: 'Automóvil' },
          { id: 212, descripcion: 'Camioneta' },
          { id: 213, descripcion: 'Motocicleta' },
        ],
      },
      {
        id: 22,
        descripcion: 'Vehículo no motorizado',
        tipos: [
          { id: 221, descripcion: 'Bicicleta' },
          { id: 222, descripcion: 'Triciclo' },
        ],
      },
    ],
  },
  {
    id: 3,
    descripcion: 'Equipos de Comunicación',
    clases: [
      {
        id: 31,
        descripcion: 'Equipo telefónico',
        tipos: [
          { id: 311, descripcion: 'Teléfono celular' },
          { id: 312, descripcion: 'Teléfono satelital' },
        ],
      },
      {
        id: 32,
        descripcion: 'Equipo de radio',
        tipos: [
          { id: 321, descripcion: 'Radio HF' },
          { id: 322, descripcion: 'Radio VHF' },
          { id: 323, descripcion: 'Radio UHF' },
        ],
      },
    ],
  },
  {
    id: 4,
    descripcion: 'Equipos electrónicos',
    clases: [
      {
        id: 41,
        descripcion: 'Computación',
        tipos: [
          { id: 411, descripcion: 'Computadora de escritorio' },
          { id: 412, descripcion: 'Laptop' },
          { id: 413, descripcion: 'Tableta' },
        ],
      },
      {
        id: 42,
        descripcion: 'Audio/Video',
        tipos: [
          { id: 421, descripcion: 'Televisor' },
          { id: 422, descripcion: 'Cámara' },
          { id: 423, descripcion: 'Equipos de sonido' },
        ],
      },
    ],
  },
  {
    id: 5,
    descripcion: 'Dinero',
    clases: [
      {
        id: 51,
        descripcion: 'Efectivo',
        tipos: [
          { id: 511, descripcion: 'Bolivianos' },
          { id: 512, descripcion: 'Dólares' },
          { id: 513, descripcion: 'Euros' },
        ],
      },
      {
        id: 52,
        descripcion: 'Instrumentos monetarios',
        tipos: [
          { id: 521, descripcion: 'Cheques' },
          { id: 522, descripcion: 'Letras de cambio' },
        ],
      },
    ],
  },
  {
    id: 6,
    descripcion: 'Armas',
    clases: [
      {
        id: 61,
        descripcion: 'Arma de fuego',
        tipos: [
          { id: 611, descripcion: 'Pistola' },
          { id: 612, descripcion: 'Rifle' },
          { id: 613, descripcion: 'Escopeta' },
        ],
      },
      {
        id: 62,
        descripcion: 'Arma blanca',
        tipos: [
          { id: 621, descripcion: 'Cuchillo' },
          { id: 622, descripcion: 'Machete' },
          { id: 623, descripcion: 'Navaja' },
        ],
      },
    ],
  },
  {
    id: 7,
    descripcion: 'Municiones',
    clases: [
      {
        id: 71,
        descripcion: 'Municiones de_firearm',
        tipos: [
          { id: 711, descripcion: 'Municiones para pistola' },
          { id: 712, descripcion: 'Municiones para rifle' },
          { id: 713, descripcion: 'Municiones para escopeta' },
        ],
      },
    ],
  },
  {
    id: 8,
    descripcion: 'Explosivos',
    clases: [
      {
        id: 81,
        descripcion: 'Explosivo artesanal',
        tipos: [
          { id: 811, descripcion: 'Carga explosiva' },
          { id: 812, descripcion: 'Artificio pirotécnico' },
        ],
      },
      {
        id: 82,
        descripcion: 'Explosivo industrial',
        tipos: [
          { id: 821, descripcion: 'Dinamita' },
          { id: 822, descripcion: 'Gel emulsionante' },
        ],
      },
    ],
  },
  {
    id: 9,
    descripcion: 'Semovientes',
    clases: [
      {
        id: 91,
        descripcion: 'Ganado vacuno',
        tipos: [
          { id: 911, descripcion: 'Toro' },
          { id: 912, descripcion: 'Vaca' },
          { id: 913, descripcion: 'Ternero' },
        ],
      },
      {
        id: 92,
        descripcion: 'Ganado ovino/caprino',
        tipos: [
          { id: 921, descripcion: 'Oveja' },
          { id: 922, descripcion: 'Cabra' },
        ],
      },
    ],
  },
  {
    id: 10,
    descripcion: 'Joyas',
    clases: [
      {
        id: 101,
        descripcion: 'Joyería en oro',
        tipos: [
          { id: 1011, descripcion: 'Anillo' },
          { id: 1012, descripcion: 'Collar' },
          { id: 1013, descripcion: 'Pulsera' },
        ],
      },
      {
        id: 102,
        descripcion: 'Joyería en plata',
        tipos: [
          { id: 1021, descripcion: 'Aretes' },
          { id: 1022, descripcion: 'Broche' },
        ],
      },
    ],
  },
  {
    id: 11,
    descripcion: 'Muebles',
    clases: [
      {
        id: 111,
        descripcion: 'Mueble de oficina',
        tipos: [
          { id: 1111, descripcion: 'Escritorio' },
          { id: 1112, descripcion: 'Silla' },
          { id: 1113, descripcion: 'Archivador' },
        ],
      },
      {
        id: 112,
        descripcion: 'Mueble de hogar',
        tipos: [
          { id: 1121, descripcion: 'Sofá' },
          { id: 1122, descripcion: 'Cama' },
          { id: 1123, descripcion: 'Mesa' },
        ],
      },
    ],
  },
  {
    id: 12,
    descripcion: 'Criptoactivos',
    clases: [
      {
        id: 121,
        descripcion: 'Criptomoneda',
        tipos: [
          { id: 1211, descripcion: 'Bitcoin' },
          { id: 1212, descripcion: 'Ethereum' },
          { id: 1213, descripcion: 'Otra' },
        ],
      },
    ],
  },
  {
    id: 13,
    descripcion: 'Otros',
    clases: [
      {
        id: 131,
        descripcion: 'Objeto general',
        tipos: [
          { id: 1311, descripcion: 'Herramienta' },
          { id: 1312, descripcion: 'Equipo especial' },
          { id: 1313, descripcion: 'Material' },
        ],
      },
    ],
  },
]

export const TIPOS_VINCULO = ['Titular', 'Poseedor', 'Tenedor'] as const

export const SITUACIONES_LEGALES = [
  'Secuestrado',
  'Incautado',
  'Confiscado / Decomisado',
  'Entrega a DIRCABI',
  'Devolución',
] as const

export const CARACTERISTICAS_POR_BIEN: Record<number, string[]> = {
  1: ['Color', 'Material', 'Estado', 'Observaciones', 'Metros cuadrados', 'Nro pisos'],
  2: ['Marca', 'Modelo', 'Año', 'Nro placa', 'Color', 'Estado'],
  3: ['Marca', 'Modelo', 'Nro serie', 'Frecuencia', 'Estado'],
  4: ['Marca', 'Modelo', 'Capacidad', 'Nro serie', 'Estado'],
  5: ['Denominación', 'Cantidad', 'Billetes/Monedas', 'Observaciones'],
  6: ['Calibre', 'Marca', 'Nro serie', 'Estado'],
  7: ['Calibre', 'Marca', 'Cantidad', 'Estado'],
  8: ['Tipo explosivo', 'Cantidad', 'Peso', 'Estado'],
  9: ['Especie', 'Raza', 'Edad', 'Color', 'Estado'],
  10: ['Tipo', 'Peso', 'Pureza', 'Estado'],
  11: ['Tipo', 'Material', 'Dimensiones', 'Estado'],
  12: ['Tipo cripto', 'Wallet', 'Red', 'Estado'],
  13: ['Descripción', 'Estado', 'Observaciones'],
}

export const VALORES_POR_DEFECTO: Omit<BienIdentificado, 'id' | 'casosId'> = {
  bienId: 0,
  claseId: 0,
  tipoId: 0,
  caracteristicas: [],
  direccion: '',
  latitud: null,
  longitud: null,
  tipoVinculo: '',
  nombre: '',
  ci: '',
  nombreDepositario: '',
  ciDepositario: '',
  situacionLegal: '',
  fechaSituacionLegal: '',
  cuantiaPresunta: 0,
  valorComercial: 0,
  pericia: false,
  resultadoPericia: '',
  autoridadDispuso: '',
  fechaHoraIng: '',
  usuario: '_usuario_actual',
}
