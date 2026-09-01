import packageJson from '../../../package.json'
import { Constantes } from '@/config/Constantes'

const SUFIJO_POR_AMBIENTE: Record<string, string> = {
  development: '(dev)',
  staging: '(staging)',
}

const Footer = () => {
  const sufijoAmbiente = SUFIJO_POR_AMBIENTE[Constantes.appEnv] ?? ''

  return (
    <div className="p-6 pt-0 mt-auto text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
      © {new Date().getFullYear()} Fuerza Especial de Lucha Contra el Narcotráfico. Todos los derechos reservados
      <span className="ml-2 opacity-60 text-xs">
        · FELCN v{packageJson.version} {sufijoAmbiente}
      </span>
    </div>
  )
}

export default Footer
