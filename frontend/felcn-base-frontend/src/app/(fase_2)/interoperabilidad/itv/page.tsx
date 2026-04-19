import { Metadata } from 'next'
import { siteName } from '@/utils'
import { ITVForm } from './ui/ITVForm'

export const metadata: Metadata = {
  title: `Interoperabilidad - ${siteName()}`,
  description: 'Interoperabilidad ITV',
}

export default function FileacionPage() {
  return (
    <>
      <div>
        <ITVForm />
      </div>
    </>
  )
}
