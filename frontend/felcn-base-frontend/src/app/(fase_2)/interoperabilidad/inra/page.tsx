import { Metadata } from 'next'
import { siteName } from '@/utils'
import { INRAForm } from './ui/INRAForm'

export const metadata: Metadata = {
  title: `Interoperabilidad - ${siteName()}`,
  description: 'Interoperabilidad INRA',
}

export default function InraPage() {
  return (
    <div>
      <INRAForm />
    </div>
  )
}
