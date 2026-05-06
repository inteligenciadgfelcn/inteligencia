import { ListadoInvestigacionParalela } from '../ui/ListadoInvestigacionParalela'

export default function ListadoInvestigacionesParalelasPage() {
  return (
    <div className="space-y-6">
      <div className="panel flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Listado de Investigaciones Paralelas
        </h2>
      </div>

      <div className="panel p-6">
        <ListadoInvestigacionParalela />
      </div>
    </div>
  )
}
