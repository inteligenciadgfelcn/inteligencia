'use client'

import { useRouter } from 'next/navigation'
import IconClipboardText from '@/components/Icon/IconClipboardText'
import IconListCheck from '@/components/Icon/IconListCheck'

export default function LgiHubPage() {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Módulo LGI — Sistema GIAEF
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Seleccione la operación a realizar sobre los casos asignados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          onClick={() => router.push('/investigaciones/lgi/ingreso')}
          className="panel group flex flex-col gap-4 p-8 text-left transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <IconClipboardText className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white-light">
              Ingreso de Información del Caso
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Seleccione un caso asignado para ingresar o editar su información (LGI-MEN2).
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push('/investigaciones/lgi/operativo')}
          className="panel group flex flex-col gap-4 p-8 text-left transition-all hover:border-secondary/50 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
            <IconListCheck className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white-light">
              Operativos por Caso
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Seleccione un caso para explorar sus operativos vinculados (LGI-MEN3).
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
