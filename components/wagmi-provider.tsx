"use client"

import type { ReactNode } from "react"

// Mock WagmiProvider for demo purposes
export function WagmiProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
