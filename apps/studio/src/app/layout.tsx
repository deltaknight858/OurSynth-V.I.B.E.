import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'OurSynth',
  description: 'Advanced audio synthesis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="app-background"
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          background: 'var(--background-primary)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
        }}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
