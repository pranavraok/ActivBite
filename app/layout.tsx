import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ActivBite - Student Breakfast Bars',
  description:
    'Delicious and nutritious breakfast bars designed for active students. Perfect for pre-workout, post-workout, and daily nutrition.',
  keywords: ['breakfast bars', 'student nutrition', 'protein bars', 'energy bars'],
  icons: {
    icon: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF8C42',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${poppins.variable} antialiased font-sans`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
