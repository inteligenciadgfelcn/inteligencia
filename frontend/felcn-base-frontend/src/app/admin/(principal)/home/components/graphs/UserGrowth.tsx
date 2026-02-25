'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthProvider'
import { useSession } from '@/hooks/useSession'
import { UsuariosResponse } from '@/app/admin/(principal)/home/types'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

export default function UserGrowth() {
  const { usuario } = useAuth()
  const { sesionPeticion } = useSession()

  /* ---------------- GET DATA ---------------- */

  const { data, isLoading, error } = useQuery({
    queryKey: ['usuarios-growth'],
    queryFn: async () => {
      const response = await sesionPeticion<UsuariosResponse>({
        url: `${Constantes.baseUrl}/usuarios`,
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

    const sorted = data.filas
      .filter((u) => u.fechaCreacion)
      .sort(
        (a, b) =>
          new Date(a.fechaCreacion).getTime() -
          new Date(b.fechaCreacion).getTime()
      )

    let count = 0
    const map: Record<string, number> = {}

    sorted.forEach((u) => {
      const date = new Date(u.fechaCreacion)
        .toISOString()
        .split('T')[0]
      count++
      map[date] = count
    })

    return {
      categories: Object.keys(map),
      series: [
        {
          name: 'Usuarios',
          data: Object.values(map),
        },
      ],
    }
  }, [data])

  /* ---------------- STATES ---------------- */

  if (isLoading) return <div className="panel">Cargando...</div>

  if (error) {
    imprimir(error)
    return <div className="panel">Error al cargar datos</div>
  }

  if (!series.length)
    return <div className="panel">No hay datos disponibles</div>

  /* ---------------- VRISTO OPTIONS ---------------- */

  const options: any = {
    chart: {
      type: 'line',
      height: 320,
      fontFamily: 'Nunito, sans-serif',
      toolbar: { show: false },
    },

    stroke: {
      curve: 'smooth',
      width: 3,
    },

    colors: ['#00ab55'],

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories,
    },

    grid: {
      borderColor: '#e0e6ed',
    },

    tooltip: {
      theme: 'light',
    },
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="panel h-full">
      <div className="mb-5">
        <h5 className="text-lg font-semibold">Crecimiento de Usuarios</h5>
      </div>

      <ReactApexChart
        series={series}
        options={options}
        type="line"
        height={320}
        width="100%"
      />
    </div>
  )
}
