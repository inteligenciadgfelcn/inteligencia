'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DataSet } from 'vis-data'
import { Network, type Options } from 'vis-network'
import type { IRootState } from '@/store'
import { ICONOS_GRUPO } from './iconosGrafo'
import type { GrafoVinculosData, GrupoNodoVinculo, NodoVinculo } from './construirGrafo'

interface Props {
  datos: GrafoVinculosData
  onSeleccionarNodo: (nodo: NodoVinculo | null) => void
}

/** Mismos colores semánticos (danger/info/success) que usa el resto de vistas de reportes S2I. */
const COLOR_GRUPO: Record<GrupoNodoVinculo, string> = {
  caso: '#3e5f8a',
  blanco: '#e7515a',
  empresa: '#2196f3',
  bien: '#00ab55',
}

const TAMANO_GRUPO: Record<GrupoNodoVinculo, number> = {
  caso: 34,
  blanco: 24,
  empresa: 24,
  bien: 24,
}

export default function GrafoVinculos({ datos, onSeleccionarNodo }: Props) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useSelector((state: IRootState) => state.themeConfig.isDarkMode)

  useEffect(() => {
    if (!contenedorRef.current) return

    const nodes = new DataSet(
      datos.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        title: n.title,
        group: n.group,
      })),
    )
    const edges = new DataSet(
      datos.edges.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label,
        dashes: e.dashes,
        color: e.inferido
          ? { color: '#e2a03f', highlight: '#e2a03f' }
          : undefined,
      })),
    )

    const grupos = (Object.keys(COLOR_GRUPO) as GrupoNodoVinculo[]).reduce(
      (acc, grupo) => {
        acc[grupo] = {
          shape: 'circularImage',
          image: ICONOS_GRUPO[grupo],
          size: TAMANO_GRUPO[grupo],
          color: { background: COLOR_GRUPO[grupo], border: COLOR_GRUPO[grupo] },
        }
        return acc
      },
      {} as Record<GrupoNodoVinculo, unknown>,
    )

    const options: Options = {
      groups: grupos,
      nodes: {
        borderWidth: 2,
        font: { color: isDarkMode ? '#bfc9d4' : '#3b3f5c', size: 13 },
      },
      edges: {
        color: { color: isDarkMode ? '#515365' : '#d3d3d3', highlight: '#3e5f8a' },
        font: {
          color: isDarkMode ? '#bfc9d4' : '#515365',
          size: 11,
          strokeWidth: 0,
        },
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
        arrows: { to: { enabled: false } },
      },
      physics: {
        stabilization: { iterations: 150 },
        barnesHut: { springLength: 140, avoidOverlap: 0.4 },
      },
      interaction: { hover: true, tooltipDelay: 150 },
      layout: { improvedLayout: true },
    }

    const network = new Network(
      contenedorRef.current,
      { nodes, edges },
      options,
    )

    network.on('click', (params: { nodes: string[] }) => {
      if (params.nodes.length === 0) {
        onSeleccionarNodo(null)
        return
      }
      const nodo = datos.nodes.find((n) => n.id === params.nodes[0])
      onSeleccionarNodo(nodo ?? null)
    })

    return () => {
      network.destroy()
    }
  }, [datos, isDarkMode, onSeleccionarNodo])

  return (
    <div
      ref={contenedorRef}
      className="h-[650px] w-full rounded-md border border-[#e0e6ed] bg-white dark:border-[#1b2e4b] dark:bg-[#0e1726]"
    />
  )
}
