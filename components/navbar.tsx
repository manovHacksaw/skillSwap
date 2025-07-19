"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
// Use @clerk/nextjs for useAuth and UserButton when working with Next.js
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs"; 

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, isLoaded } = useAuth(); // No need for getToken if not sending explicitly
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Only proceed if Clerk is loaded and the user is signed in
    // This effect runs on initial load and when isSignedIn/isLoaded state changes
    if (isLoaded && isSignedIn) {
      console.log("User is signed in. Triggering /api/user POST...");

      const createUserOrCheckExistence = async () => {
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Clerk handles authentication for internal API routes via cookies.
              // No need to manually send userId or token in headers from here.
            },
            // No body is needed as the server gets user info from Clerk's `auth()` and `currentUser()`
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from /api/user POST:", errorData.message || `HTTP error! status: ${response.status}`);
            // You might want to display a toast or handle this error more gracefully
            // instead of just redirecting, if the creation/check itself failed.
            // For now, we'll proceed with redirect to dashboard even on error,
            // or you could choose to block redirection based on error.
          } else {
            console.log("API call to /api/user POST successful.");
          }
          
          // Regardless of success/failure of the API call, redirect to dashboard.
          // Adjust this logic if you want to prevent redirection on certain API errors.
          router.push("/dashboard");

        } catch (error: any) {
          console.error("Network or unexpected error during API call:", error);
          // Still redirect even if network error, or handle specifically
          router.push("/dashboard");
        }
      };

      createUserOrCheckExistence();
    } else if (isLoaded && !isSignedIn) {
      // Optional: If you want to log when user signs out or is not signed in
      console.log("Clerk loaded, user is not signed in.");
    }
  }, [isLoaded, isSignedIn, router]); // Added router to dependencies

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/skills", label: "Skills" },
    { href: "/feed", label: "Feed" },
    { href: "/profile/demo", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand (left side) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="w-6 h-6" />
              <span className="font-bold text-xl">Brand</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-black font-bold text-base tracking-tight transition-colors duration-200 px-1 py-0.5 hover:text-gray-600"
                style={{ textDecoration: "none", boxShadow: "none" }}
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-gray-100"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-base px-6 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-base px-6 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 hover:text-black transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {/* Mobile Auth Buttons */}
                <SignedOut>
                  <SignInButton>
                    <button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-sm px-4 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-[#FFE37B] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-sm px-4 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}