import React, { useState, useEffect, useRef } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { Icono } from '@/components/Icono'

// Simple Dropdown component logic inline for now or we can extract
const ThemeSwitcherButton = () => {
  const { mode, setMode } = useColorScheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getIconForCurrentMode = () => {
    switch (mode) {
      case 'light':
        return 'light_mode'
      case 'dark':
        return 'dark_mode'
      default:
        return 'settings_brightness'
    }
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar tema"
      >
        <Icono color="action" className="text-gray-600 dark:text-gray-300">
          {getIconForCurrentMode()}
        </Icono>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'light' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}
            onClick={() => handleModeChange('light')}
          >
            <Icono fontSize="small">light_mode</Icono>
            Modo claro
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'dark' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}
            onClick={() => handleModeChange('dark')}
          >
            <Icono fontSize="small">dark_mode</Icono>
            Modo oscuro
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'system' ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}
            onClick={() => handleModeChange('system')}
          >
            <Icono fontSize="small">settings_brightness</Icono>
            Modo del sistema
          </button>
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcherButton
