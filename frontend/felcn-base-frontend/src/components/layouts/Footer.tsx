import packageJson from '../../../package.json'
import { Constantes } from '@/config/Constantes'

const SUFIJO_POR_AMBIENTE: Record<string, string> = {
  development: '(dev)',
  staging: '(staging)',
}

const Footer = () => {
  const sufijoAmbiente = SUFIJO_POR_AMBIENTE[Constantes.appEnv] ?? ''
  // Tag real de la imagen desplegada (horneado en el build de Docker, ver
  // dockerfile y build-and-push.sh) — si no viene seteado (build local sin
  // pasar por el registry, ej. `npm run dev`), cae al version de
  // package.json como antes.
  const version = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version

  return (
    <div className="p-6 pt-0 mt-auto text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
      © {new Date().getFullYear()} Fuerza Especial de Lucha Contra el Narcotráfico. Todos los derechos reservados
      <span className="ml-2 opacity-60 text-xs">
        · FELCN v{version} {sufijoAmbiente}
      </span>
    </div>
  )
}

export default Footer
