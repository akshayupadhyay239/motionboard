import type { Metadata } from 'next'
import { Barlow_Condensed, Mulish } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/next'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800', '900'],
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'motionBoard — Every Video Contest, One Place',
  description: 'Discover video and motion design contests happening across Twitter, YouTube, Instagram, Reddit, and brand websites.',
  openGraph: {
    title: 'motionBoard — Every Video Contest, One Place',
    description: 'Discover video and motion design contests happening across the internet.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${mulish.variable}`}>
      <body className="bg-[#F4F3EF] text-[#0D0D0D] antialiased" style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
