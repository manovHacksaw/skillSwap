"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import SkillCard from "@/components/skill-card"

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const categories = [
    "All Categories",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Language",
    "Music",
    "Fitness",
    "Cooking",
  ]

  const mockSkills = [
    {
      id: "1",
      title: "React & Next.js Development",
      description:
        "Learn modern React development with Next.js, TypeScript, and best practices for building scalable web applications.",
      category: "Programming",
      instructor: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      price: 75,
      duration: "2 hours",
      students: 124,
      location: "Online",
      tags: ["React", "Next.js", "TypeScript", "Web Development"],
    },
    {
      id: "2",
      title: "UI/UX Design Fundamentals",
      description:
        "Master the principles of user interface and user experience design using Figma and modern design tools.",
      category: "Design",
      instructor: {
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
      },
      price: 60,
      duration: "1.5 hours",
      students: 89,
      location: "Online",
      tags: ["UI/UX", "Figma", "Design Systems", "Prototyping"],
    },
    {
      id: "3",
      title: "Smart Contract Development",
      description:
        "Build and deploy smart contracts on Ethereum using Solidity, Hardhat, and modern Web3 development tools.",
      category: "Programming",
      instructor: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5.0,
      },
      price: 120,
      duration: "3 hours",
      students: 67,
      location: "Online",
      tags: ["Solidity", "Ethereum", "Web3", "DeFi"],
    },
    {
      id: "4",
      title: "Digital Marketing Strategy",
      description:
        "Learn comprehensive digital marketing strategies including SEO, social media, and content marketing.",
      category: "Marketing",
      instructor: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.7,
      },
      price: 50,
      duration: "2 hours",
      students: 156,
      location: "Online",
      tags: ["SEO", "Social Media", "Content Marketing", "Analytics"],
    },
    {
      id: "5",
      title: "Spanish Conversation Practice",
      description:
        "Improve your Spanish speaking skills through interactive conversation sessions with native speakers.",
      category: "Language",
      instructor: {
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
      },
      price: 35,
      duration: "1 hour",
      students: 203,
      location: "Online",
      tags: ["Spanish", "Conversation", "Grammar", "Culture"],
    },
    {
      id: "6",
      title: "Guitar for Beginners",
      description: "Start your musical journey with basic guitar techniques, chords, and popular songs.",
      category: "Music",
      instructor: {
        name: "Jake Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.6,
      },
      price: 40,
      duration: "1 hour",
      students: 78,
      location: "In-Person",
      tags: ["Guitar", "Music Theory", "Chords", "Songs"],
    },
  ]

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory
    const matchesLocation =
      selectedLocation === "all" || skill.location.toLowerCase() === selectedLocation.toLowerCase()

    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: '#F9F6F3',
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Discover Skills</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Find the perfect skill to learn or connect with amazing teachers in our community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000] p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search skills, technologies, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-black text-black placeholder:text-gray-500 bg-white"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 border-2 border-black text-black bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Cooking">Cooking</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full lg:w-48 border-2 border-black text-black bg-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000]">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 font-medium">
            Showing {filteredSkills.length} skills
            {searchQuery && (
              <span>
                {" "}
                for "<span className="text-black font-bold">{searchQuery}</span>"
              </span>
            )}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <SkillCard skill={skill} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Try adjusting your search criteria or browse all available skills
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedLocation("all")
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-2 border-black shadow-[4px_4px_0_0_#000]"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-black text-black mb-6">Popular Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.slice(1).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer border-2 border-black text-gray-700 hover:border-yellow-400 hover:text-black hover:bg-yellow-50 transition-colors px-4 py-2 font-medium bg-white"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
