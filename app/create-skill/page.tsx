"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, DollarSign, Clock, MapPin, Video, Users, Plus, X, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateSkillPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isWalletConnected, setIsWalletConnected] = useState(true) // Mock wallet connection

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    sessionType: "",
    location: "",
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    tags: [] as string[],
    maxStudents: "1",
  })

  const [newTag, setNewTag] = useState("")

  const categories = [
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Language",
    "Music",
    "Fitness",
    "Cooking",
    "Photography",
    "Writing",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: checked,
      },
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a skill listing.",
        variant: "destructive",
      })
      return
    }

    // Mock form submission
    toast({
      title: "Skill Created Successfully!",
      description: "Your skill listing has been published to the marketplace.",
    })

    // Redirect to skills page
    setTimeout(() => {
      router.push("/skills")
    }, 2000)
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="card-clean max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-black text-black mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6 font-medium">
                You need to connect your wallet to create skill listings and receive payments.
              </p>
              <Button onClick={() => setIsWalletConnected(true)} className="btn-primary w-full">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">Create New Skill</h1>
          <p className="text-xl text-gray-600 font-medium">
            Share your expertise and start earning in the decentralized economy
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-black font-bold">
                    Skill Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., React Development for Beginners"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-black font-bold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn and your teaching approach..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-500 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-black font-bold">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStudents" className="text-black font-bold">
                      Max Students per Session
                    </Label>
                    <Select
                      value={formData.maxStudents}
                      onValueChange={(value) => handleInputChange("maxStudents", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300 text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 (One-on-one)</SelectItem>
                        <SelectItem value="3">3 students</SelectItem>
                        <SelectItem value="5">5 students</SelectItem>
                        <SelectItem value="10">10 students</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-black font-bold">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-200 text-gray-700 font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="icon"
                      variant="outline"
                      className="border-gray-300 bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Details */}
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Session Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-black font-bold">
                      Price per Session ($)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="50"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-black font-bold">
                      Duration
                    </Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                      <SelectTrigger className="bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hour">1 hour</SelectItem>
                        <SelectItem value="1.5hours">1.5 hours</SelectItem>
                        <SelectItem value="2hours">2 hours</SelectItem>
                        <SelectItem value="3hours">3 hours</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionType" className="text-black font-bold">
                      Session Type
                    </Label>
                    <Select
                      value={formData.sessionType}
                      onValueChange={(value) => handleInputChange("sessionType", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300 text-black">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">
                          <div className="flex items-center space-x-2">
                            <Video className="w-4 h-4" />
                            <span>Online</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in-person">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>In-Person</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="both">Both Online & In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.sessionType === "in-person" || formData.sessionType === "both") && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-black font-bold">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA or Your Address"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Availability</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-black font-bold">Select your available days:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {Object.entries(formData.availability).map(([day, checked]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={checked}
                          onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                        />
                        <Label htmlFor={day} className="text-black capitalize cursor-pointer font-medium">
                          {day.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="btn-primary px-12 py-4 text-lg">
                Create Skill Listing
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
