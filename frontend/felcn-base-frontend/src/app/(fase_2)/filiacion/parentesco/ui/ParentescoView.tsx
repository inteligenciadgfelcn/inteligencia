'use client'

import { useState } from 'react'
import { FiliacionPersonaTable } from '../../registro/type/filiacion.persona.table'
import { TablePersonas } from '../../shared/TablePersonas'
import { FormParentesco } from './FormParentesco'

export const ParentescoView = () => {
  const [personaSelected, setPersonaSelected] = useState<
    FiliacionPersonaTable | undefined
  >()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <TablePersonas
        onSelected={setPersonaSelected}
        refreshKey={refreshKey}
        statusFiliacion={1}
      />
      <FormParentesco />
    </>
  )
}
