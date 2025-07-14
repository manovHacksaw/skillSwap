"use client"

import { Button } from "@/components/ui/button"
import { User, LogIn, LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function ClerkAuthButton() {
  const { user, isSignedIn, signOut } = useAuth()

  if (isSignedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline font-medium">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border border-gray-200">
          <DropdownMenuItem asChild>
            <Link href="/profile/demo">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Link href="/auth">
      <Button className="btn-primary">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    </Link>
  )
}
