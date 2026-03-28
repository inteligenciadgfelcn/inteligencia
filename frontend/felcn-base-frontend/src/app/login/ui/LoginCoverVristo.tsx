'use client'

import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

const LoginCoverVristo = ({ children }: Props) => {
  return (
    <div>
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="bg"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818]">

        <div className="relative flex w-full max-w-[1500px] flex-col overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[750px] lg:flex-row">

          {/* PANEL IZQUIERDO */}
          <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-10 lg:flex lg:w-1/2">

            <div>
              <Link href="/" className="block w-56">
                <img
                  src="/assets/images/auth/logo-white.svg"
                  alt="logo"
                />
              </Link>

              <img
                src="/assets/images/auth/login.svg"
                alt="login"
                className="mt-20 max-w-md"
              />
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="flex w-full items-center justify-center p-6 lg:w-1/2">

            {/* AQUÍ ENTRA TU LOGIN REAL */}
            {children}

          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginCoverVristo
