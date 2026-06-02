import type {
  InicioInvestigacionFilters,
  InicioInvestigacionItem,
  InicioInvestigacionEstado,
  SelectOption,
} from '../types/inicio-investigacion.types'

export const regionalOptions: SelectOption[] = [
  { value: 'La Paz', label: 'La Paz' },
  { value: 'Cochabamba', label: 'Cochabamba' },
  { value: 'Santa Cruz', label: 'Santa Cruz' },
  { value: 'Oruro', label: 'Oruro' },
]

export const estadoOptions: SelectOption[] = [
  { value: 'En análisis', label: 'En análisis' },
  { value: 'En observación', label: 'En observación' },
  { value: 'Derivado', label: 'Derivado' },
  { value: 'Cerrado', label: 'Cerrado' },
]

export const investigadorOptions: SelectOption[] = [
  { value: 'Cnel. Juan Pérez', label: 'Cnel. Juan Pérez' },
  { value: 'My. Carla Flores', label: 'My. Carla Flores' },
  { value: 'Tte. Diego Ruiz', label: 'Tte. Diego Ruiz' },
  { value: 'Sgto. Ana Rojas', label: 'Sgto. Ana Rojas' },
]

export const departamentoOptions: SelectOption[] = [
  { value: 'Crimen Organizado', label: 'Crimen Organizado' },
  { value: 'Anticorrupción', label: 'Anticorrupción' },
  { value: 'Narcoanálisis', label: 'Narcoanálisis' },
  { value: 'Fronteras', label: 'Fronteras' },
]

export const mockInvestigaciones: InicioInvestigacionItem[] = [
  {
    id: 'INV-001',
    regional: 'La Paz',
    nombreCaso: 'Red de lavado de activos en zona sur',
    estadoCaso: 'En análisis',
    nroCasoGiaef: 'GIAEF-2026-0001',
    nroCasoFelcn: 'FELCN-2026-0088',
    nroCasoFiscalia: 'FIS-2026-0451',
    nroPerdidaDominio: 'PD-2026-014',
    iaunus: 'IAU-001',
    fiscalQueRemite: 'Fiscalía Departamental LP',
    fechaRemision: '2026-05-15',
    conformeA: 'Memorando 021/2026',
    investigador: 'Cnel. Juan Pérez',
    departamento: 'Crimen Organizado',
  },
  {
    id: 'INV-002',
    regional: 'Cochabamba',
    nombreCaso: 'Tráfico de sustancias controladas en ruta norte',
    estadoCaso: 'Derivado',
    nroCasoGiaef: 'GIAEF-2026-0002',
    nroCasoFelcn: 'FELCN-2026-0092',
    nroCasoFiscalia: 'FIS-2026-0459',
    nroPerdidaDominio: 'PD-2026-021',
    iaunus: 'IAU-002',
    fiscalQueRemite: 'Fiscalía Especializada CBBA',
    fechaRemision: '2026-05-21',
    conformeA: 'Informe Técnico 18/2026',
    investigador: 'My. Carla Flores',
    departamento: 'Narcoanálisis',
  },
  {
    id: 'INV-003',
    regional: 'Santa Cruz',
    nombreCaso: 'Seguimiento a activos vinculados a organización criminal',
    estadoCaso: 'En observación',
    nroCasoGiaef: 'GIAEF-2026-0003',
    nroCasoFelcn: 'FELCN-2026-0104',
    nroCasoFiscalia: 'FIS-2026-0481',
    nroPerdidaDominio: 'PD-2026-032',
    iaunus: 'IAU-003',
    fiscalQueRemite: 'Fiscalía Departamental SC',
    fechaRemision: '2026-05-28',
    conformeA: 'Oficio 144/2026',
    investigador: 'Tte. Diego Ruiz',
    departamento: 'Fronteras',
  },
  {
    id: 'INV-004',
    regional: 'Oruro',
    nombreCaso: 'Caso de compra irregular de bienes incautados',
    estadoCaso: 'Cerrado',
    nroCasoGiaef: 'GIAEF-2026-0004',
    nroCasoFelcn: 'FELCN-2026-0110',
    nroCasoFiscalia: 'FIS-2026-0490',
    nroPerdidaDominio: 'PD-2026-040',
    iaunus: 'IAU-004',
    fiscalQueRemite: 'Fiscalía Anticorrupción OR',
    fechaRemision: '2026-06-01',
    conformeA: 'Resolución 9/2026',
    investigador: 'Sgto. Ana Rojas',
    departamento: 'Anticorrupción',
  },
  {
    id: 'INV-005',
    regional: 'La Paz',
    nombreCaso: 'Operativo de interceptación financiera',
    estadoCaso: 'En análisis',
    nroCasoGiaef: 'GIAEF-2026-0005',
    nroCasoFelcn: 'FELCN-2026-0118',
    nroCasoFiscalia: 'FIS-2026-0502',
    nroPerdidaDominio: 'PD-2026-043',
    iaunus: 'IAU-005',
    fiscalQueRemite: 'Fiscalía Especializada LP',
    fechaRemision: '2026-05-30',
    conformeA: 'Memorando 028/2026',
    investigador: 'Cnel. Juan Pérez',
    departamento: 'Crimen Organizado',
  },
  {
    id: 'INV-006',
    regional: 'Santa Cruz',
    nombreCaso: 'Investigación por ocultamiento de patrimonio',
    estadoCaso: 'Derivado',
    nroCasoGiaef: 'GIAEF-2026-0006',
    nroCasoFelcn: 'FELCN-2026-0121',
    nroCasoFiscalia: 'FIS-2026-0508',
    nroPerdidaDominio: 'PD-2026-051',
    iaunus: 'IAU-006',
    fiscalQueRemite: 'Fiscalía Departamental SC',
    fechaRemision: '2026-05-12',
    conformeA: 'Informe 022/2026',
    investigador: 'My. Carla Flores',
    departamento: 'Anticorrupción',
  },
  {
    id: 'INV-007',
    regional: 'Cochabamba',
    nombreCaso:
      'Red de transporte de sustancias en frontera interdepartamental',
    estadoCaso: 'En observación',
    nroCasoGiaef: 'GIAEF-2026-0007',
    nroCasoFelcn: 'FELCN-2026-0129',
    nroCasoFiscalia: 'FIS-2026-0521',
    nroPerdidaDominio: 'PD-2026-058',
    iaunus: 'IAU-007',
    fiscalQueRemite: 'Fiscalía Especializada CBBA',
    fechaRemision: '2026-05-18',
    conformeA: 'Oficio 178/2026',
    investigador: 'Tte. Diego Ruiz',
    departamento: 'Narcoanálisis',
  },
  {
    id: 'INV-008',
    regional: 'Oruro',
    nombreCaso: 'Verificación documental de bienes patrimoniales',
    estadoCaso: 'Cerrado',
    nroCasoGiaef: 'GIAEF-2026-0008',
    nroCasoFelcn: 'FELCN-2026-0136',
    nroCasoFiscalia: 'FIS-2026-0530',
    nroPerdidaDominio: 'PD-2026-061',
    iaunus: 'IAU-008',
    fiscalQueRemite: 'Fiscalía Anticorrupción OR',
    fechaRemision: '2026-05-25',
    conformeA: 'Resolución 12/2026',
    investigador: 'Sgto. Ana Rojas',
    departamento: 'Fronteras',
  },
]

