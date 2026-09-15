import { Metadata } from 'next'
import { siteName } from '@/utils'
import { PersonasReportePage } from './ui/PersonasReportePage'

export const metadata: Metadata = {
  title: `Variables cruzadas - ${siteName()}`,
  description: 'Búsqueda de personas mediante variables cruzadas.',
}

export default function Page() {
  return <PersonasReportePage />
}