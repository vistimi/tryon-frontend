import dynamic from 'next/dynamic'
import React, { Fragment, ReactNode } from 'react'

const noSsr = ({children}:{children?: ReactNode | undefined}) => (
    <Fragment>{children}</Fragment>
)

export const NoSsr = dynamic(() => Promise.resolve(noSsr), {
  ssr: false
})