"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { Zap, Users, Award, Wallet } from 'lucide-react'

export function WelcomeScreen() {
  const { nextStep } = useOnboardingStore()

  const features = [
    {
      icon: Award,
      title: "On-chain Skill Reputation",
      description: "Build verifiable credentials and earn certificates for your expertise"
    },
    {
      icon: Wallet,
      title: "Web3-Friendly Identity",
      description: "Connect your wallet and own your learning journey"
    },
    {
      icon: Users,
      title: "Teach & Learn Together",
      description: "Share your skills and discover new ones from our community"
    },
    {
      icon: Zap,
      title: "Cross-Domain Skills",
      description: "From tech to creative arts - all skills are welcome here"
    }
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to SkillSwap! 🎉
        </h1>
        <p className="text-xl text-muted-foreground">
          {"Let's build your learning identity and connect you with amazing people"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          {"Ready to get started? It'll only take a few minutes!"}
        </p>
        <Button 
          onClick={nextStep}
          size="lg"
          className="px-8 py-3 text-lg font-semibold"
        >
          {"Let's Get Started"}
        </Button>
      </div>
    </div>
  )
}
