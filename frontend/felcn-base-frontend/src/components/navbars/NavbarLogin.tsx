'use client'
import { AppBar, Toolbar } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import ThemeSwitcherButton from '../botones/ThemeSwitcherButton'

export const NavbarLogin = () => {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <ThemeSwitcherButton />
        </Toolbar>
      </AppBar>
    </>
  )
}
