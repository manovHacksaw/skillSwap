import type React from "react"
import type { Metadata } from "next"
import { Inter, Pacifico } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { WagmiProvider } from "@/components/wagmi-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"

// Ensure environment variables are available
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export const metadata: Metadata = {
  title: "SkillSwap - Decentralized Skill Exchange Platform",
  description: "Connect, learn, and teach skills in a decentralized Web3 environment",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${pacifico.variable} font-inter`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <WagmiProvider>
              <div
                className="min-h-screen w-full"
                style={{
                  backgroundColor: '#F9F6F3',
                  backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
                }}
              >
                <Navbar />
                <main className="relative">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </WagmiProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
