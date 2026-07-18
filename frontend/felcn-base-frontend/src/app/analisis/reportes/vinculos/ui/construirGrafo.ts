import type {
  BienDetallePreview,
  BlancoDetallePreview,
  DetalleCasoPreview,
  OrganizacionDetallePreview,
} from '@/services/analisis'

export type GrupoNodoVinculo = 'caso' | 'blanco' | 'empresa' | 'bien'

export type DetalleNodoVinculo =
  | { tipo: 'caso'; data: DetalleCasoPreview['caso'] }
  | { tipo: 'blanco'; data: BlancoDetallePreview }
  | { tipo: 'empresa'; data: OrganizacionDetallePreview }
  | { tipo: 'bien'; data: BienDetallePreview }

export interface NodoVinculo {
  id: string
  label: string
  group: GrupoNodoVinculo
  title: string
  entidad: DetalleNodoVinculo
}

export interface AristaVinculo {
  id: string
  from: string
  to: string
  label?: string
  dashes?: boolean
  inferido?: boolean
}

export interface GrafoVinculosData {
  nodes: NodoVinculo[]
  edges: AristaVinculo[]
}

const idCasoNodo = (idCaso: string) => `caso-${idCaso}`
const idBlancoNodo = (idBlanco: string) => `blanco-${idBlanco}`
const idEmpresaNodo = (idEmpresa: string) => `empresa-${idEmpresa}`
const idBienNodo = (idItemBienSecundario: string) => `bien-${idItemBienSecundario}`

const nombreCompletoBlanco = (b: BlancoDetallePreview) =>
  [b.deNombres, b.dePaterno, b.deMaterno].filter(Boolean).join(' ').trim()

/** Quita acentos, pasa a mayúsculas y colapsa espacios para comparar texto libre. */
const normalizar = (v: string) =>
  v
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()

const tokenizar = (v: string) =>
  normalizar(v)
    .split(' ')
    .filter((t) => t.length >= 3)

/**
 * Heurística de coincidencia de nombres: no hay FK entre blanco y empresa,
 * así que "representante" es texto libre. Consideramos vínculo probable cuando
 * la mayoría de los tokens del nombre más corto aparecen en el otro texto.
 */
const esPosibleRepresentante = (nombreBlanco: string, representante: string): boolean => {
  const tokensBlanco = tokenizar(nombreBlanco)
  const tokensRepresentante = tokenizar(representante)
  if (tokensBlanco.length === 0 || tokensRepresentante.length === 0) return false

  const [tokensCortos, tokensLargos] =
    tokensBlanco.length <= tokensRepresentante.length
      ? [tokensBlanco, tokensRepresentante]
      : [tokensRepresentante, tokensBlanco]

  const setLargos = new Set(tokensLargos)
  const coincidencias = tokensCortos.filter((t) => setLargos.has(t)).length

  return coincidencias / tokensCortos.length >= 0.8
}

/** Transforma el detalle de un caso (RPT-MN-01) en nodos/aristas para vis-network. */
export function construirGrafo(detalle: DetalleCasoPreview): GrafoVinculosData {
  const nodes: NodoVinculo[] = []
  const edges: AristaVinculo[] = []

  const nodoCaso = idCasoNodo(detalle.caso.idCaso)
  nodes.push({
    id: nodoCaso,
    label: detalle.caso.nombreCaso,
    group: 'caso',
    title: `Caso: ${detalle.caso.nombreCaso}\nNro. CER: ${detalle.caso.nroCasoCer ?? 'N/A'}`,
    entidad: { tipo: 'caso', data: detalle.caso },
  })

  for (const b of detalle.blancos) {
    const nodoBlanco = idBlancoNodo(b.idBlanco)
    const nombre = nombreCompletoBlanco(b) || b.alias || `Blanco ${b.idBlanco}`
    nodes.push({
      id: nodoBlanco,
      label: nombre,
      group: 'blanco',
      title: `Investigado: ${nombre}${b.alias ? `\nAlias: ${b.alias}` : ''}`,
      entidad: { tipo: 'blanco', data: b },
    })
    edges.push({
      id: `${nodoCaso}->${nodoBlanco}`,
      from: nodoCaso,
      to: nodoBlanco,
      label: 'Investigado',
    })
  }

  for (const o of detalle.organizaciones) {
    const nodoEmpresa = idEmpresaNodo(o.idEmpresa)
    nodes.push({
      id: nodoEmpresa,
      label: o.nombre || `Empresa ${o.idEmpresa}`,
      group: 'empresa',
      title: `Organización: ${o.nombre}${o.nit ? `\nNIT: ${o.nit}` : ''}`,
      entidad: { tipo: 'empresa', data: o },
    })
    edges.push({
      id: `${nodoCaso}->${nodoEmpresa}`,
      from: nodoCaso,
      to: nodoEmpresa,
      label: 'Organización',
    })

    // Vínculo inferido: ¿algún investigado del caso coincide con el representante legal?
    if (o.representante?.trim()) {
      for (const b of detalle.blancos) {
        const nombre = nombreCompletoBlanco(b)
        if (nombre && esPosibleRepresentante(nombre, o.representante)) {
          edges.push({
            id: `${idBlancoNodo(b.idBlanco)}<->${nodoEmpresa}`,
            from: idBlancoNodo(b.idBlanco),
            to: nodoEmpresa,
            label: 'Representante Legal (inferido)',
            dashes: true,
            inferido: true,
          })
        }
      }
    }
  }

  for (const bien of detalle.bienes) {
    const nodoBien = idBienNodo(bien.idItemBienSecundario)
    const label = bien.descripcionBien ?? `Bien ${bien.idItemBienSecundario}`
    nodes.push({
      id: nodoBien,
      label,
      group: 'bien',
      title: `Bien investigado: ${label}${bien.descripcionTipo ? `\nTipo: ${bien.descripcionTipo}` : ''}`,
      entidad: { tipo: 'bien', data: bien },
    })
    edges.push({
      id: `${nodoCaso}->${nodoBien}`,
      from: nodoCaso,
      to: nodoBien,
      label: 'Bien Investigado',
    })
  }

  return { nodes, edges }
}
