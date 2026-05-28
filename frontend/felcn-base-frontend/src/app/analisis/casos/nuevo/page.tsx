'use client'
import { FormNuevoCaso } from '../ui/FormNuevoCaso'

export default function NuevoCasoPage() {
  return (
    <div className="panel">
      <h5 className="mb-4 text-lg font-semibold dark:text-white-light">Nuevo Caso de Investigación</h5>
      <FormNuevoCaso />
    </div>
  )
}
