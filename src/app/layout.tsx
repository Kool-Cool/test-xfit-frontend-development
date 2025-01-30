import RootLayout from '@/components/layouts/root-layout'
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'
import React from "react";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'X-Fit',
  description: 'For gym enthusiasts to find and compare gyms in their area.',
}

export default function Layout({
                                 children,
                               }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <div
      className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"/>
    <RootLayout>{children}</RootLayout>
    </body>
    </html>
  )
}
