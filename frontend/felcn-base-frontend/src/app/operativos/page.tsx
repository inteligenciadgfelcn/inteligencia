import { FormularioOperativo } from '@/components/organismos/operativo/FormularioOperativo'

const OperativoPage = () => {
  return (
    <div>
      <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
        <div className="ltr:mr-3 rtl:ml-3">
          <span className="icon-bell" />
        </div>
        <span className="text-md font-bold">Formulario Operativo</span>
      </div>
      <div className="mt-5">
        <FormularioOperativo />
      </div>
    </div>
  )
}

export default OperativoPage
