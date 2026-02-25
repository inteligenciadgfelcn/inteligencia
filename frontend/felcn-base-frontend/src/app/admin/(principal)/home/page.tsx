import { Metadata } from 'next'

import AdminDashboard from './components/AdminDashboard'
import { siteName } from '@/utils'

export const metadata: Metadata = {
  title: `Home - ${siteName()}`,
}

export default function AdminHomePage() {
  return <AdminDashboard />
}
