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
      <TablePersonas
        onSelected={setPersonaSelected}
        refreshKey={refreshKey}
        statusFiliacion={1}
      />

      <FormParentesco />
      <FormNombresSupuestos />

      {detenidoDetalle && (
        <div className="grid grid-cols-1 gap-5">
          <div className="panel p-4">
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

          <div className="panel p-4">
            <h2 className="text-lg font-semibold text-primary">Alias</h2>
            <VristoSimpleDataTable<DetenidoAliasRow>
              rows={aliasRows}
              columns={[
                { accessor: 'id', title: 'N°' },
                { accessor: 'alias', title: 'Alias' },
              ]}
            />
          </div>

          <div className="panel p-4">
            <h2 className="text-lg font-semibold text-primary">Profesiones</h2>
            <VristoSimpleDataTable<DetenidoProfesionRow>
              rows={profesionesRows}
              columns={[
                { accessor: 'id', title: 'ID' },
                { accessor: 'descripcion', title: 'Descripción' },
              ]}
            />
          </div>

          <div className="panel p-4">
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
