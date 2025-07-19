"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/skills", label: "Skills" },
    { href: "/feed", label: "Feed" },
    { href: "/profile/demo", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-0">
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand (left side) */}
          <div className="flex items-center ml-0 pl-0">
            <Link href="/" className="flex items-center space-x-2 ml-0 pl-0">
              <span className="font-black tracking-tight text-3xl flex items-center font-inter">
                <span className="font-extrabold" style={{fontFamily: 'Avenir, Inter, sans-serif'}}>
                  skill
                  <span className="text-yellow-400 text-4xl mx-0.5" style={{fontFamily: 'inherit', lineHeight: 1}}>$</span>
                  <span style={{color: '#FFE37B'}}>wap</span>
                </span>
              </span>
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
                style={{ textDecoration: 'none', boxShadow: 'none' }}
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
                  <button className="bg-[#FFF9E3] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-base px-6 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
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
                    <button className="bg-[#FFF9E3] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-bold text-sm px-4 py-2 rounded-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black active:scale-95">
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