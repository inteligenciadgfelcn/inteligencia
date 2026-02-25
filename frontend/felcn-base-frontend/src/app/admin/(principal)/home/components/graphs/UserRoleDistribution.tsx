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

export default function UserRoleDistribution() {
  const { usuario } = useAuth()
  const { sesionPeticion } = useSession()

  /* ---------------- DATA ---------------- */

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userRoles'],
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

  /* ---------------- PROCESS ---------------- */

  const { labels, series } = useMemo(() => {
    if (!userData?.filas?.length) {
      return { labels: [], series: [] }
    }

    const roleCounts: Record<string, number> = {}

    userData.filas.forEach((user) => {
      user.usuarioRol?.forEach((r) => {
        if (r.rol?.rol) {
          roleCounts[r.rol.rol] = (roleCounts[r.rol.rol] || 0) + 1
        }
      })
    })

    return {
      labels: Object.keys(roleCounts),
      series: Object.values(roleCounts),
    }
  }, [userData])

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return <div className="panel">Cargando...</div>
  }

  if (error) {
    imprimir(error)
    return <div className="panel">Error al cargar datos</div>
  }

  if (!series.length) {
    return <div className="panel">No existen datos</div>
  }

  /* ---------------- CHART OPTIONS ---------------- */

  const options: any = {
    chart: {
      type: 'donut',
      fontFamily: 'Nunito, sans-serif',
    },
    labels,
    legend: {
      position: 'bottom',
      fontSize: '14px',
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    colors: ['#4361ee', '#00ab55', '#e7515a', '#e2a03f', '#805dca'],
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="panel">
      <div className="mb-5">
        <h5 className="text-lg font-semibold">
          Distribución de Roles de Usuario
        </h5>
      </div>

      <ReactApexChart
        series={series}
        options={options}
        type="donut"
        height={320}
      />
    </div>
  )
}
