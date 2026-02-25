import React from 'react'
import { Icono } from '@/components/Icono'

interface Props {
  title: string
  value: string | number
  icon: string
  color?: string
}

export default function VristoStatCard({
  title,
  value,
  icon,
  color = '#4361ee',
}: Props) {
  return (
    <div className="panel h-full p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${color}22`,
            color: color,
          }}
        >
          <Icono fontSize="large" className="w-6 h-6">{icon}</Icono>
        </div>

        {/* Text */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {title}
          </p>

          <h3 className="text-xl font-bold text-dark dark:text-white">
            {value}
          </h3>
        </div>
      </div>
    </div>
  )
}
