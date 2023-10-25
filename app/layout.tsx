import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Brendan Jarvis - Blog',
  description:
    "Brendan Jarvis's blog about software development, motorcyling, and other things.",
  authors: [{ name: 'Brendan Jarvis', url: 'https://x.com/brendanjjarvis' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  )
}
