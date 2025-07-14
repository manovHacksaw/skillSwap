"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Award, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

interface FeedItemProps {
  item: {
    id: string
    user: {
      name: string
      avatar: string
      skillScore: number
    }
    type: "skill_learned" | "skill_taught" | "achievement" | "endorsement"
    content: string
    skill?: string
    timestamp: string
    likes: number
    comments: number
    isLiked: boolean
  }
}

export default function FeedItem({ item }: FeedItemProps) {
  const getIcon = () => {
    switch (item.type) {
      case "skill_learned":
        return <BookOpen className="w-5 h-5 text-blue-600" />
      case "skill_taught":
        return <Award className="w-5 h-5 text-green-600" />
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-600" />
      case "endorsement":
        return <Heart className="w-5 h-5 text-pink-600" />
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="card-clean">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={item.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{item.user.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-black">{item.user.name}</span>
                <div className="flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  <Award className="w-3 h-3" />
                  <span>{item.user.skillScore}</span>
                </div>
                <span className="text-gray-600 text-sm">•</span>
                <span className="text-gray-600 text-sm">{item.timestamp}</span>
              </div>

              <div className="flex items-start space-x-2">
                {getIcon()}
                <div>
                  <p className="text-gray-700 font-medium">{item.content}</p>
                  {item.skill && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {item.skill}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 ${item.isLiked ? "text-pink-600" : "text-gray-600"} hover:text-pink-600`}
                >
                  <Heart className={`w-4 h-4 ${item.isLiked ? "fill-current" : ""}`} />
                  <span>{item.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{item.comments}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
