export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio?: string
  location?: string
  skillScore: number
  rating: number
  walletAddress?: string
  isVerified: boolean
  joinDate: string
}

export interface Skill {
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
  sessionType: "online" | "offline" | "both"
  maxStudents: number
  availability: string[]
}

export interface Session {
  id: string
  title: string
  instructor: {
    name: string
    avatar: string
  }
  student?: {
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
  meetingLink?: string
}

export interface FeedItem {
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

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: ChatMessage
  unreadCount: number
}
