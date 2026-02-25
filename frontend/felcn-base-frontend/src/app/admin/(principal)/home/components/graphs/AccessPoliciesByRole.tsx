'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthProvider'
import { useSession } from '@/hooks/useSession'
import { PoliticasResponse } from '@/app/admin/(principal)/home/types'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function AccessPoliciesByRole() {
  const { usuario } = useAuth()
  const { sesionPeticion } = useSession()

  /* ---------------- GET DATA ---------------- */

  const { data: politicasData, isLoading, error } = useQuery({
    queryKey: ['politicas'],
    queryFn: async () => {
      const response = await sesionPeticion<PoliticasResponse>({
        url: `${Constantes.baseUrl}/autorizacion/politicas`,
        method: 'get',
        params: { pagina: 1, limite: 50 },
      })
      return response.datos
    },
    enabled: !!usuario,
  })

  /* ---------------- PROCESS DATA ---------------- */

  const { categories, series } = useMemo(() => {
    if (!politicasData?.filas?.length)
      return { categories: [], series: [] }

    const roleMap: Record<string, Record<string, number>> = {}
    const actions = new Set<string>()

    politicasData.filas.forEach((p) => {
      if (p.app === 'frontend') {
        const acciones = p.accion.split('|')

        if (!roleMap[p.sujeto]) roleMap[p.sujeto] = {}

        acciones.forEach((accion) => {
          actions.add(accion)
          roleMap[p.sujeto][accion] =
            (roleMap[p.sujeto][accion] || 0) + 1
        })
      }
    })

    const categories = Object.keys(roleMap)

    const series = Array.from(actions).map((accion) => ({
      name: accion.toUpperCase(),
      data: categories.map((rol) => roleMap[rol]?.[accion] || 0),
    }))

    return { categories, series }
  }, [politicasData])

  /* ---------------- STATES ---------------- */

  if (isLoading) return <div className="panel">Cargando...</div>

  if (error) {
    imprimir(error)
    return <div className="panel">Error al cargar datos</div>
  }

  if (!series.length) {
    return <div className="panel">No hay datos disponibles</div>
  }

  /* ---------------- VRISTO OPTIONS ---------------- */

  const options: any = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 320,
      fontFamily: 'Nunito, sans-serif',
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6,
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 1,
      colors: ['transparent'],
    },

    colors: ['#4361ee', '#00ab55', '#e7515a', '#e2a03f', '#805dca'],

    xaxis: {
      categories,
    },

    legend: {
      position: 'bottom',
      fontSize: '13px',
    },

    grid: {
      borderColor: '#e0e6ed',
    },

    tooltip: {
      shared: true,
      intersect: false,
    },
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="panel h-full">
      <div className="mb-5">
        <h5 className="text-lg font-semibold">
          Políticas de Acceso por Rol
        </h5>
      </div>

      <ReactApexChart
        series={series}
        options={options}
        type="bar"
        height={320}
        width="100%"
      />
    </div>
  )
}
