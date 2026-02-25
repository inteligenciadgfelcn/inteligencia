export interface CasoServicioTypeCRUD {
  id: string
  estado: string
  codigoServicio: string
  nroPase: string
  departamento: string
  unidad: string
  distrital: string
  grupo: string
  nroRegistro: string
  nombreOperativo: string
  fechaHoraOperativo: string
  quienRealiza: DatosPersona
  asignadoA: DatosPersona
  fiscalAsignado: DatosPersona
}

export interface DatosPersona {
  nombreCompleto: string
  nroCelular: string
}

export const ejemplosCasoServicios: CasoServicioTypeCRUD[] = [
  {
    id: '1',
    estado: 'ACTIVO',
    codigoServicio: 'CS-001',
    nroPase: 'PASE-2024-001',
    departamento: 'Investigación',
    unidad: 'Unidad Central',
    distrital: 'Distrital Norte',
    grupo: 'Grupo A',
    nroRegistro: 'REG-1001',
    nombreOperativo: 'Operativo Centinela',
    fechaHoraOperativo: '2024-10-15T08:30:00',
    quienRealiza: {
      nombreCompleto: 'Juan Pérez',
      nroCelular: '70012345',
    },
    asignadoA: {
      nombreCompleto: 'María López',
      nroCelular: '70123456',
    },
    fiscalAsignado: {
      nombreCompleto: 'Carlos Fernández',
      nroCelular: '70234567',
    },
  },
  {
    id: '2',
    estado: 'ACTIVO',
    codigoServicio: 'CS-002',
    nroPase: 'PASE-2024-045',
    departamento: 'Operaciones',
    unidad: 'Unidad Especial',
    distrital: 'Distrital Sur',
    grupo: 'Grupo B',
    nroRegistro: 'REG-1045',
    nombreOperativo: 'Operativo Halcón',
    fechaHoraOperativo: '2024-11-02T14:00:00',
    quienRealiza: {
      nombreCompleto: 'Luis Gómez',
      nroCelular: '70345678',
    },
    asignadoA: {
      nombreCompleto: 'Ana Martínez',
      nroCelular: '70456789',
    },
    fiscalAsignado: {
      nombreCompleto: 'Ricardo Salinas',
      nroCelular: '70567890',
    },
  },
  {
    id: '3',
    estado: 'INACTIVO',
    codigoServicio: 'CS-003',
    nroPase: 'PASE-2023-210',
    departamento: 'Inteligencia',
    unidad: 'Unidad Regional',
    distrital: 'Distrital Este',
    grupo: 'Grupo C',
    nroRegistro: 'REG-1210',
    nombreOperativo: 'Operativo Fénix',
    fechaHoraOperativo: '2023-12-20T22:15:00',
    quienRealiza: {
      nombreCompleto: 'Pedro Ramírez',
      nroCelular: '70678901',
    },
    asignadoA: {
      nombreCompleto: 'Lucía Herrera',
      nroCelular: '70789012',
    },
    fiscalAsignado: {
      nombreCompleto: 'Mónica Rojas',
      nroCelular: '70890123',
    },
  },
]
