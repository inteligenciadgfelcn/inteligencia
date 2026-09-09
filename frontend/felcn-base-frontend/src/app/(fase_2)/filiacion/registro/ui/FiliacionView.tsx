'use client'

import { useState } from 'react'
import { FormFiliacion } from './FormFilacion'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'
import { FiliacionPersonas } from '../../shared/FiliacionPersonas'

export const FiliacionView = () => {
  const [personaSelected, setPersonaSelected] = useState<
    FiliacionPersonaTable | undefined
  >()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <FiliacionPersonas
        onSelected={setPersonaSelected}
        refreshKey={refreshKey}
        statusFiliacion={0}
      />
      {personaSelected && (
        <FormFiliacion
          persona={personaSelected}
          onSuccess={() => {
            setPersonaSelected(undefined)
            setRefreshKey((prev) => prev + 1)
          }}
        />
      )}
    </>
  )
}
