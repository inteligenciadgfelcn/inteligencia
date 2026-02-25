import React, { useMemo } from 'react'
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material'
import { Icono } from '@/components/Icono'

interface NavbarSearchProps {
  searchTerm: string
  searchResults: Array<{
    label: string
    url: string
    propiedades: {
      icono: string
      descripcion: string
    }
  }>
  handleInputChange: (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => void
  handleOptionSelect: (event: React.SyntheticEvent, value: any) => void
  open: boolean
  onOpen: () => void
  onClose: () => void
}

/* Detectar Sistema Operativo */
const getOS = () => {
  if (typeof window === 'undefined') return 'windows'
  const userAgent = window.navigator.userAgent.toLowerCase()
  if (/(macintosh|macos)/i.test(userAgent)) return 'macos'
  if (/(iphone|ipad|ipod)/i.test(userAgent)) return 'ios'
  if (/(win32|win64|windows)/i.test(userAgent)) return 'windows'
  if (/linux/.test(userAgent)) return 'linux'
  return 'windows'
}

/* Shortcut Display */
const ShortcutDisplay = () => {
  const os = useMemo(() => getOS(), [])

  const shortcut =
    os === 'macos' || os === 'ios'
      ? { symbol: '⌘', key: 'K' }
      : { symbol: 'Ctrl', key: 'K' }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Typography fontSize="0.75rem" color="text.secondary">
        {shortcut.symbol}
      </Typography>
      <Typography fontSize="0.75rem" color="text.secondary">
        {shortcut.key}
      </Typography>
    </Box>
  )
}

/* Input Style (Vristo)*/
const inputStyle = {
  backgroundColor: '#f9fafb',
  borderRadius: 2,

  '& fieldset': {
    borderColor: '#e5e7eb',
  },

  '&:hover fieldset': {
    borderColor: '#4361ee',
  },

  '&.Mui-focused fieldset': {
    borderColor: '#4361ee',
  },

  '& input': {
    color: '#111827',
  },

  '& input::placeholder': {
    color: '#9ca3af',
    opacity: 1,
    fontSize: '0.9rem',
  },

  /* Autofill Chrome */
  '& input:-webkit-autofill': {
    WebkitTextFillColor: '#111827',
    WebkitBoxShadow: '0 0 0 1000px #f9fafb inset',
    transition: 'background-color 9999s ease-in-out 0s',
  },
}

/* Navbar Search*/
export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  searchTerm,
  searchResults,
  handleInputChange,
  handleOptionSelect,
  open,
  onOpen,
  onClose,
}) => {
  const theme = useTheme()

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleInputChange(event as any, '', 'clear')
  }

  return (
    <Autocomplete
      freeSolo
      options={searchResults}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label || ''
      }
      onChange={handleOptionSelect}
      onInputChange={handleInputChange}
      inputValue={searchTerm}
      filterOptions={(options) => options}
      open={open && searchResults.length > 0}
      onOpen={onOpen}
      onClose={onClose}
      clearOnBlur={false}
      clearOnEscape={false}
      clearIcon={null}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Buscar contenido..."
          size="small"
          sx={{
            width: { xs: '100%', sm: 300, md: 400, lg: 450 },
            '& .MuiOutlinedInput-root': {
              ...inputStyle,
              paddingLeft: '10px',
              paddingRight: '40px',
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm ? (
                    <IconButton size="small" onClick={handleClear}>
                      <Icono fontSize="small">close</Icono>
                    </IconButton>
                  ) : (
                    <ShortcutDisplay />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.url}>
          <Box display="flex" alignItems="center" gap={1}>
            <Icono>{option.propiedades.icono}</Icono>
            <Box>
              <Typography fontWeight={500}>{option.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.propiedades.descripcion}
              </Typography>
            </Box>
          </Box>
        </li>
      )}
    />
  )
}
