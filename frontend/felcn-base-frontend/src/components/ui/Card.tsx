import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
  noPadding?: boolean
}

export const Card = ({
  children,
  className = '',
  title,
  action,
  noPadding = false,
}: CardProps) => {
  return (
    <div className={`panel w-full ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          <h5 className="text-lg font-semibold dark:text-white-light">
            {title}
          </h5>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'mb-5'}>{children}</div>
    </div>
  )
}
