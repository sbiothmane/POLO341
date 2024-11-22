'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { testimonials } from './data'

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          What People Say
        </h2>
        <div className="relative h-48">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key= key={testimonial.author + testimonial.quote}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeTestimonial ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full flex flex-col justify-center items-center text-center bg-gray-900/50 border-none text-white">
                <CardContent>
                  <p className="text-lg mb-4">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
