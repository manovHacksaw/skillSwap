"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Shield,
  Award,
  Zap,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnectForm() {
  const { data, updateData, prevStep, submitOnboarding, isLoading, error } =
    useOnboardingStore();
  const { toast } = useToast();

  const [isConnected, setIsConnected] = useState(!!data.walletAddress);
  const [walletAddress, setWalletAddress] = useState(data.walletAddress || "");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);

        // Sign a message to verify ownership
        const message = `Welcome to SkillSwap! Please sign this message to verify your wallet ownership.\n\nTimestamp: ${Date.now()}`;

        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });

        updateData({
          walletAddress: address,
          walletSignature: signature,
        });

        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected!",
        });
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);

      let errorMessage = "Failed to connect wallet. Please try again.";
      if (error.code === 4001) {
        errorMessage = "Wallet connection was rejected by user.";
      } else if (error.code === -32002) {
        errorMessage =
          "A connection request is already pending. Please check your wallet.";
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async () => {
    const success = await submitOnboarding();
    if (success) {
      toast({
        title: "Welcome to SkillSwap!",
        description: "Your onboarding has been completed successfully.",
      });
      // Redirect will be handled by the main onboarding component
    }
  };

  const skipWallet = async () => {
    updateData({ walletAddress: undefined, walletSignature: undefined });
    await handleSubmit();
  };

  const benefits = [
    {
      icon: Shield,
      title: "Secure Identity",
      description:
        "Your learning identity is linked to your wallet for security",
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
  ];

  return (
    <Card className="max-w-2xl mx-auto w-full bg-card border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Wallet className="h-5 w-5" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {"Link your learning identity to your wallet for Web3 features"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg bg-muted/20"
              >
                <div className="p-2 rounded-lg bg-accent">
                  <benefit.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!isConnected ? (
            <div className="space-y-4">
              <Button
                onClick={connectWallet}
                className="w-full"
                size="lg"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask Wallet
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {"Don't have a wallet yet?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => window.open("https://metamask.io/", "_blank")}
                  className="text-sm"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Install MetaMask
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Wallet Connected!
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Optional Step
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {
                  "You can skip this step and connect your wallet later from your profile settings."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isLoading || isConnecting}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={skipWallet}
              disabled={isLoading || isConnecting}
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || isConnecting}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Completing...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
