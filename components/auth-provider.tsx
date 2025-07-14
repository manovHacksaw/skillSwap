"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  signUp: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = async (email: string, password: string) => {
    // Mock sign in - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      id: "1",
      name: "John Doe",
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
    })
  }

  const signOut = () => {
    setUser(null)
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Mock sign up - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      id: "1",
      name: name,
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
