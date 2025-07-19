"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { Wallet, Shield, Award, Zap, CheckCircle } from "lucide-react"

export function WalletConnectForm() {
  const { data, updateData, prevStep, submitOnboarding, isLoading, error } = useOnboardingStore()

  const [isConnected, setIsConnected] = useState(!!data.walletAddress)
  const [walletAddress, setWalletAddress] = useState(data.walletAddress || "")

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to connect your wallet")
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const address = accounts[0]
        setWalletAddress(address)
        setIsConnected(true)

        // Sign a message to verify ownership
        const message = `Welcome to SkillSwap! Please sign this message to verify your wallet ownership.\n\nTimestamp: ${Date.now()}`

        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, address],
        })

        updateData({
          walletAddress: address,
          walletSignature: signature,
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    }
  }

  const handleSubmit = async () => {
    const success = await submitOnboarding()
    if (success) {
      // Redirect will be handled by the main onboarding component
    }
  }

  const skipWallet = async () => {
    updateData({ walletAddress: undefined, walletSignature: undefined })
    await handleSubmit()
  }

  const benefits = [
    {
      icon: Shield,
      title: "Secure Identity",
      description: "Your learning identity is linked to your wallet for security",
    },
    {
      icon: Award,
      title: "NFT Certificates",
      description: "Earn verifiable certificates and badges as NFTs",
    },
    {
      icon: Zap,
      title: "Future Rewards",
      description: "Participate in token rewards and governance (coming soon)",
    },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription>{"Link your learning identity to your wallet for Web3 features"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {!isConnected ? (
            <div className="space-y-4">
              <Button onClick={connectWallet} className="w-full" size="lg">
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask Wallet
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{"Don't have a wallet yet?"}</p>
                <Button
                  variant="link"
                  onClick={() => window.open("https://metamask.io/", "_blank")}
                  className="text-sm"
                >
                  Install MetaMask
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Wallet Connected!</h4>
                  <p className="text-sm text-green-700">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep} disabled={isLoading}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={skipWallet} disabled={isLoading}>
              Skip for now
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Completing..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
