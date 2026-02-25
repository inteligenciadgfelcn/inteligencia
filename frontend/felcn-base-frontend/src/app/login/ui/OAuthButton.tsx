import React from 'react'
import Image from 'next/image'

interface OAuthButtonProps {
  text: string
  altText?: string
  disabled?: boolean
  onClick?: () => void
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  sx?: any // kept for compatibility but ignored or mapped if needed
  logoSrc: string
  imageSize?: number
  children?: React.ReactNode
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  text,
  altText = 'Logo',
  disabled = false,
  onClick,
  fullWidth = false,
  startIcon,
  endIcon,
  logoSrc,
  imageSize = 35,
  children,
}) => {

  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        flex items-center gap-4 min-h-[44px] px-6 py-2 bg-white dark:bg-[#1b2e4b] 
        border border-gray-200 dark:border-[#191e3a] rounded-lg 
        hover:bg-gray-50 dark:hover:bg-[#191e3a]/80
        text-gray-700 dark:text-white-dark transition-all duration-300
        ${fullWidth ? 'w-full justify-center' : 'justify-start'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center min-w-[32px]">
        <Image
          src={logoSrc}
          alt={altText}
          width={imageSize}
          height={imageSize}
          className="rounded-full"
        />
      </div>

      {startIcon && (
        <div className="flex items-center">{startIcon}</div>
      )}

      <span className="flex-1 font-medium text-left">
        {text}
      </span>

      {endIcon && (
        <div className="flex items-center">{endIcon}</div>
      )}

      {children}
    </button>
  )
}
