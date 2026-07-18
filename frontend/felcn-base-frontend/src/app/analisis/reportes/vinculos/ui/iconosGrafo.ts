import type { GrupoNodoVinculo } from './construirGrafo'

/**
 * Íconos usados como imagen de cada nodo del grafo (vis-network shape: 'circularImage').
 * Trazos adaptados del mismo lenguaje visual que @/components/Icon (relleno sólido,
 * blanco sobre el color del grupo) para que el grafo se sienta parte de la app.
 */
const svgDataUri = (paths: string, viewBox = '0 0 24 24') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="#ffffff">${paths}</svg>`,
  )}`

// Carpeta (adaptado de IconFolder, trazado como relleno sólido)
const ICONO_CASO = svgDataUri(
  '<path d="M2 6.9C2 5.2 3.3 3.7 5 3.3C5.6 3.2 6.4 3.2 8 3.2C8.8 3.2 9.5 3.4 10.1 3.9L11.3 5C12 5.7 12.9 6.1 14 6.1H18.2C19.9 6.1 21.2 7.4 21.5 9.1C21.6 9.7 21.6 10.5 21.6 12V14C21.6 17.3 21.6 19 20.6 20.1C19.5 21.1 17.8 21.1 14.4 21.1H9.2C5.9 21.1 4.2 21.1 3.1 20.1C2 19 2 17.3 2 14V6.9Z"/>',
)

// Persona (adaptado de IconUser fill)
const ICONO_BLANCO = svgDataUri(
  '<circle cx="12" cy="7.3" r="4.3"/><path d="M20 17.5C20 20 20 22 12 22C4 22 4 20 4 17.5C4 15 7.6 13 12 13C16.4 13 20 15 20 17.5Z"/>',
)

// Edificio (silueta simple con ventanas, sin equivalente en @/components/Icon)
const ICONO_EMPRESA = svgDataUri(
  '<path d="M4 21V5C4 3.9 4.9 3 6 3H13C14.1 3 15 3.9 15 5V21H4Z"/>' +
  '<path d="M15 10H18C19.1 10 20 10.9 20 12V21H15V10Z"/>' +
  '<rect x="6.5" y="6" width="2" height="2"/><rect x="10.5" y="6" width="2" height="2"/>' +
  '<rect x="6.5" y="10" width="2" height="2"/><rect x="10.5" y="10" width="2" height="2"/>' +
  '<rect x="6.5" y="14" width="2" height="2"/><rect x="10.5" y="14" width="2" height="2"/>' +
  '<rect x="16.5" y="13.5" width="2" height="2"/>',
)

// Caja (adaptado de IconBox fill)
const ICONO_BIEN = svgDataUri(
  '<path d="M11.2 27.5C13.6 28.7 14.7 29.3 16 29.3V16L3.5 9.4C3.5 9.5 3.5 9.5 3.5 9.5C2.7 10.9 2.7 12.6 2.7 15.9V16.1C2.7 19.4 2.7 21.1 3.5 22.5C4.3 23.8 5.7 24.6 8.6 26.1L11.2 27.5Z"/>' +
  '<path d="M23.4 5.9L20.8 4.5C18.4 3.3 17.3 2.7 16 2.7C14.7 2.7 13.6 3.3 11.2 4.5L8.6 5.9C5.8 7.4 4.3 8.1 3.5 9.4L16 16L28.5 9.4C27.7 8.1 26.2 7.4 23.4 5.9Z"/>' +
  '<path d="M28.5 9.5C28.5 9.5 28.5 9.5 28.5 9.4L16 16V29.3C17.3 29.3 18.4 28.7 20.8 27.5L23.4 26.1C26.3 24.6 27.7 23.8 28.5 22.5C29.3 21.1 29.3 19.4 29.3 16.1V15.9C29.3 12.6 29.3 10.9 28.5 9.5Z"/>',
  '0 0 32 32',
)

export const ICONOS_GRUPO: Record<GrupoNodoVinculo, string> = {
  caso: ICONO_CASO,
  blanco: ICONO_BLANCO,
  empresa: ICONO_EMPRESA,
  bien: ICONO_BIEN,
}
