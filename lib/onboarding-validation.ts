import { z } from 'zod'

export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  interests: z.array(z.string()).min(1, 'Please add at least one interest'),
})

export const aboutYouSchema = z.object({
  occupation: z.string().min(2, 'Please enter your occupation'),
  ageGroup: z.string().min(1, 'Please select an age group'),
  hobbies: z.array(z.string()).min(1, 'Please add at least one hobby'),
})

export const skillsOfferedSchema = z.object({
  skillsOffered: z.array(z.object({
    skill: z.string().min(1, 'Skill name is required'),
    proficiency: z.enum(['Beginner', 'Intermediate', 'Expert'])
  })).min(1, 'Please add at least one skill you can teach'),
})

export const userIntentSchema = z.object({
  userIntent: z.array(z.string()).min(1, 'Please select at least one option'),
})

export const skillsWantedSchema = z.object({
  learningGoals: z.array(z.string()).min(1, 'Please add at least one skill you want to learn'),
})

export const availabilitySchema = z.object({
  userAvailability: z.array(z.string()).min(1, 'Please select your availability'),
})
