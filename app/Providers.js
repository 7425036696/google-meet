'use client'
import React from "react"
import {SessionProvider} from 'next-auth/react'
import { ToastContainer } from "react-toastify"
import { ThemeProvider } from "next-themes"
const Providers = ({children,session}) => {
return  (
    <SessionProvider session={session}>
<ToastContainer position="top-right" autoClose={3000}/>
<ThemeProvider attribute={'class'}>
    {children}
</ThemeProvider>
    </SessionProvider>
)
}
export default Providers