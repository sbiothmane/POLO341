'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import AnimatedBackground from '@/app/components/home/AnimatedBackground'
import Navbar from '@/app/components/home/Navbar'
import HeroSection from '@/app/components/home/HeroSection'
import ParallaxText from '@/app/components/home/ParallaxText'
import FeaturesSection from '@/app/components/home/FeaturesSection'
import TestimonialsSection from '@/app/components/home/TestimonialsSection'
import TeamSection from '@/app/components/home/TeamSection'
import CTASection from '@/app/components/home/CTASection'
import Footer from '@/app/components/home/Footer'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <AnimatedBackground />
      <Navbar />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />
      <main className="pt-24 relative z-10">
        <HeroSection />
        <ParallaxText baseVelocity={-5} />
        <FeaturesSection />
        <TestimonialsSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
