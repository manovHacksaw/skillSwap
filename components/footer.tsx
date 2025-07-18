import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Zap } from "lucide-react"
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e0fafa] py-8 px-4 border-t-2 border-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center mb-2">
          <Image
            src="/placeholder-logo.png" // Use your actual logo path if different
            alt="Didasko Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-2xl font-bold text-yellow-400 drop-shadow-[2px_2px_0px_black]">skillSwap</span>
        </div>

        {/* Links */}
        <nav className="flex space-x-8 mb-2">
          <a href="#" className="font-semibold text-black hover:underline">Benefits</a>
          <a href="#" className="font-semibold text-black hover:underline">How it work</a>
          <a href="#" className="font-semibold text-black hover:underline">Testimonials</a>
          <a href="#" className="font-semibold text-black hover:underline">Pricing</a>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-4 mb-2">
          {/* Facebook */}
          <a href="#" className="rounded-full bg-yellow-300 border-2 border-black w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_black]">
            <svg width="20" height="20" fill="black" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
          </a>
          {/* Instagram */}
          <a href="#" className="rounded-full bg-yellow-300 border-2 border-black w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_black]">
            <svg width="20" height="20" fill="black" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.212 2.092-1.271 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.291 2.393 1.271 3.373.98.98 2.092 1.212 3.373 1.271C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.373-1.271.98-.98 1.212-2.092 1.271-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.291-2.393-1.271-3.373-.98-.98-2.092-1.212-3.373-1.271C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          {/* Snapchat */}
          <a href="#" className="rounded-full bg-yellow-300 border-2 border-black w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_black]">
            <svg width="20" height="20" fill="black" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-black text-center text-sm mt-2">
          © 2025 skillSwap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
