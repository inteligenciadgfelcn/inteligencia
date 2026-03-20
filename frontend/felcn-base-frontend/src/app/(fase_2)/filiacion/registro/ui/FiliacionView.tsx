'use client'

import { useState } from 'react'
import { FormFiliacion } from './FormFilacion'
import { TablePersonas } from './TablePersonas'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'

export const FiliacionView = () => {
  const [personaSelected, setPersonaSelected] = useState<
    FiliacionPersonaTable | undefined
  >()

  return (
    <>
      <TablePersonas onSelected={setPersonaSelected} />
      {personaSelected && <FormFiliacion persona={personaSelected} />}
    </>
  )
}
