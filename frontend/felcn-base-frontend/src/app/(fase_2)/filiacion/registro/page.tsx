import { Metadata } from 'next'
import { siteName } from '@/utils'
import { FormFiliacion } from './ui/FormFilacion'

export const metadata: Metadata = {
  title: `Fileacion - ${siteName()}`,
  description: 'Fileacion de Personas',
}

export default function FileacionPage() {
  return (
    <>
      <div>
        <FormFiliacion />
      </div>
    </>
  )
}
