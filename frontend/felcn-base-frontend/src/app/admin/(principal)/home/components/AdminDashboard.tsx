'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import DashboardHeader from './DashboardHeader'
import DashboardSummary from './DashboardSummary'
import UserRoleDistribution from './graphs/UserRoleDistribution'
import AccessPoliciesByRole from './graphs/AccessPoliciesByRole'
import UserGrowth from './graphs/UserGrowth'
import ModulesByRole from './graphs/ModulesByRole'
import RecentActivities from './graphs/RecentActivities'
import { imprimir } from '@/utils/imprimir'

export default function AdminDashboard() {
  const { usuario, permisoAccion } = useAuth()

  const [tab, setTab] = useState<'charts' | 'activity'>('charts')

  const [permissions, setPermissions] = useState({
    getUsers: false,
    getPolicies: false,
    getModules: false,
  })

  /* ---------------- PERMISOS ---------------- */

  useEffect(() => {
    const fetchPermissions = async () => {
      setPermissions({
        getUsers: await permisoAccion('/admin/usuarios', 'read'),
        getPolicies: await permisoAccion('/admin/politicas', 'read'),
        getModules: await permisoAccion('/admin/modulos', 'read'),
      })
    }

    fetchPermissions().catch(imprimir)
  }, [usuario, permisoAccion])

  const hasAnyPermission = Object.values(permissions).some(Boolean)

  /* ---------------- UI ---------------- */

  return (
    <div className="container mx-auto px-4 mt-6">

      <DashboardHeader />
      <DashboardSummary />

      {/* -------- TABS -------- */}
      <div className="mb-5 border-b border-gray-200 flex gap-4">

        <button
          onClick={() => setTab('charts')}
          className={`pb-2 font-semibold transition
            ${tab === 'charts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-primary'
            }`}
        >
          Gráficos
        </button>

        <button
          onClick={() => setTab('activity')}
          className={`pb-2 font-semibold transition
            ${tab === 'activity'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-primary'
            }`}
        >
          Actividades Recientes
        </button>

      </div>

      {/* -------- CONTENIDO -------- */}

      {tab === 'charts' && (
        <>
          {hasAnyPermission ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {permissions.getUsers && <UserRoleDistribution />}

              {permissions.getPolicies && <AccessPoliciesByRole />}

              {permissions.getUsers && <UserGrowth />}

              {permissions.getModules && <ModulesByRole />}

            </div>
          ) : (
            <div className="panel border-l-4 border-danger bg-danger-light text-danger">
              <h5 className="font-semibold mb-1">Sin permisos</h5>
              <p>
                No tienes permisos para ver los gráficos de estadísticas.
                Contacta con el administrador.
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'activity' && <RecentActivities />}

    </div>
  )
}
