"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MapPin, Check, X } from "lucide-react"
import { motion } from "framer-motion"

interface SessionCardProps {
  session: {
    id: string
    title: string
    instructor: {
      name: string
      avatar: string
    }
    date: string
    time: string
    duration: string
    type: "online" | "offline"
    location?: string
    status: "upcoming" | "completed" | "cancelled"
    price: number
  }
}

export default function SessionCard({ session }: SessionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-clean">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black">{session.title}</h3>
            <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={session.instructor.avatar || "/placeholder.svg"} />
              <AvatarFallback>{session.instructor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-black font-medium">{session.instructor.name}</p>
              <p className="text-gray-600 text-sm">Instructor</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              {session.type === "online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              <span>{session.type === "online" ? "Online" : session.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span>{session.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-bold text-black">${session.price}</div>

            {session.status === "upcoming" && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
