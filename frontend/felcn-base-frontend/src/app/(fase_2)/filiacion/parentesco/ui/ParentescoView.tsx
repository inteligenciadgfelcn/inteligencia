'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import { FiliacionPersonaTable } from '../../registro/type/filiacion.persona.table'
import { TablePersonas } from '../../shared/TablePersonas'
import { FormParentesco } from './FormParentesco'
import { FormNombresSupuestos } from './FormNombresSupuestos'
import { DetenidoDetalle, getDetenidoById } from '../services/detenido.service'
import { log } from 'console'
import { de } from '@faker-js/faker/.'

interface DetenidoAliasRow {
  id: number
  alias: string
}

interface DetenidoDocumentoRow {
  id: number
  numero: string
  tipo: string
  expedido: string
}

interface DetenidoProfesionRow {
  id: string
  descripcion: string
}

interface DetenidoFenotipoRow {
  estatura: string
  peso: string
  senas: string
  nariz: string
  contextura: string
  piel: string
  cabello: string
  tipoCabello: string
  ojos: string
  tipoOjos: string
}

export const ParentescoView = () => {
  const [personaSelected, setPersonaSelected] = useState<
    FiliacionPersonaTable | undefined
  >()

  const [refreshKey] = useState(0)

  const { data: detenidoDetalle } = useQuery<DetenidoDetalle>({
    queryKey: ['filiacion', personaSelected?.id_detenido],
    queryFn: () => getDetenidoById(String(personaSelected?.id_detenido || '')),
    enabled: !!personaSelected?.id_detenido,
  })

  const aliasRows: DetenidoAliasRow[] =
    detenidoDetalle?.alias.map((alias, index) => ({
      id: index + 1,
      alias,
    })) ?? []

  const documentosRows: DetenidoDocumentoRow[] =
    detenidoDetalle?.documentos.map((documento, index) => ({
      id: index + 1,
      numero: documento.numero,
      tipo: documento.tipo,
      expedido: documento.expedido,
    })) ?? []

  const profesionesRows: DetenidoProfesionRow[] =
    detenidoDetalle?.profesiones ?? []

  const fenotipoRows: DetenidoFenotipoRow[] = detenidoDetalle?.fenotipo
    ? [detenidoDetalle.fenotipo]
    : []

  return (
    <div className="space-y-5">
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Parentesco
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      <TablePersonas
        onSelected={setPersonaSelected}
        refreshKey={refreshKey}
        statusFiliacion={1}
      />

      <FormParentesco idDetenido={personaSelected?.id_detenido} />
      <FormNombresSupuestos idDetenido={personaSelected?.id_detenido} />

      {detenidoDetalle && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="panel p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-primary">Documentos</h2>
            <VristoSimpleDataTable<DetenidoDocumentoRow>
              rows={documentosRows}
              columns={[
                { accessor: 'id', title: 'N°' },
                { accessor: 'numero', title: 'Número' },
                { accessor: 'tipo', title: 'Tipo' },
                { accessor: 'expedido', title: 'Expedido' },
              ]}
            />
          </div>

          <div className="panel p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-primary">Alias</h2>
            <VristoSimpleDataTable<DetenidoAliasRow>
              rows={aliasRows}
              columns={[
                { accessor: 'id', title: 'N°' },
                { accessor: 'alias', title: 'Alias' },
              ]}
            />
          </div>

          <div className="panel p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-primary">Profesiones</h2>
            <VristoSimpleDataTable<DetenidoProfesionRow>
              rows={profesionesRows}
              columns={[
                { accessor: 'id', title: 'ID' },
                { accessor: 'descripcion', title: 'Descripción' },
              ]}
            />
          </div>

          <div className="panel p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-primary">
              Datos fenotipo
            </h2>
            <VristoSimpleDataTable<DetenidoFenotipoRow>
              rows={fenotipoRows}
              columns={[
                { accessor: 'estatura', title: 'Estatura' },
                { accessor: 'peso', title: 'Peso' },
                { accessor: 'senas', title: 'Señas' },
                { accessor: 'nariz', title: 'Nariz' },
                { accessor: 'contextura', title: 'Contextura' },
                { accessor: 'piel', title: 'Piel' },
                { accessor: 'cabello', title: 'Cabello' },
                { accessor: 'tipoCabello', title: 'Tipo Cabello' },
                { accessor: 'ojos', title: 'Ojos' },
                { accessor: 'tipoOjos', title: 'Tipo Ojos' },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
