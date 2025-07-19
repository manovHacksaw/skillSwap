"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, MapPin, Video, Star, Users, DollarSign, CheckCircle, AlertCircle, CreditCard, Wallet } from "lucide-react"
import { format } from "date-fns"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Skill {
  id: string
  title: string
  description: string
  category: string
  instructor: {
    id: string
    name: string
    avatar: string
    rating: number
    totalSessions: number
    bio: string
  }
  price: number
  duration: string
  students: number
  location: string
  tags: string[]
  sessionType: "online" | "offline" | "both"
  maxStudents: number
  availability: string[]
}

interface BookingForm {
  date: Date | undefined
  time: string
  sessionType: "online" | "offline"
  location: string
  notes: string
  paymentMethod: "wallet" | "card"
}

export default function BookSessionPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()
  const skillId = params.skillId as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<BookingForm>({
    date: undefined,
    time: "",
    sessionType: "online",
    location: "",
    notes: "",
    paymentMethod: "wallet"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>("")

  // Mock skill data - in real app, fetch from API
  const getSkillData = (skillId: string): Skill => {
    const skillMap: Record<string, Skill> = {
      "1": {
        id: "1",
        title: "React & Next.js Development",
        description: "Learn modern React development with Next.js, TypeScript, and best practices for building scalable web applications.",
        category: "Programming",
        instructor: {
          id: "instructor-1",
          name: "Sarah Chen",
          avatar: "/placeholder.svg",
          rating: 4.9,
          totalSessions: 156,
          bio: "Full-stack developer with 8+ years of experience. Passionate about teaching React and helping developers level up their skills."
        },
        price: 75,
        duration: "2 hours",
        students: 124,
        location: "Online",
        tags: ["React", "Next.js", "TypeScript", "Web Development"],
        sessionType: "both",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "2": {
        id: "2",
        title: "UI/UX Design Fundamentals",
        description: "Master the principles of user interface and user experience design using Figma and modern design tools.",
        category: "Design",
        instructor: {
          id: "instructor-2",
          name: "Marcus Johnson",
          avatar: "/placeholder.svg",
          rating: 4.8,
          totalSessions: 89,
          bio: "Senior UI/UX designer with 6+ years of experience. Specialized in creating intuitive and beautiful user experiences."
        },
        price: 60,
        duration: "1.5 hours",
        students: 89,
        location: "Online",
        tags: ["UI/UX", "Figma", "Design Systems", "Prototyping"],
        sessionType: "both",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "3": {
        id: "3",
        title: "Smart Contract Development",
        description: "Build and deploy smart contracts on Ethereum using Solidity, Hardhat, and modern Web3 development tools.",
        category: "Programming",
        instructor: {
          id: "instructor-3",
          name: "Alex Rodriguez",
          avatar: "/placeholder.svg",
          rating: 5.0,
          totalSessions: 67,
          bio: "Blockchain developer and DeFi expert with 5+ years of experience in smart contract development and Web3 technologies."
        },
        price: 120,
        duration: "3 hours",
        students: 67,
        location: "Online",
        tags: ["Solidity", "Ethereum", "Web3", "DeFi"],
        sessionType: "both",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "4": {
        id: "4",
        title: "Digital Marketing Strategy",
        description: "Learn comprehensive digital marketing strategies including SEO, social media, and content marketing.",
        category: "Marketing",
        instructor: {
          id: "instructor-4",
          name: "Emma Wilson",
          avatar: "/placeholder.svg",
          rating: 4.7,
          totalSessions: 156,
          bio: "Digital marketing strategist with 7+ years of experience helping businesses grow their online presence."
        },
        price: 50,
        duration: "2 hours",
        students: 156,
        location: "Online",
        tags: ["SEO", "Social Media", "Content Marketing", "Analytics"],
        sessionType: "both",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "5": {
        id: "5",
        title: "Spanish Conversation Practice",
        description: "Improve your Spanish speaking skills through interactive conversation sessions with native speakers.",
        category: "Language",
        instructor: {
          id: "instructor-5",
          name: "Carlos Mendez",
          avatar: "/placeholder.svg",
          rating: 4.9,
          totalSessions: 203,
          bio: "Native Spanish speaker and certified language instructor with 4+ years of teaching experience."
        },
        price: 35,
        duration: "1 hour",
        students: 203,
        location: "Online",
        tags: ["Spanish", "Conversation", "Grammar", "Culture"],
        sessionType: "both",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      "6": {
        id: "6",
        title: "Guitar for Beginners",
        description: "Start your musical journey with basic guitar techniques, chords, and popular songs.",
        category: "Music",
        instructor: {
          id: "instructor-6",
          name: "Jake Thompson",
          avatar: "/placeholder.svg",
          rating: 4.6,
          totalSessions: 78,
          bio: "Professional guitarist and music teacher with 8+ years of experience teaching beginners and intermediate players."
        },
        price: 40,
        duration: "1 hour",
        students: 78,
        location: "In-Person",
        tags: ["Guitar", "Music Theory", "Chords", "Songs"],
        sessionType: "offline",
        maxStudents: 1,
        availability: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      }
    }

    return skillMap[skillId] || {
      id: skillId,
      title: "Skill Not Found",
      description: "This skill is not available for booking.",
      category: "Unknown",
      instructor: {
        id: "unknown",
        name: "Unknown Instructor",
        avatar: "/placeholder.svg",
        rating: 0,
        totalSessions: 0,
        bio: "Instructor information not available."
      },
      price: 0,
      duration: "0 min",
      students: 0,
      location: "Unknown",
      tags: [],
      sessionType: "both",
      maxStudents: 1,
      availability: []
    }
  }

  // Available time slots
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const skillData = getSkillData(skillId)
      setSkill(skillData)
      setAvailableSlots(timeSlots)
      setLoading(false)
    }, 1000)
  }, [skillId])

  const handleDateSelect = (date: Date | undefined) => {
    setBooking(prev => ({ ...prev, date }))
    setSelectedSlot("")
  }

  const handleTimeSelect = (time: string) => {
    setBooking(prev => ({ ...prev, time }))
    setSelectedSlot(time)
  }

  const handleSessionTypeChange = (type: "online" | "offline") => {
    setBooking(prev => ({ 
      ...prev, 
      sessionType: type,
      location: type === "online" ? "Online Session" : ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!booking.date || !booking.time) {
      toast.error("Please select a date and time")
      return
    }

    if (booking.sessionType === "offline" && !booking.location) {
      toast.error("Please enter a location for offline sessions")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Session booked successfully! 🎉")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to book session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return skill?.price || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Not Found</h1>
          <p className="text-gray-600 mb-6">The skill you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/skills")}>
            Browse Skills
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: '#F9F6F3',
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 16px)`
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black text-black mb-2">Book Session</h1>
          <p className="text-gray-600 font-medium">Schedule your learning session with {skill.instructor.name}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Instructor Info */}
            <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Instructor Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-black">
                    <AvatarImage src={skill.instructor.avatar} />
                    <AvatarFallback className="bg-yellow-400 text-black font-bold">
                      {skill.instructor.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-1">{skill.instructor.name}</h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{skill.instructor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">{skill.instructor.totalSessions} sessions</span>
                    </div>
                    <p className="text-gray-700 text-sm">{skill.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Details */}
            <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000]">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Session Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">{skill.title}</h3>
                  <p className="text-gray-700 mb-3">{skill.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-300 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Session Type Selection */}
                <div className="space-y-3">
                  <Label className="text-black font-bold">Session Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={booking.sessionType === "online" ? "default" : "outline"}
                      className={cn(
                        "h-16 flex flex-col items-center justify-center space-y-1 border-2",
                        booking.sessionType === "online" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                          : "border-black hover:bg-gray-50 bg-white text-black"
                      )}
                      onClick={() => handleSessionTypeChange("online")}
                    >
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-medium">Online</span>
                    </Button>
                    <Button
                      type="button"
                      variant={booking.sessionType === "offline" ? "default" : "outline"}
                      className={cn(
                        "h-16 flex flex-col items-center justify-center space-y-1 border-2",
                        booking.sessionType === "offline" 
                          ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                          : "border-black hover:bg-gray-50 bg-white text-black"
                      )}
                      onClick={() => handleSessionTypeChange("offline")}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-medium">Offline</span>
                    </Button>
                  </div>
                </div>

                {/* Location for Offline Sessions */}
                {booking.sessionType === "offline" && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-black font-bold">
                      Meeting Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter meeting location or address"
                      value={booking.location}
                      onChange={(e) => setBooking(prev => ({ ...prev, location: e.target.value }))}
                      className="border-2 border-black bg-white"
                    />
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-3">
                  <Label className="text-black font-bold">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-2 border-black bg-white",
                          !booking.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {booking.date ? format(booking.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={booking.date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                {booking.date && (
                  <div className="space-y-3">
                    <Label className="text-black font-bold">Select Time</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedSlot === slot ? "default" : "outline"}
                          className={cn(
                            "h-12 border-2",
                            selectedSlot === slot 
                              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                              : "border-black hover:bg-gray-50 bg-white text-black"
                          )}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-black font-bold">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific topics you'd like to cover or questions you have..."
                    value={booking.notes}
                    onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                    className="border-2 border-black bg-white min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Summary & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Booking Summary */}
            <Card className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000] sticky top-8">
              <CardHeader>
                <CardTitle className="text-black font-black flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Session Price:</span>
                    <span className="font-bold">${skill.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold">{skill.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-bold capitalize">{booking.sessionType}</span>
                  </div>
                  {booking.date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-bold">{format(booking.date, "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  {booking.time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-bold">{booking.time}</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label className="text-black font-bold">Payment Method</Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant={booking.paymentMethod === "wallet" ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start h-12 border-2",
                        booking.paymentMethod === "wallet" 
                          ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600" 
                          : "border-black hover:bg-gray-50 bg-white text-black"
                      )}
                      onClick={() => setBooking(prev => ({ ...prev, paymentMethod: "wallet" }))}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay with Wallet
                    </Button>
                    <Button
                      type="button"
                      variant={booking.paymentMethod === "card" ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start h-12 border-2",
                        booking.paymentMethod === "card" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                          : "border-black hover:bg-gray-50 bg-white text-black"
                      )}
                      onClick={() => setBooking(prev => ({ ...prev, paymentMethod: "card" }))}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Card
                    </Button>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 border-2 border-black shadow-[4px_4px_0_0_#000]"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !booking.date || !booking.time}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Book Session - ${calculateTotal()}</span>
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By booking this session, you agree to our terms of service and cancellation policy.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 