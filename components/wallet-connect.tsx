"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Shield, Award, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface WalletConnectProps {
  onWalletConnected: (walletData: {
    address: string;
    signature: string;
  }) => void;
  isLoading?: boolean;
}

export default function WalletConnect({
  onWalletConnected,
  isLoading = false,
}: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask or another Web3 wallet to continue");
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      setWalletAddress(address);

      // Create a message to sign
      const message = `Welcome to SkillSwap! 

By signing this message, you're creating your on-chain learning identity.

Address: ${address}
Timestamp: ${new Date().toISOString()}
Nonce: ${Math.random().toString(36).substring(7)}`;

      // Request signature
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      onWalletConnected({
        address,
        signature,
      });

      toast.success("Wallet connected successfully! 🎉");
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      if (error.code === 4001) {
        toast.error("Wallet connection was rejected");
      } else {
        toast.error("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center mx-auto border-2 border-black">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-black">Connect Your Wallet</h2>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto">
          Link your learning journey to your wallet to store certificates,
          manage rewards, and ensure ownership of your achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="border-2 border-black shadow-lg">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-black mb-1">Secure Identity</h3>
            <p className="text-sm text-gray-600">
              Your wallet proves ownership of your learning achievements
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-lg">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-bold text-black mb-1">NFT Certificates</h3>
            <p className="text-sm text-gray-600">
              Earn blockchain-verified certificates for completed skills
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-lg">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-bold text-black mb-1">On-Chain Reputation</h3>
            <p className="text-sm text-gray-600">
              Build verifiable reputation that follows you everywhere
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-yellow-400 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          {!walletAddress ? (
            <>
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  Wallet connection required to continue
                </span>
              </div>
              <Button
                onClick={connectWallet}
                disabled={isConnecting || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <Wallet className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-600">
                Don't have a wallet?{" "}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Install MetaMask
                </a>
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto border-2 border-black">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">
                Wallet Connected!
              </h3>
              <p className="text-sm text-gray-600">
                Connected to: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </p>
              {isLoading && (
                <p className="text-sm text-gray-600">
                  Completing your setup...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
