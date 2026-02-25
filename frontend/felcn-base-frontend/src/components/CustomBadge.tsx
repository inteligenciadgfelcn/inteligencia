import { ReactNode } from 'react'

interface BadgeVariantParams {
  content: ReactNode
  variante?: string
  className?: string
}

const CustomBadge = ({
  content,
  variante = 'primary',
  className = '',
}: BadgeVariantParams) => {
  const variantesConfig = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white', 
    neutro: 'bg-gray-500 text-white',
    opacity: 'bg-primary text-white opacity-70',
    outline: 'border border-primary text-primary bg-transparent',
    gradient: 'bg-gradient-to-b from-primary to-info text-white opacity-70',
    error: 'bg-danger text-white opacity-70',
    success: 'bg-success text-white opacity-70',
    alert: 'bg-warning text-white opacity-70',
  }
  
  const configVariante = variantesConfig[variante as keyof typeof variantesConfig] || variantesConfig.primary

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${configVariante} ${className}`}>
      {content}
    </span>
  )
}

export default CustomBadge
