'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LgiService } from '@/services/lgi/LgiService'
import IconArrowLeft from '@/components/Icon/IconArrowLeft'
import dayjs from 'dayjs'

interface PageProps {
  params: Promise<{ casosId: string }>
}

export default function LgiIng1Page({ params }: PageProps) {
  const { casosId } = use(params)
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['lgi-caso-ingreso', casosId],
    queryFn: () => LgiService.buscarMisCasos({ pagina: 1, limite: 1 }),
    enabled: !!casosId,
    select: (res) => res.datos?.filas?.find((f) => String(f.casosId) === casosId) ?? null,
  })

  return (
    <div className="space-y-4">
      <div className="panel flex items-center gap-4 px-5 py-4">
        <button
          onClick={() => router.push('/investigaciones/lgi/ingreso')}
          className="text-primary transition-colors hover:text-primary/70"
          title="Volver"
        >
          <IconArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Ingreso de Información del Caso — LGI
          </h2>
          <p className="text-sm text-gray-500">ID del caso: {casosId}</p>
        </div>
      </div>

      {isLoading && (
        <div className="panel p-8 text-center text-gray-500">Cargando datos del caso...</div>
      )}

      {!isLoading && data && (
        <div className="panel p-6 space-y-6">
          {/* Datos de identificación del caso (lectura) */}
          <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <h4 className="mb-4 text-sm font-semibold text-primary">
              Identificación del Caso
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. Caso FELCN
                </label>
                <Input
                  value={data.nroCaso || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. Caso GIAEF
                </label>
                <Input
                  value={data.nroCasoGiaef || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. Caso Fiscalía
                </label>
                <Input
                  value={data.nroCasoFis || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nombre del Caso
                </label>
                <Input
                  value={data.nombreCaso || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Regional
                </label>
                <Input
                  value={data.distrital || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. Pérdida de Dominio
                </label>
                <Input
                  value={data.nroCasoPerDom || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  IANUS
                </label>
                <Input
                  value={data.ianus || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Fiscal que Remite
                </label>
                <Input
                  value={data.remiteFiscal || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Fecha Remisión
                </label>
                <Input
                  value={
                    data.remiteFecha ? dayjs(data.remiteFecha).format('DD/MM/YYYY') : ''
                  }
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Conforme A
                </label>
                <Input
                  value={data.conformeA || ''}
                  disabled
                  className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
                />
              </div>
            </div>
          </div>

          {/* Sección editable — LGI-ING1 — pendiente de implementación */}
          <div className="rounded-md border border-dashed border-warning/50 bg-warning/5 p-6 text-center">
            <p className="font-semibold text-warning">
              Formulario de ingreso (LGI-ING1) — pendiente de implementación
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Aquí se registrarán los datos de investigación del caso seleccionado.
            </p>
          </div>

          <div className="flex justify-start">
            <Button
              variant="outline-danger"
              onClick={() => router.push('/investigaciones/lgi/ingreso')}
            >
              Volver
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
