'use client'

import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useSpring,
  useInView,
} from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, CheckCircle, Users, BarChart, Lock } from 'lucide-react'
import * as THREE from 'three'

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

// Custom Shader Material
const vertexShader = `
  uniform float uTime;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec3 pos = position;
    pos.x += sin(pos.y * 10.0 + uTime) * 0.1;
    pos.y += sin(pos.x * 10.0 + uTime) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`

const AnimatedParticles = () => {
  const pointsRef = useRef()
  const [positions, colors] = useMemo(() => {
    const positions = []
    const colors = []
    const numParticles = 5000

    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10
      positions.push(x, y, z)
      const color = new THREE.Color()
      color.setHSL((x + 5) / 10, 0.7, 0.5)
      colors.push(color.r, color.g, color.b)
    }

    return [new Float32Array(positions), new Float32Array(colors)]
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        vertexColors
      />
    </points>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <AnimatedParticles />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-gray-200/40 to-gray-400/40" />
    </div>
  )
}

const AnimatedCard = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const variants = {
    hidden: { opacity: 0, y: 50, rotateY: -10 },
    visible: { opacity: 1, y: 0, rotateY: 0 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
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
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            PeerAssess
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild className="text-gray-800">
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
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-600"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              Peer Assessment System
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionize team dynamics with our cutting-edge platform.
              Evaluate, collaborate, and excel together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
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

        {/* Features Section */}
        <section className="py-20 bg-white/70 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <AnimatedCard key={index}>
                  <Card className="bg-gray-100 border-none text-gray-800 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {feature.icon}
                        <span className="ml-2">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
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
        <section className="py-20 relative">
          <div className="absolute inset-0 overflow-hidden">
            <Canvas camera={{ position: [0, 0, 10] }}>
              <ambientLight intensity={0.5} />
              <Suspense fallback={null}>
                <AnimatedParticles />
              </Suspense>
            </Canvas>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
              What People Say
            </h2>
            <div className="relative h-48">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    index === activeTestimonial
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full flex flex-col justify-center items-center text-center bg-gray-100 border-none text-gray-800 hover:shadow-xl transition-shadow duration-300">
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
        <section className="py-20 bg-white/70 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedCard key={index}>
                  <Card className="bg-gray-100 border-none text-gray-800 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="text-gray-600">
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
        <section className="py-20 relative">
          <div className="absolute inset-0 overflow-hidden">
            <Canvas camera={{ position: [0, 0, 10] }}>
              <ambientLight intensity={0.5} />
              <Suspense fallback={null}>
                <AnimatedParticles />
              </Suspense>
            </Canvas>
          </div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Transform Team Assessments?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
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

      <footer className="bg-white/70 backdrop-blur-lg py-8">
        <div className="container mx-auto px-6 text-center text-gray-800">
          <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}