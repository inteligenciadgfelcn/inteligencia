import { Metadata } from 'next'
import { siteName } from '@/utils'
import { FormFileacion } from './ui/FormFileacion'

export const metadata: Metadata = {
  title: `Fileacion - ${siteName()}`,
  description: 'Fileacion de Personas',
}

export default function FileacionPage() {
  return (
    <>
      <div>
        <div className="panel flex items-center p-3 text-primary mb-5">
          <span className="text-lg font-semibold">Fileacion de persona</span>
        </div>
        <div className="panel p-1 mb-5 w-full">
          <FormFileacion />
        </div>
      </div>
    </>
  )
}
