'use client'
import { Box } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthSidePanel() {
  return (
    <Box
      sx={{
        position: 'relative',
        display: { xs: 'none', lg: 'flex' },
        width: '100%',
        maxWidth: '835px',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(225deg, rgba(239,18,98,1) 0%, rgba(67,97,238,1) 100%)',
        p: 5,
        marginLeft: { xl: '-128px' },
        transform: { xl: 'skewX(14deg)' },
      }}
    >
      {/* Gradiente de transición */}
      <Box
        sx={{
          position: 'absolute',
          insetY: 0,
          right: '-40px',
          width: { xs: '32px', xl: '64px' },
          background:
            'linear-gradient(to right, rgba(67,97,238,0.1), transparent)',
          display: { xs: 'none', xl: 'block' },
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          transform: { xl: 'skewX(-14deg)' },
        }}
      >
        <Link
          href="/"
          style={{ display: 'block', width: '192px', marginLeft: '40px' }}
        >
          <Image
            src="/assets/images/auth/logo-white.svg"
            alt="Logo"
            width={288}
            height={80}
            style={{ width: '100%', height: 'auto' }}
          />
        </Link>
        <Box
          sx={{
            mt: 24,
            display: { xs: 'none', lg: 'block' },
            width: '100%',
            maxWidth: '430px',
          }}
        >
          <Image
            src="/assets/images/auth/login.svg"
            alt="Login Cover"
            width={430}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Box>
    </Box>
  )
}
