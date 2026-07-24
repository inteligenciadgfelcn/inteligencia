export type TipoMapa = 'normal' | 'fisico' | 'satelital' | 'hibrido'

export const TILES_MAPA: Record<TipoMapa, { url: string; overlay?: string }> = {
  normal: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  fisico: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  },
  satelital: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  hibrido: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlay: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  },
}

export const BOTONES_TIPO_MAPA: { tipo: TipoMapa; label: string; variant: string }[] = [
  { tipo: 'normal', label: 'Mapa Normal', variant: 'btn-success' },
  { tipo: 'fisico', label: 'Mapa Fisico', variant: 'btn-primary' },
  { tipo: 'satelital', label: 'Mapa Satelital', variant: 'btn-info' },
  { tipo: 'hibrido', label: 'Mapa Hibrido', variant: 'btn-warning' },
]
