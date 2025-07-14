import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-black">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black text-black">SkillSwap</span>
            </div>
            <p className="text-gray-600 max-w-md font-medium">
              The decentralized platform for skill exchange. Connect, learn, and teach in a Web3 environment with
              on-chain reputation and DAO validation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/skills"
                className="block text-gray-600 hover:text-black transition-colors font-medium hover:underline"
              >
                Discover Skills
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-black transition-colors font-medium hover:underline"
              >
                Dashboard
              </Link>
              <Link
                href="/sessions"
                className="block text-gray-600 hover:text-black transition-colors font-medium hover:underline"
              >
                Sessions
              </Link>
              <Link
                href="/feed"
                className="block text-gray-600 hover:text-black transition-colors font-medium hover:underline"
              >
                Activity Feed
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-black font-bold mb-4">Community</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Discord className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 SkillSwap. Built for the decentralized future.</p>
        </div>
      </div>
    </footer>
  )
}
