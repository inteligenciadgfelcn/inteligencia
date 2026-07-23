import packageJson from '../../../package.json'
import { Constantes } from '@/config/Constantes'

const Footer = () => {
  return (
    <div className="p-6 pt-0 mt-auto text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
      © {new Date().getFullYear()}. Vristo All rights reserved.
      <span className="ml-2 opacity-60 text-xs">
        {Constantes.siteName || 'FELCN'} · v{packageJson.version}
      </span>
    </div>
  )
}

export default Footer
