'use client'
import { ReactNode, Suspense } from 'react'
import Box from '@mui/material/Box'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'

export default function CuentaLayout({ children }: { children: ReactNode }) {
  return (
      <Box component="main" >
        <Suspense fallback={<FullScreenLoading mensaje={'Cargando...'} />}>
          {children}
        </Suspense>
    </Box>
  )
}
