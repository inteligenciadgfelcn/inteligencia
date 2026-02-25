'use client'

import IconFile from '@/components/Icon/IconFile'
import IconPrinter from '@/components/Icon/IconPrinter'
import IconPlus from '@/components/Icon/IconPlus'
import IconRefresh from '@/components/Icon/IconRefresh'

interface Props {
  search: string
  onSearch: (v: string) => void
  onCSV?: () => void
  onExcel?: () => void
  onPrint?: () => void
  onAdd?: () => void
  onRefresh?: () => void
}

export const DataTableToolbar = ({
  search,
  onSearch,
  onCSV,
  onExcel,
  onPrint,
  onAdd,
  onRefresh,
}: Props) => {

  return (
    <div className="mb-4.5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div className="flex flex-wrap gap-2">

        {onCSV && (
          <button className="btn btn-primary btn-sm" onClick={onCSV}>
            <IconFile className="w-4 h-4 mr-2" />
            CSV
          </button>
        )}

        {onExcel && (
          <button className="btn btn-primary btn-sm" onClick={onExcel}>
            <IconFile className="w-4 h-4 mr-2" />
            EXCEL
          </button>
        )}

        {onPrint && (
          <button className="btn btn-primary btn-sm" onClick={onPrint}>
            <IconPrinter className="w-4 h-4 mr-2" />
            PRINT
          </button>
        )}

        {onAdd && (
          <button className="btn btn-success btn-sm" onClick={onAdd}>
            <IconPlus className="w-4 h-4 mr-2" />
            Agregar
          </button>
        )}

        {onRefresh && (
          <button className="btn btn-outline-primary btn-sm" onClick={onRefresh}>
            <IconRefresh className="w-4 h-4 mr-2" />
            Actualizar
          </button>
        )}

      </div>

      <input
        type="text"
        className="form-input w-auto"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

    </div>
  )
}
