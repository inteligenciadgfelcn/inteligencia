import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { DEPARTAMENTO_POR_CODIGO } from '../../registro_caso/mappers/registro-caso.mappers'
import type { CasoDetalle } from '../types/caso-detalle.types'
import { EtapasLgiApi } from '../../(parametricas)/api/etapas-lgi.api'
import type { EtapaLgi } from '../../(parametricas)/types/parametricas.types'
import { Badge } from '@/components/ui/Badge'
import { calcularTiempoTranscurridos } from '../../casos_asignados/mappers/listado-casos.mappers'
import dayjs from 'dayjs'

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
  }, [etapas, caso.idEtapa])

  const diasOtorgados = () => {
    const tiempo = calcularTiempoTranscurridos(caso.fechaInicio)
    if (tiempo === null) return '-'

    // Calculamos el total de días aproximado o usamos el campo de días para evaluar la variante del badge
    const totalDiasAprox = (tiempo.anos * 365) + (tiempo.meses * 30) + tiempo.dias; // O bien dayjs().diff(dayjs(row.fechahoraing), 'day')

    // Si prefieres evaluar el color estrictamente por los días totales de diferencia:
    const diasTotales = dayjs().startOf('day').diff(dayjs(caso.fechaInicio).startOf('day'), 'day')
    const variant = diasTotales <= 5 ? 'success' : diasTotales <= 10 ? 'warning' : 'danger'

    // Construimos el texto dinámicamente solo mostrando lo que sea mayor a 0 (opcional, para que se vea más limpio)
    const partes: string[] = []
    partes.push(`${tiempo.anos} ${tiempo.anos === 1 ? 'año' : 'años'}`)
    partes.push(`${tiempo.meses} ${tiempo.meses === 1 ? 'mes' : 'meses'}`)
    partes.push(`${tiempo.dias} ${tiempo.dias === 1 ? 'día' : 'días'}`)

    const textoFormateado = partes.join(', ')

    return textoFormateado;
  }

  const diasRestantes = () => {
    const diasPasados = dayjs().startOf('day').diff(
      dayjs(caso.fechaEtapaProcesal).startOf('day'),
      'day',
    );

    return caso.diasOtorgados ?? 0 - diasPasados;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1b2e4b] dark:bg-[#0f172a]">
      <div className="border-b border-gray-200 bg-primary/5 px-5 py-4 dark:border-[#1b2e4b] dark:bg-primary/10">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Etapa de investigación
        </p>
        <p className="mt-1 text-lg font-bold text-primary dark:text-white">
          {etapaDescripcion || '-'}
        </p>
        <p className="font-bold">
          {caso.diasOtorgados || '-'} dias otorgados ({caso.fechaEtapaProcesal?.split('T')[0] || '-'})
        </p>
        <div className="mt-2">
          <Badge variant='success' rounded>{diasRestantes()} dias restantes</Badge>
        </div>
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
                {caso[key]?.split('T')[0] ?? '-'} <Badge variant='success' className='ms-2' rounded>{diasOtorgados()}</Badge>
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
