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

export default function ModulesByRole() {
  const { usuario } = useAuth()
  const { sesionPeticion } = useSession()

  /* ---------------- GET DATA ---------------- */

  const { data, isLoading, error } = useQuery({
    queryKey: ['politicas-modulos'],
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
    if (!data?.filas?.length) return { categories: [], series: [] }

    const roleMap: Record<string, Record<string, number>> = {}
    const modulesSet = new Set<string>()

    data.filas.forEach((p) => {
      if (p.app === 'frontend') {
        const role = p.sujeto
        const moduleName = p.objeto.split('/')[2]

        if (!roleMap[role]) roleMap[role] = {}
        roleMap[role][moduleName] =
          (roleMap[role][moduleName] || 0) + 1

        modulesSet.add(moduleName)
      }
    })

    const categories = Object.keys(roleMap)

    const series = Array.from(modulesSet).map((module) => ({
      name: module.toUpperCase(),
      data: categories.map((rol) => roleMap[rol]?.[module] || 0),
    }))

    return { categories, series }
  }, [data])

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
        <h5 className="text-lg font-semibold">Módulos por Rol</h5>
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
