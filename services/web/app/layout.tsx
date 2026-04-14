import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Regina - AI Agent Chat',
  description: 'Chat with Regina AI agents powered by Platformatic'
}

export default function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
