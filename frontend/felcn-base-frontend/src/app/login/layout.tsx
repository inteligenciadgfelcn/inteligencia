'use client'
import React, { ReactNode, Suspense } from 'react'
import Box from '@mui/material/Box'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { siteName } from '@/utils'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <title>{`${siteName()}`}</title>
        <Box component="main">
          <Suspense fallback={<FullScreenLoading mensaje={'Cargando...'} />}>
            {children}
          </Suspense>
        </Box>
    </>
  )
}
