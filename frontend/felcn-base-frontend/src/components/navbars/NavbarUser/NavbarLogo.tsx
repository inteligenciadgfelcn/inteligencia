import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { siteName } from '@/utils'

export const NavbarLogo: React.FC = () => {
  const router = useRouter()

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => router.replace('/admin/home')}
    >
      <Image
        src="/icono.png"
        alt=""
        width={30}
        height={30}
        className="w-auto h-auto max-w-full"
      />
      <div className="px-0.5" />
      <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
        {siteName()}
      </div>
    </div>
  )
}
