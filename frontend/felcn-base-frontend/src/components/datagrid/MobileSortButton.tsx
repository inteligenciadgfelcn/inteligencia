import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'

interface MobileSortButtonProps {
  columns: GridColDef[]
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
}

export const MobileSortButton: React.FC<MobileSortButtonProps> = ({
  columns,
  sortModel,
  onSortModelChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSortChange = (field: string) => {
    const currentSort = sortModel[0]
    let newSort: GridSortModel
    if (currentSort && currentSort.field === field) {
      if (currentSort.sort === 'asc') {
        newSort = [{ field, sort: 'desc' }]
      } else if (currentSort.sort === 'desc') {
        newSort = []
      } else {
        newSort = [{ field, sort: 'asc' }]
      }
    } else {
      newSort = [{ field, sort: 'asc' }]
    }
    onSortModelChange(newSort)
    handleClose()
  }

  const getSortIcon = (field: string) => {
    const sort = sortModel.find((s) => s.field === field)?.sort
    if (sort === 'asc') return <ArrowUpwardIcon />
    if (sort === 'desc') return <ArrowDownwardIcon />
    return null
  }

  return (
    <>
      <Button variant="outlined" startIcon={<SortIcon />} onClick={handleClick}>
        Ordenar
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {columns
          .filter((column) => column.sortable !== false)
          .map((column) => (
            <MenuItem
              key={column.field}
              onClick={() => handleSortChange(column.field)}
            >
              <ListItemIcon>{getSortIcon(column.field)}</ListItemIcon>
              <ListItemText>{column.headerName}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
