import type { CasoDetalle } from '../types/caso-detalle.types'

type Props = {
  caso: CasoDetalle
}

const campos: Array<{ label: string; key: keyof CasoDetalle }> = [
  { label: 'Nombre del Caso', key: 'nombreCaso' },
  { label: 'Regional', key: 'dptoavId' },
  { label: 'Nro Caso GIAEF', key: 'nroCasoGlaef' },
  { label: 'CUD', key: 'cudIfp' },
  { label: 'Fiscal Asignado', key: 'remiteFiscal' },
  { label: 'Fecha Inicio', key: 'fechaInicio' },
]

export function DatosCasoPanel({ caso }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1b2e4b] dark:bg-[#0f172a]">
      <div className="border-b border-gray-200 px-5 py-3 dark:border-[#1b2e4b]">
        <h3 className="text-sm font-semibold text-dark dark:text-white-light">
          Datos del Caso
        </h3>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-[#1b2e4b] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-3">
        {campos.map(({ label, key }) => (
          <div key={key} className="px-5 py-3.5">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white-light">
              {caso[key] ?? '-'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
