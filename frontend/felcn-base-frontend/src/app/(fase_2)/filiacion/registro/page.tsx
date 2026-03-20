import { Metadata } from 'next'
import { siteName } from '@/utils'
import { FiliacionView } from './ui/FiliacionView'

export const metadata: Metadata = {
  title: `Fileacion - ${siteName()}`,
  description: 'Fileacion de Personas',
}

export default function FileacionPage() {
  return (
    <>
      <div>
        <FiliacionView />
      </div>
    </>
  )
}
