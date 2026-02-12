import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Suspense } from 'react'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'CampusCart | Your Campus Marketplace',
  description: 'Buy, sell, and save with fellow students. Zero fees, safe meetups.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className={`${syne.variable} font-display`}>
        {/* Navbar is fixed/sticky; children sit below it via pt-16 */}
        <Suspense>
          <Navbar />
        </Suspense>
        {/* pt-16 matches nav height (h-16) so content never hides under it */}
        <div className="pt-16 min-h-screen flex flex-col">
          <Suspense>
            <main className="flex-1 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </Suspense>
          <Footer />
        </div>
      </body>
    </html>
  )
}
