'use client'
import { Box } from '@mui/material'
import Image from 'next/image'

export default function AuthBackground() {
  return (
    <>
      {/* Fondo con gradiente */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/assets/images/auth/bg-gradient.png"
          alt="background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      {/* Objetos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: '100%',
          maxHeight: '893px',
          width: 'auto',
          zIndex: 1,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Image
          src="/assets/images/auth/coming-soon-object1.png"
          alt="decoration"
          width={400}
          height={893}
          style={{ height: '100%', width: 'auto' }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: '24px', md: '30%' },
          top: 0,
          height: '160px',
          width: 'auto',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Image
          src="/assets/images/auth/coming-soon-object2.png"
          alt="decoration"
          width={150}
          height={160}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '300px',
          width: 'auto',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Image
          src="/assets/images/auth/coming-soon-object3.png"
          alt="decoration"
          width={250}
          height={300}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: '28%',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Image
          src="/assets/images/auth/polygon-object.svg"
          alt="decoration"
          width={100}
          height={100}
        />
      </Box>
    </>
  )
}
