'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Sphere,
  MeshDistortMaterial,
  Text,
  Float,
  Stars,
} from '@react-three/drei'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, BarChart, Lock } from 'lucide-react'

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Management',
    description: 'Easily create and manage teams.',
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Peer Assessment',
    description: 'Intuitive interface for evaluating teammates.',
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: 'Analytics Dashboard',
    description: 'Comprehensive views of assessment results.',
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected.',
  },
]

const testimonials = [
  {
    quote: 'This platform has revolutionized how we handle team projects!',
    author: 'Prof. Jane Smith, Computer Science',
  },
  {
    quote: 'The peer assessment process is now smooth and insightful.',
    author: 'John Doe, Student',
  },
  {
    quote: "It's made managing multiple project teams so much easier.",
    author: 'Dr. Alex Johnson, Engineering',
  },
]

const teamMembers = [
  {
    name: 'Alvin Biju',
    role: 'Backend Developer',
    id: '40278182',
  },
  {
    name: 'Othmane Sbi',
    role: 'Backend Developer',
    id: '40249134',
  },
  {
    name: 'Youssef Youssef',
    role: 'Backend Developer',
    id: '40285384',
  },
  {
    name: 'William White',
    role: 'Frontend Developer',
    id: '40135771',
  },
  {
    name: 'Samy Belmihoub',
    role: 'Frontend Developer',
    id: '40251504',
  },
  {
    name: 'John Kaspar',
    role: 'Frontend Developer',
    id: '40285931',
  },
]

// Divisez le titre en lettres
const title = "Peer Assessment System";
const letters = title.split("");

// Définissez les variantes d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

const AnimatedSphere = () => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.cos(t / 4) / 2
    meshRef.current.rotation.y = Math.sin(t / 4) / 2
    meshRef.current.rotation.z = Math.sin(t / 1.5) / 2
    meshRef.current.position.x = Math.sin(t / 1) / 2
    meshRef.current.position.y = Math.cos(t / 1) / 2
    meshRef.current.scale.set(
      1 + Math.sin(t) * 0.2,
      1 + Math.sin(t) * 0.2,
      1 + Math.sin(t) * 0.2
    )
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1, 100, 200]}
        scale={2}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? '#FF6B6B' : '#4834d4'}
          attach="material"
          distort={0.5}
          speed={5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

const AnimatedText = ({ text }) => {
  const { viewport } = useThree()

  return (
    <Text
      color="#ffffff"
      fontSize={viewport.width / 20}
      maxWidth={viewport.width / 2}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <AnimatedSphere />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Float speed={1} rotationIntensity={1} floatIntensity={1}>
          
        </Float>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30" />
    </div>
  )
}

const AnimatedCard = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['17.5deg', '-17.5deg']
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-17.5deg', '17.5deg']
  )

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

const ParallaxText = ({ children, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, 5],
    {
      clamp: false,
    }
  )

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  )
}

function wrap(min, max, v) {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <AnimatedBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            PeerAssess
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild className="text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-full"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <main className="pt-24 relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-6 text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-extrabold mb-6 text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {letters.map((letter, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionize team dynamics with our cutting-edge platform.
              Evaluate, collaborate, and excel together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-full"
              >
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Parallax Text */}
        <ParallaxText baseVelocity={-5}></ParallaxText>

        {/* Features Section */}
        <section className="py-20 bg-white/10 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <AnimatedCard key={index}>
                  <Card className="bg-gray-900/50 border-none text-white h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {feature.icon}
                        <span className="ml-2">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
              What People Say
            </h2>
            <div className="relative h-48">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
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

        {/* Team Section */}
        <section className="py-20 bg-white/10 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedCard key={index}>
                  <Card className="bg-gray-900/50 border-none text-white h-full">
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>ID: {member.id}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Transform Team Assessments?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-full"
              >
                <Link href="/signup">
                  Get Started Now <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white/10 backdrop-blur-lg py-8">
        <div className="container mx-auto px-6 text-center text-white">
          <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
