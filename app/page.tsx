"use client"

import { motion } from "framer-motion"
import AnimatedHeroSection from "@/components/animated-hero-section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Award, Shield, Globe, Zap, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BenefitsSection from "@/components/benefits-section";
import IntegrationsSection from "@/components/integrations-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FAQSection from "@/components/faq-section";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: "On-Chain Reputation",
      description: "Build verifiable credentials and reputation that follows you across platforms",
    },
    {
      icon: <Users className="w-8 h-8 text-black" />,
      title: "DAO Validation",
      description: "Community-driven skill verification through decentralized governance",
    },
    {
      icon: <Globe className="w-8 h-8 text-black" />,
      title: "Cross-Platform Skills",
      description: "Port your skills and achievements across different Web3 platforms",
    },
    {
      icon: <Zap className="w-8 h-8 text-black" />,
      title: "Instant Matching",
      description: "AI-powered matching connects you with the perfect learning partners",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Offer Your Skills",
      description: "List what you can teach and what you want to learn",
      icon: <BookOpen className="w-12 h-12 text-black" />,
    },
    {
      number: "02",
      title: "Get Matched",
      description: "Our algorithm finds the perfect learning partners for you",
      icon: <Users className="w-12 h-12 text-black" />,
    },
    {
      number: "03",
      title: "Start Teaching",
      description: "Connect, learn, and build your on-chain reputation",
      icon: <Award className="w-12 h-12 text-black" />,
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full-Stack Developer",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
        "SkillSwap helped me learn blockchain development while teaching React. The on-chain reputation system is game-changing!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "UX Designer",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
        "Amazing platform! I've connected with incredible mentors and students. The Web3 integration makes everything seamless.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      avatar: "/placeholder.svg?height=60&width=60",
      content:
        "The community validation system ensures quality learning experiences. Best skill exchange platform I've used!",
      rating: 5,
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AnimatedHeroSection />
      
      {/* Benefits Section */}
      <BenefitsSection />

      {/* Integrations Section */}
      <IntegrationsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Why Choose SkillSwap</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Built for the decentralized future with cutting-edge Web3 technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="card-clean p-6 h-full">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-black text-black text-center">{feature.title}</h3>
                    <p className="text-gray-600 text-center font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">What Our Community Says</h2>
          </motion.div>

          <div className="relative">
            <Card className="card-clean p-8">
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl text-gray-700 italic font-medium">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                    <AvatarFallback>{testimonials[currentTestimonial].name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-black font-bold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 hover:bg-gray-50"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 hover:bg-gray-50"
              onClick={nextTestimonial}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-yellow-400" : "bg-gray-300"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-clean p-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 font-medium">
              Join thousands of learners and teachers building the future of education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/skills">
                <Button className="btn-secondary text-lg px-8 py-4">Explore Skills</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
