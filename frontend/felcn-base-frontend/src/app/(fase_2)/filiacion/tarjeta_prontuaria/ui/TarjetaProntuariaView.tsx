'use client'

import { useState } from 'react'
import { FiliacionPersonaTable } from '../../registro/type/filiacion.persona.table'
import { TablePersonas } from '../../shared/TablePersonas'
import { imprimir } from '@/utils/imprimir'

export const TarjetaProntuariaView = () => {
  const [personaSelected, setPersonaSelected] = useState<
    FiliacionPersonaTable | undefined
  >()

  const [refreshKey] = useState(0)

  return (
    <div className="space-y-5">
      <TablePersonas
        onSelected={(filiacionPersonaTable) => {
          imprimir('persona seleccionada', filiacionPersonaTable)
        }}
        refreshKey={refreshKey}
        statusFiliacion={1}
      />
    </div>
  )
}
