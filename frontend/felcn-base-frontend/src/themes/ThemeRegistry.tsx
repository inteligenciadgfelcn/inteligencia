'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import {
  createTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider,
  useColorScheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme } from '@/themes/light-theme'
import { darkTheme } from '@/themes/dark-theme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <CssVarsProvider defaultMode="system" theme={createTheme()}>
        <ThemeComponent>{children}</ThemeComponent>
      </CssVarsProvider>
    </AppRouterCacheProvider>
  )
}

function ThemeComponent({ children }: { children: ReactNode }) {
  const { mode, setMode, systemMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (mode === 'system') {
        setMode('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode, setMode])

  // Sync with Tailwind dark mode
  useEffect(() => {
    const effectiveMode = mode === 'system' ? systemMode : mode;
    if (effectiveMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode, systemMode]);

  const theme = React.useMemo(() => {
    const effectiveMode = mode === 'system' ? systemMode : mode
    return effectiveMode === 'light' ? lightTheme : darkTheme
  }, [mode, systemMode])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
