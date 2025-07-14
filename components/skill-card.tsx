"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Users, MapPin } from "lucide-react"
import Link from "next/link"

interface SkillCardProps {
  skill: {
    id: string
    title: string
    description: string
    category: string
    instructor: {
      name: string
      avatar: string
      rating: number
    }
    price: number
    duration: string
    students: number
    location: string
    tags: string[]
  }
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="card-clean overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-semibold">
              {skill.category}
            </Badge>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{skill.instructor.rating}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors">{skill.title}</h3>

          <p className="text-gray-600 text-sm line-clamp-2 font-medium">{skill.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={skill.instructor.avatar || "/placeholder.svg"} />
              <AvatarFallback>{skill.instructor.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 font-medium">{skill.instructor.name}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{skill.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{skill.students}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{skill.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {skill.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-bold text-black">
              ${skill.price}
              <span className="text-sm text-gray-600 font-normal">/session</span>
            </div>
            <Link href={`/skills/${skill.id}`}>
              <Button size="sm" className="btn-primary">
                Book Session
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
