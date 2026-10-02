import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { DEPARTAMENTO_POR_CODIGO } from '../../registro_caso/mappers/registro-caso.mappers'
import type { CasoDetalle } from '../types/caso-detalle.types'
import { EtapasLgiApi } from '../../(parametricas)/api/etapas-lgi.api'
import type { EtapaLgi } from '../../(parametricas)/types/parametricas.types'
import { Badge } from '@/components/ui/Badge'

type Props = {
  caso: CasoDetalle
}

const campos: Array<{ label: string; key: keyof CasoDetalle }> = [
  { label: 'Nombre del Caso', key: 'nombreCaso' },
  { label: 'Regional', key: 'dptoavId' },
  { label: 'Nro Caso GIAEF', key: 'nroCaso' },
  { label: 'CUD', key: 'nroCasoFis' },
  { label: 'Fiscal Asignado', key: 'remiteFiscal' },
  { label: 'Fecha Inicio', key: 'fechaInicio' },
]

export function DatosCasoPanel({ caso }: Props) {
  const { data: etapas = [] } = useQuery<EtapaLgi[]>({
    queryKey: ['lgi-etapas'],
    queryFn: () => EtapasLgiApi.listarEtapas(),
    staleTime: 5 * 60 * 1000,
  })

  const etapaDescripcion = useMemo(() => {
    const id = caso.idEtapa
    if (id === null || id === undefined || id === '') return null
    const encontrada = etapas.find((e) => String(e.etId) === String(id))
    return encontrada?.descripcion ?? null
  }, [etapas, caso.etaInv])

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1b2e4b] dark:bg-[#0f172a]">
      <div className="border-b border-gray-200 bg-primary/5 px-5 py-4 dark:border-[#1b2e4b] dark:bg-primary/10">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Etapa de investigación
        </p>
        <p className="mt-1 text-lg font-bold text-primary dark:text-white">
          {etapaDescripcion || '-'} 
        </p>
       <Badge variant='success' rounded>{caso.diasOtorgados} dias</Badge> 
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-[#1b2e4b] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-3">
        {campos.map(({ label, key }) => (
          <div key={key} className="px-5 py-3.5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {label}
            </p>
            {key == 'dptoavId' ? (
              <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white-light">
                {DEPARTAMENTO_POR_CODIGO[caso['dptoavId']] ?? '-'}
              </p>
            ) : key == 'fechaInicio' ? (
              <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white-light">
                {caso[key]?.split('T')[0] ?? '-'}
              </p>
            ) : (
              <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white-light">
                {caso[key] ?? '-'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
