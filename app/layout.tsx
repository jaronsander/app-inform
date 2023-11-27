import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import GoogleTagManager from '@magicul/next-google-tag-manager';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '📯 inForm',
  description: 'Personalized forms that decrease sales friction by surfacing relevant information to all users.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleTagManager id={process.env.NEXT_PUBLIC_GTM}/>
        {children}
        </body>
    </html>
  )
}
