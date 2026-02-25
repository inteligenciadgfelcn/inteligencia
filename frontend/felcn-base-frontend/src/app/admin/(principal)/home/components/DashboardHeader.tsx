import React from 'react'
import { Typography, Box, Avatar } from '@mui/material'
import { useAuth } from '@/context/AuthProvider'
import { titleCase } from '@/utils'

export default function DashboardHeader() {
  const { usuario } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <Box
      mb={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <Typography fontSize={22} fontWeight={700}>
          {getGreeting()},{' '}
          {titleCase(usuario?.persona.nombres?.toLowerCase() ?? '')}
        </Typography>

        <Typography color="text.secondary">
          Panel de administración
        </Typography>
      </Box>

      {/* Avatar derecha */}
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          width: 46,
          height: 46,
          fontWeight: 600,
        }}
      >
        {usuario?.persona?.nombres?.charAt(0)}
      </Avatar>
    </Box>
  )
}
