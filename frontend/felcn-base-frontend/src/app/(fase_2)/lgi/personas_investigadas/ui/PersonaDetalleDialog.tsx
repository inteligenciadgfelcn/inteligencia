'use client'

import { CustomDialog } from '@/components/modales/CustomDialog'
import { Button } from '@/components/ui/Button'
import { formatNombreCompleto } from '../../registro_caso/mappers/registro-caso.mappers'
import type {
  EstadoCivilLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'
import type { PersonaImplicadaRow } from '../../registro_caso/types/registro-caso.types'
import {
  resolverEstadoCivil,
  resolverPais,
  resolverProfesion,
  resolverTipoDocumento,
} from '../mappers/personas-investigadas.mappers'

interface PersonaDetalleDialogProps {
  open: boolean
  persona: PersonaImplicadaRow | null
  paises: PaisLgi[]
  estadosCiviles: EstadoCivilLgi[]
  profesiones: ProfesionLgi[]
  tiposDocumento: TipoDocumentoLgi[]
  onClose: () => void
}

function Fila({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
        {value ?? '-'}
      </p>
    </div>
  )
}

export function PersonaDetalleDialog({
  open,
  persona,
  paises,
  estadosCiviles,
  profesiones,
  tiposDocumento,
  onClose,
}: PersonaDetalleDialogProps) {
  return (
    <CustomDialog
      isOpen={open}
      handleClose={onClose}
      title={
        persona ? `Detalle de ${formatNombreCompleto(persona)}` : 'Detalle'
      }
      maxWidth="md"
    >
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Fila label="Nombres" value={persona?.nombres} />
          <Fila label="Apellido paterno" value={persona?.paterno} />
          <Fila label="Apellido materno" value={persona?.materno} />
          <Fila label="Apellido esposo" value={persona?.esposo} />
          <Fila
            label="Nacionalidad"
            value={resolverPais(paises, persona?.paisId)}
          />
          <Fila
            label="Estado civil"
            value={resolverEstadoCivil(estadosCiviles, persona?.estadoCivilId)}
          />
          <Fila
            label="Profesión"
            value={resolverProfesion(profesiones, persona?.profesionId)}
          />
          <Fila
            label="Tipo de documento"
            value={resolverTipoDocumento(tiposDocumento, persona?.tipoDocumentoId)}
          />
          <Fila label="Nro de documento" value={persona?.numeroDocumento} />
          <Fila label="Relación" value={persona?.relacion} />
          <Fila label="Observaciones" value={persona?.observaciones} />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button type="button" variant="outline-secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}
