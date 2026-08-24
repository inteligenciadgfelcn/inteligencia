'use client'

import { useQuery } from '@tanstack/react-query'

import { CustomDialog } from '@/components/modales/CustomDialog'
import { Button } from '@/components/ui/Button'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'

import { RegistroCasoApi } from '../../registro_caso/api/registro-caso.api'
import { formatNombreCompleto } from '../../registro_caso/mappers/registro-caso.mappers'
import type { PersonaImplicadaRow } from '../../registro_caso/types/registro-caso.types'
import { PersonasInvestigadasApi } from '../api/personas-investigadas.api'
import { obtenerUltimaSituacionJuridica } from '../mappers/personas-investigadas.mappers'
import type { SituacionJuridicaRow } from '../types/personas-investigadas.types'

interface SituacionesJuridicasDialogProps {
  open: boolean
  persona: PersonaImplicadaRow | null
  onClose: () => void
}

function formatFecha(fecha?: string): string {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-BO')
}

export function SituacionesJuridicasDialog({
  open,
  persona,
  onClose,
}: SituacionesJuridicasDialogProps) {
  const { data: situaciones = [], isLoading } = useQuery<SituacionJuridicaRow[]>({
    queryKey: [
      'lgi-personas-investigadas',
      'situaciones',
      persona?.deId,
    ],
    enabled: open && Boolean(persona?.deId),
    queryFn: () =>
      PersonasInvestigadasApi.listarSituacionesJuridicasPersona(
        persona!.deId
      ),
  })

  const { data: situacionesLegales = [] } = useQuery({
    queryKey: ['lgi-personas-investigadas', 'situaciones-legales'],
    queryFn: () => RegistroCasoApi.listarSituacionesLegales(),
  })

  const resolverSituacionLegal = (slId: number): string =>
    situacionesLegales.find((s) => String(s.slId) === String(slId))
      ?.descripcion ?? String(slId)

  const ultima = obtenerUltimaSituacionJuridica(situaciones)

  const columns: Column<SituacionJuridicaRow>[] = [
    {
      accessor: 'descripcion',
      title: 'Situación legal',
      render: (row) => resolverSituacionLegal(row.slId),
    },
    {
      accessor: 'fecha',
      title: 'Fecha',
      render: (row) => formatFecha(row.fecha),
    },
  ]

  return (
    <CustomDialog
      isOpen={open}
      handleClose={onClose}
      title={
        persona
          ? `Situaciones jurídicas de ${formatNombreCompleto(persona)}`
          : 'Situaciones jurídicas'
      }
      maxWidth="md"
    >
      <div className="space-y-4 p-5">
        {ultima && (
          <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Situación jurídica actual
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {resolverSituacionLegal(ultima.slId)} · {formatFecha(ultima.fecha)}
            </p>
          </div>
        )}

        <VristoDataTable<SituacionJuridicaRow>
          title="Historial"
          rows={situaciones}
          total={situaciones.length}
          page={1}
          limit={10}
          onPageChange={() => undefined}
          onLimitChange={() => undefined}
          columns={columns}
          loading={isLoading}
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button type="button" variant="outline-secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}
