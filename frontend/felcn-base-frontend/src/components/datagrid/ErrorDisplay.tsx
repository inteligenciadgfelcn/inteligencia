import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

interface ErrorDisplayProps {
  message: string
  onRetry: () => void
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6" gutterBottom align="center">
        Ocurrió un error al cargar los datos
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {message}
      </Typography>
      <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry}>
        Reintentar
      </Button>
    </Box>
  )
}
