'use client'

import { InvestigadoresDataTable } from './InvestigadoresDataTableApd'

type Props = {
  casoId?: number
}

export function InvestigadoresTab({ casoId }: Props) {
  if (!casoId) return null

  return <InvestigadoresDataTable casoId={casoId} />
}