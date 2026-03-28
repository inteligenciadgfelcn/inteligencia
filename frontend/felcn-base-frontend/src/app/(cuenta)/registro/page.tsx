'use client'
import { NextPage } from 'next'

import { siteName } from '@/utils'
import RegistroContainer from '@/app/login/ui/RegistroContainer'
import React from 'react'

const Page: NextPage = () => {
  return (
    <React.Fragment>
      <title>{`Registro - ${siteName()}`}</title>
      <RegistroContainer />
    </React.Fragment>
  )
}

export default Page