export const inicioInvestigacionInitialFilters: InicioInvestigacionFilters = {
  regionales: [],
  estadosCaso: [],
  nombreCaso: '',
  nroCasoGiaef: '',
  nroCasoFelcn: '',
  nroCasoFiscalia: '',
  nroPerdidaDominio: '',
  fechaRemision: '',
  busquedaCriterio: 'investigador',
  busquedaValor: '',
}

export const getEstadoBadgeClass = (estado: InicioInvestigacionEstado) => {
  if (estado === 'En análisis') return 'badge-outline-warning'
  if (estado === 'En observación') return 'badge-outline-info'
  if (estado === 'Derivado') return 'badge-outline-primary'
  return 'badge-outline-success'
}

export const containsText = (value: string, search: string) =>
  value.toLowerCase().includes(search.trim().toLowerCase())

export const filterInvestigaciones = (
  rows: InicioInvestigacionItem[],
  filters: InicioInvestigacionFilters
) => {
  const normalizedSearch = filters.busquedaValor.trim().toLowerCase()
  const normalizedNombre = filters.nombreCaso.trim().toLowerCase()
  const normalizedGiaef = filters.nroCasoGiaef.trim().toLowerCase()
  const normalizedFelcn = filters.nroCasoFelcn.trim().toLowerCase()
  const normalizedFiscalia = filters.nroCasoFiscalia.trim().toLowerCase()
  const normalizedPerdida = filters.nroPerdidaDominio.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesRegional =
      filters.regionales.length === 0 ||
      filters.regionales.includes(row.regional)
    const matchesEstado =
      filters.estadosCaso.length === 0 ||
      filters.estadosCaso.includes(row.estadoCaso)
    const matchesNombre =
      !normalizedNombre || containsText(row.nombreCaso, normalizedNombre)
    const matchesGiaef =
      !normalizedGiaef || containsText(row.nroCasoGiaef, normalizedGiaef)
    const matchesFelcn =
      !normalizedFelcn || containsText(row.nroCasoFelcn, normalizedFelcn)
    const matchesFiscalia =
      !normalizedFiscalia ||
      containsText(row.nroCasoFiscalia, normalizedFiscalia)
    const matchesPerdida =
      !normalizedPerdida ||
      containsText(row.nroPerdidaDominio, normalizedPerdida)
    const matchesFecha =
      !filters.fechaRemision || row.fechaRemision === filters.fechaRemision

    const searchField =
      filters.busquedaCriterio === 'investigador'
        ? row.investigador
        : row.departamento
    const matchesTopSearch =
      !normalizedSearch || containsText(searchField, normalizedSearch)

    return (
      matchesRegional &&
      matchesEstado &&
      matchesNombre &&
      matchesGiaef &&
      matchesFelcn &&
      matchesFiscalia &&
      matchesPerdida &&
      matchesFecha &&
      matchesTopSearch
    )
  })
}
