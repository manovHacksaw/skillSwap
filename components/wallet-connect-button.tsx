"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Check } from "lucide-react"
import { useState } from "react"

export default function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  // Mock wallet connection for demo
  const handleConnect = () => {
    if (!isConnected) {
      setAddress("0x1234...5678")
      setIsConnected(true)
    } else {
      setAddress("")
      setIsConnected(false)
    }
  }

  if (isConnected) {
    return (
      <Button
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50 bg-white font-medium"
        onClick={handleConnect}
      >
        <Check className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">{address}</span>
        <span className="sm:hidden">Connected</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-white font-medium" onClick={handleConnect}>
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
