// components/FiltroLibro.tsx
import { Box, InputLabel, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { FiltrosLibroProps } from '../types/datatable'

export const FiltroLibro: React.FC<FiltrosLibroProps> = ({
  palabraClave,
  categorias,
  onFiltrosChange,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InputLabel sx={{ mb: 1, color: 'text.primary' }}>
            Buscar por nombre
          </InputLabel>
          <TextField
            fullWidth
            size="small"
            value={palabraClave}
            onChange={(e) =>
              onFiltrosChange({
                onFiltrosChange(): void {},
                palabraClave: e.target.value,
                categorias,
              })
            }
          />
        </Grid>
      </Grid>
    </Box>
  )
}
