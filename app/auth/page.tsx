"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, Wallet, Github, Chrome } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const { signIn, signUp, isSignedIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [signInData, setSignInData] = useState({ email: "", password: "" })
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" })

  // Redirect if already signed in
  if (isSignedIn) {
    router.push("/dashboard")
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(signInData.email, signInData.password)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(signUpData.name, signUpData.email, signUpData.password)
      toast({
        title: "Account created!",
        description: "Welcome to SkillSwap. Your account has been created successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet authentication will be available soon!",
    })
  }

  const handleSocialAuth = (provider: string) => {
    toast({
      title: `${provider} Authentication`,
      description: `${provider} sign-in will be available soon!`,
    })
  }

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-black mb-2">Welcome to SkillSwap</h1>
          <p className="text-gray-600 font-medium">Join the decentralized learning community</p>
        </div>

        <Card className="card-clean">
          <CardHeader>
            <CardTitle className="text-black font-black text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-black font-bold">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-black font-bold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-black font-bold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-black font-bold">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-black font-bold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-600 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button onClick={handleWalletConnect} className="btn-secondary">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => handleSocialAuth("Google")} className="btn-secondary">
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button onClick={() => handleSocialAuth("GitHub")} className="btn-secondary">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm font-medium">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-black hover:underline font-bold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-black hover:underline font-bold">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
